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

        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken })
        });
        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            return { statusCode: 403, body: JSON.stringify({ success: false, error: 'Verificación de seguridad fallida' }) };
        }

        const response = await fetch('https://formsubmit.co/ajax/rubenrivas_17@hotmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                '_subject': `Nuevo mensaje desde el portafolio - ${data.subject}`,
                '_captcha': 'false',
                '_template': 'table'
            })
        });
        const result = await response.json();

        return { statusCode: 200, body: JSON.stringify({ success: true, data: result }) };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};

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


