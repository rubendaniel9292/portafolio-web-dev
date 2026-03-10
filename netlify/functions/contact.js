import axios from 'axios';

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
        const turnstileToken = data['turnstile-token'];

        if (!turnstileToken) {
            return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Token de seguridad requerido' }) };
        }

        const verifyRes = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            secret: turnstileSecret,
            response: turnstileToken
        }, { validateStatus: () => true });

        if (!verifyRes.data.success) {
            return { statusCode: 403, body: JSON.stringify({ success: false, error: 'Verificación de seguridad fallida' }) };
        }

        const response = await axios.post('https://formsubmit.co/ajax/rubenrivas_17@hotmail.com', {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            '_subject': `Nuevo mensaje desde el portafolio - ${data.subject}`,
            '_captcha': 'false',
            '_template': 'table'
        }, {
            headers: { 'Accept': 'application/json' }
        });

        return { statusCode: 200, body: JSON.stringify({ success: true, data: response.data }) };
    } catch (error) {
        console.error('Error:', error.message);
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
