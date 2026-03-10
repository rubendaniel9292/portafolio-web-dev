const https = require('https');

function httpsPost(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify(data);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, json: () => JSON.parse(body) });
                } catch (e) {
                    reject(new Error('Respuesta no es JSON válido: ' + body.substring(0, 100)));
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

exports.handler = async (event) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);

        // Verificar token de Turnstile
        // En local sin variable definida se usa la clave de prueba de Cloudflare
        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
        const turnstileToken = data['turnstile-token'];

        if (!turnstileToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: 'Token de seguridad requerido' })
            };
        }

        const verifyRes = await httpsPost('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                secret: turnstileSecret,
                response: turnstileToken,
                remoteip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || ''
            });

        const verifyData = verifyRes.json();

        if (!verifyData.success) {
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, error: 'Verificación de seguridad fallida' })
            };
        }

        // Preparar los datos para FormSubmit
        const formData = {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            '_subject': `Nuevo mensaje desde el portafolio - ${data.subject}`,
            '_captcha': 'false',
            '_template': 'table'
        };

        // Enviar a FormSubmit
        const response = await httpsPost('https://formsubmit.co/ajax/rubenrivas_17@hotmail.com', formData);

        const result = response.json();

        return {
            statusCode: 200,

            body: JSON.stringify({ success: true, data: result })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,

            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
