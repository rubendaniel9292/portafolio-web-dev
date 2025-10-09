import  { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 📋 Opciones de menú en formato de objeto
  const menuItems = [
    { href: "#inicio", label: "Inicio" },
    { href: "#sobre-mi", label: "Sobre mí" },
    { href: "#habilidades", label: "Habilidades" },
    { href: "#proyectos", label: "Proyectos" },
    { href: "#contacto", label: "Contacto" }
  ];

  return (
    <nav className="hero-gradient shadow-lg ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          Mi Portafolio de proyectos
        </div>

        <div className="hidden md:flex space-x-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden px-6 pb-4 space-y-1 text-center ${isOpen ? 'block' : 'hidden'} border-t border-white/10`}
      >
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="block text-white py-2"
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;