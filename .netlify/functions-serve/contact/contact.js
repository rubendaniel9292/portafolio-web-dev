const https = require('https');

/**
 * Realiza una petición HTTPS POST y devuelve la respuesta parseada.
 */
function httpsPost(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: {} });
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

    const CORS_HEADERS = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const data = JSON.parse(event.body);
        const { name, email, subject, message } = data;
        const turnstileToken = data['turnstile-token'];

        // --- Validar campos requeridos ---
        if (!name || !email || !subject || !message) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: false, error: 'Todos los campos son requeridos.' })
            };
        }

        // --- Verificar token de Turnstile con Cloudflare ---
        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (!secretKey) {
            console.error('TURNSTILE_SECRET_KEY no está configurada en las variables de entorno.');
            return {
                statusCode: 500,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: false, error: 'Error de configuración del servidor.' })
            };
        }

        if (!turnstileToken) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: false, error: 'Token de verificación de seguridad no proporcionado.' })
            };
        }

        const turnstilePayload = JSON.stringify({
            secret: secretKey,
            response: turnstileToken,
            remoteip: event.headers['x-forwarded-for'] || event.headers['client-ip']
        });

        const turnstileResult = await httpsPost(
            {
                hostname: 'challenges.cloudflare.com',
                path: '/turnstile/v0/siteverify',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(turnstilePayload)
                }
            },
            turnstilePayload
        );

        if (!turnstileResult.body.success) {
            console.warn('Turnstile verification failed:', turnstileResult.body);
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: false, error: 'Verificación de seguridad fallida. Por favor recarga la página e inténtalo de nuevo.' })
            };
        }

        // --- Enviar correo via FormSubmit ---
        const formData = {
            name,
            email,
            subject,
            message,
            '_subject': `Nuevo mensaje desde el portafolio - ${subject}`,
            '_captcha': 'false',
            '_template': 'table'
        };

        const postData = JSON.stringify(formData);

        const formSubmitResult = await httpsPost(
            {
                hostname: 'formsubmit.co',
                path: '/ajax/rubenrivas_17@hotmail.com',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'Accept': 'application/json'
                }
            },
            postData
        );

        // FormSubmit devuelve { success: "true" } o { success: "false", message: "..." }
        const fsBody = formSubmitResult.body;
        const fsSuccess = fsBody.success === true || fsBody.success === 'true';

        if (!fsSuccess) {
            const fsMessage = fsBody.message || 'Error al enviar el correo.';
            console.error('FormSubmit error:', fsMessage);

            // Si el formulario no está activado, dar instrucción clara
            const isNotActivated = fsMessage.toLowerCase().includes('not activated') || fsMessage.toLowerCase().includes('check your inbox');
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    success: false,
                    error: isNotActivated
                        ? 'El servicio de correo no está activado. Revisa tu bandeja de entrada en rubenrivas_17@hotmail.com y confirma el correo de FormSubmit.'
                        : fsMessage
                })
            };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error inesperado:', error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: false, error: 'Error interno del servidor.' })
        };
    }
};
