import { useRef, useEffect } from "react";
import Typed from "typed.js";

const Type = () => {
    const services = useRef(null);

    useEffect(() => {
        const typed = new Typed(services.current, {
            strings: [
                'Desarrollador Frontend',
                'Desarrollador Backend',
                'Consultor LOPDP',

            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true,
        });

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        };
    }, []);

    return (
        <h2
            ref={services}
            className="inline-block min-h-[1.2em]"
            style={{
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: '700'
            }}
        />
    );
};

export default Type;
