import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  console.log("🔄 Navbar rendering, open state:", open);

  const handleClick = () => {
    console.log("🎯 Button clicked! Current state:", open);
    setOpen(!open);
  };

  return (
    <nav className="hero-gradient shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          Mi Portafolio de proyectos
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
            Inicio
          </a>
          <a href="#sobre-mi" className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
            Sobre mí
          </a>
          <a href="#habilidades" className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
            Habilidades
          </a>
          <a href="#proyectos" className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
            Proyectos
          </a>
          <a href="#contacto" className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
            Contacto
          </a>
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={handleClick}
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          aria-label="Abrir menú"
          type="button"
        >
          <span className="text-xs block mb-1">State: {open ? 'OPEN' : 'CLOSED'}</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-1 bg-red-500 text-center">
          <div className="text-white font-bold py-2">🎉 MENÚ ABIERTO 🎉</div>
          <a href="#inicio" className="block text-white hover:text-gray-200 py-3 px-3 rounded-md hover:bg-white/10 transition-colors duration-200" onClick={() => setOpen(false)}>
            Inicio
          </a>
          <a href="#sobre-mi" className="block text-white hover:text-gray-200 py-3 px-3 rounded-md hover:bg-white/10 transition-colors duration-200" onClick={() => setOpen(false)}>
            Sobre mí
          </a>
          <a href="#habilidades" className="block text-white hover:text-gray-200 py-3 px-3 rounded-md hover:bg-white/10 transition-colors duration-200" onClick={() => setOpen(false)}>
            Habilidades
          </a>
          <a href="#proyectos" className="block text-white hover:text-gray-200 py-3 px-3 rounded-md hover:bg-white/10 transition-colors duration-200" onClick={() => setOpen(false)}>
            Proyectos
          </a>
          <a href="#contacto" className="block text-white hover:text-gray-200 py-3 px-3 rounded-md hover:bg-white/10 transition-colors duration-200" onClick={() => setOpen(false)}>
            Contacto
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;