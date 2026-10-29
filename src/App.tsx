import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥭</span>
            <div>
              <h1 className="text-xl font-bold text-green-800">AsoManPesc</h1>
              <p className="text-xs text-amber-600 -mt-1">Asociación de Venta de Mangos</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Inicio</a>
            <a href="#nosotros" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Nosotros</a>
            <a href="#productos" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Productos</a>
            <a href="#beneficios" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Beneficios</a>
            <a href="#contacto" className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition-colors font-medium">Contacto</a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#inicio" className="block py-2 text-gray-700 hover:text-green-700 font-medium">Inicio</a>
            <a href="#nosotros" className="block py-2 text-gray-700 hover:text-green-700 font-medium">Nosotros</a>
            <a href="#productos" className="block py-2 text-gray-700 hover:text-green-700 font-medium">Productos</a>
            <a href="#beneficios" className="block py-2 text-gray-700 hover:text-green-700 font-medium">Beneficios</a>
            <a href="#contacto" className="block py-2 text-green-700 font-medium">Contacto</a>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://image.qwenlm.ai/generated-images/84e3bd8d-c0e0-4192-8d50-1681f143eb81/_result.png" 
          alt="Mangos frescos" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="max-w-2xl">
          <div className="inline-block bg-amber-500/90 text-white px-4 py-1 rounded-full text-sm font-medium mb-6">
            🌿 Frescura Natural del Campo a Tu Mesa
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Los Mejores <span className="text-amber-400">Mangos</span> Directo del Productor
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
            En AsoManPesc trabajamos unidos para llevar la calidad y frescura de nuestros mangos a cada hogar. 
            Somos una asociación comprometida con la excelencia y el desarrollo de nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#productos" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg">
              Ver Productos
            </a>
            <a href="#nosotros" className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-full font-bold text-lg transition-all">
              Conócenos
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Quiénes Somos</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-2 mb-4">Nuestra Historia</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">Tradición y Calidad en Cada Mango</h3>
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
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="text-3xl font-bold text-green-700">15+</div>
                <div className="text-sm text-gray-500">Años de experiencia</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="text-3xl font-bold text-amber-600">50+</div>
                <div className="text-sm text-gray-500">Productores asociados</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="text-3xl font-bold text-green-700">1000+</div>
                <div className="text-sm text-gray-500">Clientes satisfechos</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="text-3xl font-bold text-amber-600">100%</div>
                <div className="text-sm text-gray-500">Mangos naturales</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-amber-50 rounded-3xl p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <span className="text-4xl mb-2 block">🌱</span>
                  <h4 className="font-bold text-green-800 text-sm">Cultivo Sostenible</h4>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <span className="text-4xl mb-2 block">🤝</span>
                  <h4 className="font-bold text-green-800 text-sm">Comercio Justo</h4>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <span className="text-4xl mb-2 block">🏆</span>
                  <h4 className="font-bold text-green-800 text-sm">Calidad Premium</h4>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <span className="text-4xl mb-2 block">🚛</span>
                  <h4 className="font-bold text-green-800 text-sm">Entrega Directa</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Products() {
  const products = [
    {
      name: "Mango Tommy Atkins",
      description: "Grande, de piel roja-verdosa. Pulpa firme y poco fibrosa, ideal para exportación.",
      color: "from-red-500 to-orange-400",
      emoji: "🥭",
      season: "Todo el año",
      price: "Desde $2.50/kg"
    },
    {
      name: "Mango Ataulfo (Mango de Oro)",
      description: "Pequeño y dulce, color amarillo dorado. Sin fibra, cremoso y aromático.",
      color: "from-yellow-400 to-amber-500",
      emoji: "✨",
      season: "Marzo - Junio",
      price: "Desde $3.00/kg"
    },
    {
      name: "Mango Kent",
      description: "Grande y jugoso con tonos verdes y rojos. Sabor dulce y textura suave.",
      color: "from-green-600 to-red-500",
      emoji: "💚",
      season: "Junio - Agosto",
      price: "Desde $3.50/kg"
    },
    {
      name: "Mango Haden",
      description: "Color rojo brillante con manchas amarillas. Sabor intenso y aromático.",
      color: "from-red-600 to-yellow-400",
      emoji: "🔴",
      season: "Febrero - Mayo",
      price: "Desde $2.80/kg"
    },
    {
      name: "Mango Keitt",
      description: "Mango grande de color verde incluso maduro. Pulpa dulce sin fibra.",
      color: "from-green-500 to-yellow-300",
      emoji: "🟢",
      season: "Agosto - Septiembre",
      price: "Desde $3.20/kg"
    },
    {
      name: "Mango Manila",
      description: "Pequeño, alargado y muy dulce. Favorito para consumir fresco y en postres.",
      color: "from-yellow-300 to-orange-400",
      emoji: "🌟",
      season: "Abril - Julio",
      price: "Desde $2.00/kg"
    }
  ];

  return (
    <section id="productos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Nuestros Productos</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-2 mb-4">Variedades de Mango</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia selección de variedades de mango, cada una con su sabor y textura única. 
            Todos cultivados con amor y dedicación por nuestros asociados.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">
              <div className={`h-32 bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    📅 {product.season}
                  </span>
                  <span className="text-amber-600 font-bold">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    {
      icon: "🌿",
      title: "100% Natural",
      description: "Nuestros mangos son cultivados sin pesticidas dañinos, respetando la naturaleza y tu salud."
    },
    {
      icon: "🚚",
      title: "Entrega Fresca",
      description: "Del campo a tu mesa en tiempo récord. Garantizamos frescura en cada entrega."
    },
    {
      icon: "💰",
      title: "Precios Justos",
      description: "Al ser asociación, eliminamos intermediarios y ofrecemos los mejores precios del mercado."
    },
    {
      icon: "🏅",
      title: "Calidad Garantizada",
      description: "Cada mango pasa por un riguroso proceso de selección antes de llegar a tus manos."
    },
    {
      icon: "🌍",
      title: "Comercio Responsable",
      description: "Apoyamos prácticas agrícolas sostenibles y el bienestar de nuestras comunidades."
    },
    {
      icon: "📦",
      title: "Pedidos al Mayor y Detal",
      description: "Atendemos tanto pedidos pequeños como grandes volúmenes para negocios y eventos."
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">¿Por Qué Elegirnos?</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-2 mb-4">Nuestros Beneficios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En AsoManPesc nos diferenciamos por nuestro compromiso con la calidad, la frescura y el servicio excepcional.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-50 hover:border-green-200 text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-green-800 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Clienta frecuente",
      text: "Los mangos de AsoManPesc son los más frescos y dulces que he probado. Siempre llegan en perfectas condiciones.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Dueño de restaurante",
      text: "Como empresario, necesito proveedores confiables. AsoManPesc nunca me ha fallado, calidad constante y precios justos.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Compradora al mayor",
      text: "Excelente servicio y productos de primera. Los mangos Ataulfo son increíbles para mis jugos y postres.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Testimonios</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-200 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-amber-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Contáctanos</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-2 mb-4">¿Listo Para Ordenar?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para atenderte. Contáctanos para pedidos al mayor o detal, cotizaciones o cualquier consulta.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Dirección</h4>
                  <p className="text-gray-600">Mercado Central, Local 45-46<br/>Zona de Frutas y Verduras</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Teléfono</h4>
                  <p className="text-gray-600">+502 5555-1234<br/>+502 5555-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Email</h4>
                  <p className="text-gray-600">ventas@asomanpesc.com<br/>info@asomanpesc.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🕐</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Horario</h4>
                  <p className="text-gray-600">Lunes a Sábado: 6:00 AM - 5:00 PM<br/>Domingo: 6:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <a href="#" className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors">
                <span className="text-sm">ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center hover:bg-green-800 transition-colors">
                <span className="text-sm">wa</span>
              </a>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-green-800 mb-6">Envíanos un Mensaje</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / Email</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" placeholder="Tu contacto" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pedido</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all">
                  <option>Pedido al Detal</option>
                  <option>Pedido al Mayor</option>
                  <option>Cotización Especial</option>
                  <option>Información General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none" placeholder="Cuéntanos qué necesitas..."></textarea>
              </div>
              <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl">
                Enviar Mensaje 🥭
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🥭</span>
              <div>
                <h3 className="text-xl font-bold">AsoManPesc</h3>
                <p className="text-amber-400 text-xs">Asociación de Venta de Mangos</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Somos una asociación comprometida con llevar los mejores mangos frescos 
              del campo a tu mesa. Calidad, frescura y sabor en cada fruta.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#productos" className="text-gray-300 hover:text-white transition-colors">Productos</a></li>
              <li><a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-4">Variedades</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Tommy Atkins</li>
              <li className="text-gray-300">Ataulfo</li>
              <li className="text-gray-300">Kent</li>
              <li className="text-gray-300">Haden</li>
              <li className="text-gray-300">Manila</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 AsoManPesc - Asociación de Venta de Mangos. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Hecho con ❤️ por nuestros asociados
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Benefits />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
