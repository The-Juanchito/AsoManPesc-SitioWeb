import { useState, useEffect } from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

function Navbar({ onLogin }: { onLogin: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: 'Inicio', icon: 'bi-house-door' },
    { href: '#galeria', label: 'Galería', icon: 'bi-images' },
    { href: '#nosotros', label: 'Nosotros', icon: 'bi-info-circle' },
    { href: '#productos', label: 'Productos', icon: 'bi-basket3' },
    { href: '#beneficios', label: 'Beneficios', icon: 'bi-star' },
    { href: '#tecnologias', label: 'Tecnología', icon: 'bi-cpu' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/98 shadow-xl backdrop-blur-md py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:rotate-3 ${
              scrolled ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-white/20 backdrop-blur-sm border border-white/30'
            }`}>
              <span className="text-2xl">🥭</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold transition-colors ${scrolled ? 'text-green-800' : 'text-white'}`}>
                AsoManPesc
              </h1>
              <p className={`text-[10px] font-medium transition-colors ${scrolled ? 'text-amber-600' : 'text-amber-200'}`}>
                Asociación de Venta de Mangos
              </p>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 group ${
                  scrolled
                    ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <i className={`bi ${link.icon} text-xs opacity-0 group-hover:opacity-100 transition-opacity`}></i>
                {link.label}
              </a>
            ))}
            <button
              onClick={onLogin}
              className={`ml-3 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 ${
                scrolled
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                  : 'bg-white text-green-800 hover:bg-amber-50'
              }`}
            >
              <i className="bi bi-box-arrow-in-right"></i>
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-xl transition-all ${
              scrolled ? 'text-green-800 hover:bg-green-50' : 'text-white hover:bg-white/10'
            }`}
          >
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 mt-4' : 'max-h-0'
        }`}>
          <div className={`rounded-2xl p-4 space-y-1 backdrop-blur-md ${
            scrolled ? 'bg-white shadow-xl border border-gray-100' : 'bg-black/40 border border-white/10'
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  scrolled
                    ? 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <i className={`bi ${link.icon}`}></i>
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { onLogin(); setIsOpen(false); }}
              className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onLogin }: { onLogin: () => void }) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://image.qwenlm.ai/generated-images/84e3bd8d-c0e0-4192-8d50-1681f143eb81/_result.png" 
          alt="Mangos frescos" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/70 to-amber-900/60"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <i className="bi bi-patch-check-fill"></i>
              Frescura Natural del Campo a Tu Mesa
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Los Mejores <span className="text-amber-400">Mangos</span> Directo del Productor
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
              En AsoManPesc trabajamos unidos para llevar la calidad y frescura de nuestros mangos a cada hogar. 
              Somos una asociación comprometida con la excelencia y el desarrollo de nuestra comunidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#productos" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                <i className="bi bi-basket3-fill"></i>
                Ver Productos
              </a>
              <button onClick={onLogin} className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <i className="bi bi-box-arrow-in-right"></i>
                Iniciar Sesión
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <i className="bi bi-basket3-fill text-3xl text-amber-400 mb-2"></i>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm text-white/70">Años de experiencia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white mt-8">
              <i className="bi bi-people-fill text-3xl text-amber-400 mb-2"></i>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-white/70">Productores asociados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <i className="bi bi-emoji-smile-fill text-3xl text-amber-400 mb-2"></i>
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm text-white/70">Clientes satisfechos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white mt-8">
              <i className="bi bi-arrow-repeat text-3xl text-amber-400 mb-2"></i>
              <p className="text-2xl font-bold">Precio</p>
              <p className="text-sm text-white/70">Variable diario</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="bi bi-chevron-double-down text-white text-2xl"></i>
      </div>
    </section>
  );
}

function Gallery() {
  const galleryItems = [
    {
      title: 'Mangos Frescos del Día',
      description: 'Selección diaria de mangos maduros, listos para disfrutar.',
      icon: 'bi-sun',
      color: 'from-amber-400 to-orange-500'
    },
    {
      title: 'Cultivo Sostenible',
      description: 'Nuestros cultivos respetan el medio ambiente y las prácticas agrícolas responsables.',
      icon: 'bi-tree',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Cosecha Manual',
      description: 'Cada mango es cosechado a mano para garantizar la mejor calidad.',
      icon: 'bi-hand-index',
      color: 'from-rose-400 to-pink-500'
    },
    {
      title: 'Empaque Cuidadoso',
      description: 'Preparamos cada canasta con cuidado para que llegue perfecta.',
      icon: 'bi-box-seam',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Entrega Rápida',
      description: 'Del campo a tu mesa en menos de 24 horas.',
      icon: 'bi-truck',
      color: 'from-purple-400 to-violet-500'
    },
    {
      title: 'Comunidad Unida',
      description: 'Más de 50 familias trabajando juntas por la excelencia.',
      icon: 'bi-people',
      color: 'from-teal-400 to-cyan-500'
    }
  ];

  return (
    <section id="galeria" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm uppercase tracking-wider bg-amber-50 px-4 py-1.5 rounded-full">
            <i className="bi bi-camera-fill"></i>
            Nuestra Galería
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-4 mb-4">
            El Proceso de Nuestros Mangos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce cada etapa del proceso, desde el cultivo hasta tu mesa.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-br ${item.color} p-8 h-64 flex flex-col justify-between text-white`}>
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <i className={`bi ${item.icon} text-2xl`}></i>
                  </div>
                  <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {['🥭', '🌱', '🤲', '📦', '🚚', '👨‍🌾'][index]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm uppercase tracking-wider bg-amber-50 px-4 py-1.5 rounded-full">
            <i className="bi bi-info-circle-fill"></i>
            Quiénes Somos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-4 mb-4">Nuestra Historia</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <i className="bi bi-patch-check-fill text-amber-500"></i>
              Tradición y Calidad en Cada Mango
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>AsoManPesc</strong> es una asociación de productores y comerciantes dedicados a la venta 
              de mangos de la más alta calidad. Nacimos de la unión de familias que comparten la pasión por 
              el cultivo y comercialización de esta deliciosa fruta tropical.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Nuestro compromiso es ofrecer mangos frescos, seleccionados cuidadosamente, garantizando 
              el mejor sabor y la mayor frescura en cada entrega. Trabajamos de la mano con nuestros 
              agricultores para asegurar prácticas sostenibles y un comercio justo.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '15+', label: 'Años de experiencia', icon: 'bi-calendar-check' },
                { value: '50+', label: 'Productores asociados', icon: 'bi-people' },
                { value: '1000+', label: 'Clientes satisfechos', icon: 'bi-emoji-smile' },
                { value: '100%', label: 'Mangos naturales', icon: 'bi-patch-check' }
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-green-50 to-amber-50 p-4 rounded-xl border border-green-100">
                  <i className={`bi ${stat.icon} text-amber-500 text-xl mb-1`}></i>
                  <div className="text-2xl font-bold text-green-700">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-amber-50 rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'bi-tree', title: 'Cultivo Sostenible', color: 'bg-green-500' },
                  { icon: 'bi-handshake', title: 'Comercio Justo', color: 'bg-amber-500' },
                  { icon: 'bi-trophy', title: 'Calidad Premium', color: 'bg-rose-500' },
                  { icon: 'bi-truck', title: 'Entrega Directa', color: 'bg-blue-500' }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <i className={`bi ${item.icon} text-white text-xl`}></i>
                    </div>
                    <h4 className="font-bold text-green-800 text-sm">{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Products() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const products = [
    { 
      name: "Mango Tommy Atkins", 
      description: "Grande, de piel roja-verdosa. Pulpa firme y poco fibrosa, ideal para exportación.", 
      color: "from-red-500 to-orange-400", 
      emoji: "🥭", 
      season: "Todo el año",
      characteristics: ["Firme", "Poco fibroso", "Grande"]
    },
    { 
      name: "Mango Ataulfo", 
      description: "Pequeño y dulce, color amarillo dorado. Sin fibra, cremoso y aromático.", 
      color: "from-yellow-400 to-amber-500", 
      emoji: "✨", 
      season: "Marzo - Junio",
      characteristics: ["Cremoso", "Sin fibra", "Aromático"]
    },
    { 
      name: "Mango Kent", 
      description: "Grande y jugoso con tonos verdes y rojos. Sabor dulce y textura suave.", 
      color: "from-green-600 to-red-500", 
      emoji: "💚", 
      season: "Junio - Agosto",
      characteristics: ["Jugoso", "Suave", "Dulce"]
    },
    { 
      name: "Mango Haden", 
      description: "Color rojo brillante con manchas amarillas. Sabor intenso y aromático.", 
      color: "from-red-600 to-yellow-400", 
      emoji: "🔴", 
      season: "Febrero - Mayo",
      characteristics: ["Intenso", "Aromático", "Colorido"]
    },
    { 
      name: "Mango Keitt", 
      description: "Mango grande de color verde incluso maduro. Pulpa dulce sin fibra.", 
      color: "from-green-500 to-yellow-300", 
      emoji: "🟢", 
      season: "Agosto - Septiembre",
      characteristics: ["Grande", "Sin fibra", "Verde"]
    },
    { 
      name: "Mango Manila", 
      description: "Pequeño, alargado y muy dulce. Favorito para consumir fresco y en postres.", 
      color: "from-yellow-300 to-orange-400", 
      emoji: "🌟", 
      season: "Abril - Julio",
      characteristics: ["Dulce", "Pequeño", "Alargado"]
    }
  ];

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : typeof window !== 'undefined' && window.innerWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="productos" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm uppercase tracking-wider bg-amber-50 px-4 py-1.5 rounded-full">
            <i className="bi bi-basket3-fill"></i>
            Nuestros Productos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-4 mb-4">Variedades de Mango</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Ofrecemos una amplia selección de variedades de mango, cada una con su sabor y textura única.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
            <i className="bi bi-tag-fill"></i>
            Precios variables según disponibilidad y temporada
          </div>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Controles de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-green-50 hover:scale-110 transition-all group"
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left text-2xl text-green-700 group-hover:text-green-800"></i>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-green-50 hover:scale-110 transition-all group"
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right text-2xl text-green-700 group-hover:text-green-800"></i>
          </button>

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden mx-8">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 h-full">
                    <div className={`h-40 bg-gradient-to-br ${product.color} flex items-center justify-center relative`}>
                      <span className="text-7xl group-hover:scale-125 transition-transform duration-500">{product.emoji}</span>
                      
                      {/* Badge de precio variable */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                        <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          <i className="bi bi-arrow-repeat"></i>
                          Precio Variable
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-green-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                      
                      {/* Características */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.characteristics.map((char, i) => (
                          <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">
                            {char}
                          </span>
                        ))}
                      </div>
                      
                      {/* Información de temporada */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <i className="bi bi-calendar3"></i>
                          {product.season}
                        </span>
                        <a 
                          href="https://wa.me/573242030867?text=Hola, me interesa conocer el precio actual de los mangos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-800 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          <i className="bi bi-whatsapp text-green-600"></i>
                          Consultar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-3 bg-green-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Control de auto-play */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-green-700 flex items-center gap-2 transition-colors"
            >
              <i className={`bi ${isAutoPlaying ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
              {isAutoPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
            </button>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-info-circle-fill text-2xl text-amber-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Precios Variables Según Disponibilidad</h4>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                Los precios de nuestras canastas de mangos varían diariamente según la disponibilidad, 
                calidad, temporada y demanda del mercado. No tenemos precios fijos publicados.
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>¿Cómo conocer el precio actual?</strong> Contáctanos directamente por WhatsApp al 
                <a href="https://wa.me/573242030867" target="_blank" rel="noopener noreferrer" className="text-green-700 font-bold hover:underline mx-1">
                  +57 324 203 0867
                </a>
                y con gusto te informaremos el precio del día.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    { icon: "bi-patch-check-fill", title: "100% Natural", description: "Sin pesticidas dañinos, respetando la naturaleza y tu salud.", color: "bg-green-500" },
    { icon: "bi-truck", title: "Entrega Fresca", description: "Del campo a tu mesa en tiempo récord.", color: "bg-blue-500" },
    { icon: "bi-cash-stack", title: "Precios Justos", description: "Sin intermediarios, los mejores precios del mercado.", color: "bg-amber-500" },
    { icon: "bi-trophy-fill", title: "Calidad Garantizada", description: "Riguroso proceso de selección en cada mango.", color: "bg-rose-500" },
    { icon: "bi-globe-americas", title: "Comercio Responsable", description: "Prácticas agrícolas sostenibles y bienestar comunitario.", color: "bg-teal-500" },
    { icon: "bi-box-seam-fill", title: "Mayor y Detal", description: "Atendemos pedidos pequeños y grandes volúmenes.", color: "bg-purple-500" }
  ];

  return (
    <section id="beneficios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm uppercase tracking-wider bg-amber-50 px-4 py-1.5 rounded-full">
            <i className="bi bi-star-fill"></i>
            ¿Por Qué Elegirnos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-4 mb-4">Nuestros Beneficios</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 text-center group hover:-translate-y-1">
              <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <i className={`bi ${benefit.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const technologies = [
    { name: 'React 18', description: 'Framework de interfaces de usuario', icon: 'bi-braces-asterisk', color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', description: 'Tipado estático para mayor seguridad', icon: 'bi-code-slash', color: 'from-blue-600 to-blue-800' },
    { name: 'Vite', description: 'Build tool ultrarrápido', icon: 'bi-lightning-charge-fill', color: 'from-purple-500 to-violet-600' },
    { name: 'Tailwind CSS', description: 'Framework de estilos utilitarios', icon: 'bi-palette-fill', color: 'from-cyan-500 to-teal-500' },
    { name: 'Bootstrap 5', description: 'Componentes e iconos profesionales', icon: 'bi-bootstrap', color: 'from-indigo-500 to-purple-600' },
    { name: 'MySQL', description: 'Base de datos relacional principal', icon: 'bi-database-fill', color: 'from-sky-500 to-blue-600' },
    { name: 'Recharts', description: 'Gráficas interactivas y dinámicas', icon: 'bi-graph-up', color: 'from-green-500 to-emerald-600' },
    { name: 'WhatsApp API', description: 'Comunicación directa con el admin', icon: 'bi-whatsapp', color: 'from-emerald-500 to-green-600' },
    { name: 'Chatbot IA', description: 'Asistente virtual inteligente', icon: 'bi-robot', color: 'from-rose-500 to-pink-600' },
    { name: 'LocalStorage', description: 'Persistencia de datos en navegador', icon: 'bi-hdd-fill', color: 'from-amber-500 to-orange-600' },
    { name: 'Node.js', description: 'Runtime de JavaScript', icon: 'bi-server', color: 'from-lime-500 to-green-600' },
    { name: 'Responsive', description: 'Adaptado a todos los dispositivos', icon: 'bi-phone', color: 'from-fuchsia-500 to-pink-600' },
  ];

  return (
    <section id="tecnologias" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm uppercase tracking-wider bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            <i className="bi bi-cpu-fill"></i>
            Tecnología
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">
            ¿Qué Programas Utilizamos?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nuestro sistema está construido con las mejores tecnologías modernas para garantizar rendimiento, seguridad y escalabilidad.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Grid de tecnologías */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {technologies.map((tech, i) => (
            <div
              key={i}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <i className={`bi ${tech.icon} text-white text-2xl`}></i>
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{tech.name}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{tech.description}</p>
            </div>
          ))}
        </div>

        {/* Arquitectura */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <i className="bi bi-diagram-3-fill text-amber-400"></i>
            Arquitectura del Sistema
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <i className="bi bi-window-desktop text-white text-3xl"></i>
              </div>
              <h4 className="font-bold text-white">Frontend</h4>
              <p className="text-xs text-gray-400 mt-1">React + TypeScript + Tailwind + Bootstrap 5</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <i className="bi bi-database-fill text-white text-3xl"></i>
              </div>
              <h4 className="font-bold text-white">MySQL</h4>
              <p className="text-xs text-gray-400 mt-1">Base de datos principal y persistente</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <i className="bi bi-whatsapp text-white text-3xl"></i>
              </div>
              <h4 className="font-bold text-white">WhatsApp</h4>
              <p className="text-xs text-gray-400 mt-1">Chat directo con el administrador</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <i className="bi bi-robot text-white text-3xl"></i>
              </div>
              <h4 className="font-bold text-white">Chatbot IA</h4>
              <p className="text-xs text-gray-400 mt-1">Asistente virtual inteligente</p>
            </div>
          </div>
        </div>

        {/* Precio destacado */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-6xl">🥭</span>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-amber-100">Canasta de Mangos Frescos</p>
              <p className="text-3xl sm:text-4xl font-bold">Precio Variable</p>
              <p className="text-amber-100 mt-1 text-sm">Según disponibilidad y temporada • Consulta por WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onLogin }: { onLogin: () => void }) {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🥭</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AsoManPesc</h3>
                <p className="text-amber-400 text-xs">Asociación de Venta de Mangos</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md mb-4">
              Somos una asociación comprometida con llevar los mejores mangos frescos 
              del campo a tu mesa. Calidad, frescura y sabor en cada fruta.
            </p>
            <button onClick={onLogin} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
              <i className="bi bi-box-arrow-in-right"></i>
              Acceder al Sistema
            </button>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
              <i className="bi bi-link-45deg"></i> Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-xs"></i>Inicio</a></li>
              <li><a href="#galeria" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-xs"></i>Galería</a></li>
              <li><a href="#nosotros" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-xs"></i>Nosotros</a></li>
              <li><a href="#productos" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-xs"></i>Productos</a></li>
              <li><a href="#beneficios" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i className="bi bi-chevron-right text-xs"></i>Beneficios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
              <i className="bi bi-telephone-fill"></i> Contacto
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-300 flex items-center gap-2">
                <i className="bi bi-whatsapp text-green-400"></i>
                +57 324 203 0867
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <i className="bi bi-envelope-fill text-amber-400"></i>
                ventas@asomanpesc.com
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <i className="bi bi-geo-alt-fill text-rose-400"></i>
                Mercado Central, Local 45-46
              </li>
              <li className="text-gray-300 flex items-center gap-2">
                <i className="bi bi-clock-fill text-blue-400"></i>
                Lun-Sáb 6AM-5PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 AsoManPesc - Asociación de Venta de Mangos. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2 flex items-center justify-center gap-2">
            <i className="bi bi-heart-fill text-rose-500"></i>
            Hecho con amor por nuestros asociados
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen font-sans">
      <Navbar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Gallery />
      <About />
      <Products />
      <Benefits />
      <TechStack />
      <Footer onLogin={onLogin} />
    </div>
  );
}
