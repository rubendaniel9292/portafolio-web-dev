exports.handler = async (event) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // Enviar a FormSubmit desde el servidor (sin CORS)
        const response = await fetch('https://formsubmit.co/ajax/jose_rivas2008@hotmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                '_subject': 'Nueva cotización de seguro desde National North South',
                '_captcha': 'false',
                '_template': 'table',
                '_cc': 'negocios@nationalnorthsouth.com'
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
