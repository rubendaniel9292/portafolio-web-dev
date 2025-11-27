import { useState } from 'react';
import Turnstile from 'react-turnstile';

const ContactForm = () => {
    // Configuración de Turnstile
   
    const siteKey = "0x4AAAAAAB-UUn_Y0IHOlhf8" || "1x00000000000000000000AA";

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: false,
        message: ''
    });

    const [turnstileToken, setTurnstileToken] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que Turnstile esté verificado
        if (!turnstileToken) {
            setStatus({
                loading: false,
                success: false,
                error: true,
                message: 'Por favor completa la verificación de seguridad antes de enviar.'
            });

            // Limpiar mensaje de validación después de 4 segundos
            setTimeout(() => {
                setStatus({
                    loading: false,
                    success: false,
                    error: false,
                    message: ''
                });
            }, 4000);
            return;
        }

        setStatus({ loading: true, success: false, error: false, message: '' });

        try {
            const response = await fetch('/.netlify/functions/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    'turnstile-token': turnstileToken
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({
                    loading: false,
                    success: true,
                    error: false,
                    message: '¡Mensaje enviado exitosamente! Te contactaré pronto.'
                });

                // Limpiar formulario
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setTurnstileToken(''); // Limpiar token

                // Limpiar mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    setStatus({
                        loading: false,
                        success: false,
                        error: false,
                        message: ''
                    });
                }, 5000);
            } else {
                throw new Error(result.error || 'Error al enviar');
            }
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: true,
                message: 'Error al enviar el mensaje. Inténtalo de nuevo.'
            });

            // Limpiar mensaje de error después de 5 segundos
            setTimeout(() => {
                setStatus({
                    loading: false,
                    success: false,
                    error: false,
                    message: ''
                });
            }, 5000);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Envíame un mensaje</h3>
            </div>

            {/* Mensaje de estado */}
            {status.message && (
                <div className={`mb-4 p-3 rounded-md ${status.success
                        ? 'bg-green-500/20 border border-green-400/30 text-green-200'
                        : 'bg-red-500/20 border border-red-400/30 text-red-200'
                    }`}>
                    <span className="text-sm font-medium">{status.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            disabled={status.loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            disabled={status.loading}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-1">
                        Asunto
                    </label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Asunto del mensaje"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                        disabled={status.loading}
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
                        Mensaje
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Escribe tu mensaje aquí..."
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical transition-all"
                        required
                        disabled={status.loading}
                    ></textarea>
                </div>

                {/* Turnstile Security Verification */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Verificación de seguridad
                    </label>
                    <div className="flex justify-center">
                        <Turnstile
                            sitekey={siteKey}
                            onVerify={(token) => setTurnstileToken(token)}
                            onExpire={() => setTurnstileToken("")}
                            onError={() => setTurnstileToken("")}
                            theme="dark"
                            size="normal"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status.loading || !turnstileToken}
                    className={`w-full font-semibold py-3 transition-all duration-200 rounded-md flex items-center justify-center gap-2 ${status.loading || !turnstileToken
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                        }`}
                >
                    {status.loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Enviando...
                        </>
                    ) : !turnstileToken ? (
                        'Completa la verificación'
                    ) : (
                        'Enviar mensaje'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;