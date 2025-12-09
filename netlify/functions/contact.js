exports.handler = async (event) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // Enviar a FormSubmit desde el servidor (sin CORS)
        const response = await fetch('https://formsubmit.co/ajax/rubenrivas_17@hotmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                '_subject': 'Nuevo mensaje desde el portafolio - ' + data.subject,
                '_captcha': 'false',
                '_template': 'table'
            })
        });

        const result = await response.json();

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
