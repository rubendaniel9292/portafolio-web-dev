const https = require('https');

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

        // Enviar a FormSubmit usando https nativo
        const postData = JSON.stringify(formData);
        
        const options = {
            hostname: 'formsubmit.co',
            path: '/ajax/rubenrivas_17@hotmail.com',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Accept': 'application/json'
            }
        };

        const result = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve({ success: true });
                    }
                });
            });
            
            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: true, data: result })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
