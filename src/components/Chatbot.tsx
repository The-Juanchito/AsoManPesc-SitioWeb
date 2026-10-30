import { useState, useRef, useEffect } from 'react';

// Número del administrador para WhatsApp
const ADMIN_WHATSAPP = '573242030867';
const ADMIN_NAME = 'Administrador AsoManPesc';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hola', 'buenos', 'buenas', 'hey', 'saludos'],
    response: '¡Hola! 👋 Soy el asistente virtual de AsoManPesc. ¿En qué puedo ayudarte hoy?\n\n📌 Puedo ayudarte con:\n• Info sobre mangos y precios\n• Hacer pedidos\n• Contactar al admin por WhatsApp\n• Uso de la plataforma'
  },
  {
    keywords: ['mango', 'mangos', 'fruta', 'variedad', 'producto', 'productos'],
    response: '🥭 ¡Tenemos 6 variedades de mango!\n\n• Tommy Atkins - $4,000 COP/canasta\n• Ataulfo - $4,000 COP/canasta\n• Kent - $4,000 COP/canasta\n• Haden - $4,000 COP/canasta\n• Keitt - $4,000 COP/canasta\n• Manila - $4,000 COP/canasta\n\n💰 Todas las canastas a $4,000 COP'
  },
  {
    keywords: ['precio', 'costo', 'cuanto', 'cuánto', 'vale', 'cuesta', 'canasta'],
    response: '💰 Nuestro precio por canasta es:\n\n🥭 $4,000 COP por canasta\n\n¡Si compras más de 10 canastas tienes descuento especial! Contacta al admin para más info.'
  },
  {
    keywords: ['pedido', 'pedir', 'comprar', 'ordenar', 'orden'],
    response: '🛒 Para hacer un pedido:\n\n1️⃣ Inicia sesión como cliente\n2️⃣ Ve a "Productos"\n3️⃣ Haz clic en "Hacer Pedido"\n4️⃣ Selecciona el mango y la cantidad\n\n💰 Precio: $4,000 COP por canasta\n\n¿Necesitas ayuda? ¡Escríbele al admin por WhatsApp!'
  },
  {
    keywords: ['whatsapp', 'admin', 'administrador', 'contactar', 'hablar', 'mensaje', 'comunicar'],
    response: '📱 ¡Claro! Puedes contactar al administrador directamente por WhatsApp:\n\n👤 ' + ADMIN_NAME + '\n📞 +57 324 203 0867\n\nHaz clic en el botón verde de WhatsApp abajo o en el botón "Contactar Admin" para abrir el chat directamente.'
  },
  {
    keywords: ['asociado', 'productor', 'cosecha', 'cultivo', 'cajas', 'canastas'],
    response: '🧺 Como asociado puedes:\n\n✅ Registrar tu producción (cajas y canastillas)\n✅ Llevar el conteo de canastas recogidas\n✅ Ver tu historial y gráficas\n✅ Precio por canasta: $4,000 COP\n\n¡Todo para que no se pierda la cuenta!'
  },
  {
    keywords: ['login', 'ingresar', 'sesión', 'sesion', 'entrar', 'acceder', 'contraseña', 'password'],
    response: '🔐 Para iniciar sesión haz clic en "Iniciar Sesión".\n\nCuentas demo:\n• Admin: admin@asomanpesc.com / admin123\n• Asociado: jose@asomanpesc.com / asociado123\n• Cliente: carlos@cliente.com / cliente123'
  },
  {
    keywords: ['horario', 'hora', 'abierto', 'atencion', 'atención'],
    response: '🕐 Nuestro horario de atención:\n\n📅 Lunes a Sábado: 6:00 AM - 5:00 PM\n📅 Domingo: 6:00 AM - 12:00 PM\n\n📞 WhatsApp admin: +57 324 203 0867'
  },
  {
    keywords: ['contacto', 'telefono', 'teléfono', 'email', 'correo', 'dirección', 'direccion'],
    response: '📞 Contáctanos:\n\n📱 WhatsApp Admin: +57 324 203 0867\n✉️ Email: ventas@asomanpesc.com\n📍 Mercado Central, Local 45-46\n\n💬 También puedes usar el botón de WhatsApp para escribir directamente al admin.'
  },
  {
    keywords: ['postobon', 'postobón', 'hit', 'colaboracion', 'colaboración', 'aliado'],
    response: '🤝 Nuestros aliados estratégicos:\n\n🔴 Hit Social - Marketing digital y redes sociales\n🔵 Postobón - Distribución y logística nacional\n\nEstas alianzas nos ayudan a crecer y llegar a más clientes.'
  },
  {
    keywords: ['nosotros', 'historia', 'quienes', 'quiénes', 'asociacion', 'asociación'],
    response: '🌿 AsoManPesc es una asociación con más de 15 años de experiencia, 50+ productores asociados y 1000+ clientes satisfechos.\n\n💰 Canasta de mangos: $4,000 COP\n🌱 100% Natural y fresco del campo'
  },
  {
    keywords: ['envio', 'envío', 'entrega', 'delivery', 'domicilio'],
    response: '🚚 Entregas directas del campo a tu mesa.\n\n⏰ Pedidos procesados en 24-48 horas\n💰 $4,000 COP por canasta\n📱 Coordina con el admin: +57 324 203 0867'
  },
  {
    keywords: ['grafica', 'gráfica', 'grafico', 'gráfico', 'estadistica', 'estadística', 'dashboard'],
    response: '📈 En el panel de administrador encontrarás:\n\n📊 Gráficas de canastas por día\n🥭 Producción por asociado\n📈 Tendencia de producción\n💰 Ingresos totales ($4,000 COP/canasta)\n👥 Usuarios registrados'
  },
  {
    keywords: ['base de datos', 'database', 'mysql', 'sql', 'datos'],
    response: '💾 Nuestro sistema usa:\n\n🐬 MySQL - Base de datos principal\n🔷 SQL Server - Base de datos secundaria\n💾 LocalStorage - Caché en navegador\n\nEl administrador puede ver la configuración de conexión en el panel.'
  },
  {
    keywords: ['ayuda', 'help', 'como', 'cómo', 'no entiendo', 'no se', 'no sé', 'explica'],
    response: '¡Estoy aquí para ayudarte! 🤗\n\nPuedo ayudarte con:\n• 🥭 Info sobre mangos y precios ($4,000 COP/canasta)\n• 🛒 Cómo hacer pedidos\n• 📱 Contactar al admin por WhatsApp\n• 🔐 Uso del sistema\n• 📊 Gráficas y reportes\n\n¿Sobre qué necesitas info?'
  },
  {
    keywords: ['gracias', 'thanks', 'thank'],
    response: '¡De nada! 😊 Estoy aquí para ayudarte.\n\nSi necesitas algo más, no dudes en escribirme.\n\n📱 También puedes contactar al admin directamente:\n👤 +57 324 203 0867\n\n¡Que disfrutes nuestros mangos! 🥭'
  },
  {
    keywords: ['beneficio', 'ventajas', 'por que', 'por qué', 'elegir'],
    response: '✅ ¿Por qué elegir AsoManPesc?\n\n🌿 100% Natural sin pesticidas\n🚚 Entrega fresca del campo a tu mesa\n💰 Precios justos: $4,000 COP/canasta\n🏅 Calidad garantizada\n🌍 Comercio responsable\n📦 Pedidos al mayor y detal'
  }
];

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const item of botResponses) {
    const hasKeyword = item.keywords.some(keyword => {
      const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return lowerMessage.includes(normalizedKeyword);
    });
    if (hasKeyword) return item.response;
  }
  
  return '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n• 🥭 Mangos y precios ($4,000 COP/canasta)\n• 🛒 Cómo hacer pedidos\n• 📱 Contactar al admin por WhatsApp (+57 324 203 0867)\n• 🔐 Uso del sistema\n• 💾 Base de datos (MySQL/SQL Server)\n\n¿Sobre qué tema necesitas info?';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy el asistente virtual de AsoManPesc.\n\n¿En qué puedo ayudarte?\n\n💬 Pregúntame sobre:\n• Mangos y precios ($4,000 COP/canasta)\n• Cómo hacer pedidos\n• Contactar al admin por WhatsApp\n• Uso de la plataforma',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(currentInput);
      const botMessage: Message = {
        id: String(Date.now() + 1),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Soy usuario de AsoManPesc y necesito información.');
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  };

  const quickQuestions = [
    '¿Qué mangos tienen?',
    '¿Precio de la canasta?',
    '¿Cómo hago un pedido?',
    'Contactar admin WhatsApp',
    '¿Cómo funciona el sistema?'
  ];

  return (
    <>
      {/* Botón flotante de WhatsApp */}
      <a
        href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('¡Hola! Soy usuario de AsoManPesc y necesito información.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title={`Contactar al admin por WhatsApp: +57 324 203 0867`}
      >
        <i className="bi bi-whatsapp"></i>
      </a>

      {/* Botón del chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-700 hover:bg-green-800 bounce-slow'
        }`}
      >
        {isOpen ? (
          <i className="bi bi-x-lg text-white text-xl"></i>
        ) : (
          <i className="bi bi-chat-dots-fill text-white text-xl"></i>
        )}
      </button>

      {/* Tooltip del chatbot */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white shadow-lg rounded-xl p-3 max-w-[220px] border border-gray-100">
          <p className="text-xs text-gray-600 font-medium">💬 ¿Necesitas ayuda? Pregúntame o <button onClick={openWhatsApp} className="text-green-600 font-bold underline">escribe al admin</button></p>
        </div>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-800 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="bi bi-chat-heart-fill text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold">Asistente AsoManPesc</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-100">En línea</span>
                  </div>
                </div>
              </div>
              <button onClick={openWhatsApp} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors" title="Contactar admin por WhatsApp">
                <i className="bi bi-whatsapp text-lg"></i>
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas rápidas */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Preguntas frecuentes:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors border border-green-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón WhatsApp + Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <button
              onClick={openWhatsApp}
              className="w-full mb-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <i className="bi bi-whatsapp text-lg"></i>
              Escribir al Admin (+57 324 203 0867)
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-gray-50 focus:ring-2 focus:ring-green-200 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
