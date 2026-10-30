import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hola', 'buenos', 'buenas', 'hey', 'saludos'],
    response: '¡Hola! 👋 Soy el asistente virtual de AsoManPesc. ¿En qué puedo ayudarte hoy? Puedo explicarte sobre nuestros mangos, el sistema de pedidos, o cómo usar la plataforma.'
  },
  {
    keywords: ['mango', 'mangos', 'fruta', 'variedad', 'producto', 'productos'],
    response: '🥭 ¡Tenemos 6 variedades de mango! Tommy Atkins ($2.50/kg), Ataulfo ($3.00/kg), Kent ($3.50/kg), Haden ($2.80/kg), Keitt ($3.20/kg) y Manila ($2.00/kg). Todos son 100% naturales y frescos del campo.'
  },
  {
    keywords: ['precio', 'costo', 'cuanto', 'cuánto', 'vale', 'cuesta'],
    response: '💰 Nuestros precios van desde $2.00/kg (Manila) hasta $3.50/kg (Kent). Si compras más de 10kg ¡tienes 10% de descuento! Los precios pueden variar según la temporada.'
  },
  {
    keywords: ['pedido', 'pedir', 'comprar', 'ordenar', 'orden'],
    response: '🛒 Para hacer un pedido: 1) Inicia sesión como cliente, 2) Ve a la sección "Productos", 3) Haz clic en "Hacer Pedido", 4) Selecciona el mango y la cantidad. También puedes llamarnos al +502 5555-1234.'
  },
  {
    keywords: ['admin', 'administrador', 'panel admin'],
    response: '📊 El panel de administrador te permite ver: gráficas de producción, total de canastas recogidas por día, qué productores han contribuido, usuarios nuevos registrados y nuestras colaboraciones con Hit Social y Postobón.'
  },
  {
    keywords: ['asociado', 'productor', 'cosecha', 'cultivo', 'cajas', 'canasta', 'canastas'],
    response: '🧺 Como asociado puedes: registrar tu producción (cajas y canastillas), llevar el conteo de canastas recogidas, ver tu historial y gráficas de tu producción. ¡Todo para que no se pierda la cuenta!'
  },
  {
    keywords: ['login', 'ingresar', 'sesión', 'sesion', 'entrar', 'acceder', 'contraseña', 'password'],
    response: '🔐 Para iniciar sesión haz clic en "Iniciar Sesión". Cuentas demo:\n• Admin: admin@asomanpesc.com / admin123\n• Asociado: jose@asomanpesc.com / asociado123\n• Cliente: carlos@cliente.com / cliente123'
  },
  {
    keywords: ['horario', 'hora', 'abierto', 'atencion', 'atención'],
    response: '🕐 Nuestro horario de atención es: Lunes a Sábado de 6:00 AM a 5:00 PM. Domingos de 6:00 AM a 12:00 PM.'
  },
  {
    keywords: ['contacto', 'telefono', 'teléfono', 'email', 'correo', 'whatsapp', 'dirección', 'direccion'],
    response: '📞 Contáctanos:\n• WhatsApp: +502 5555-1234\n• Email: ventas@asomanpesc.com\n• Dirección: Mercado Central, Local 45-46'
  },
  {
    keywords: ['postobon', 'postobón', 'hit', 'colaboracion', 'colaboración', 'aliado'],
    response: '🤝 Trabajamos con aliados estratégicos:\n• **Hit Social**: Marketing digital y redes sociales\n• **Postobón**: Distribución y logística nacional\nEstas alianzas nos ayudan a crecer y llegar a más clientes.'
  },
  {
    keywords: ['nosotros', 'historia', 'quienes', 'quiénes', 'asociacion', 'asociación'],
    response: '🌿 AsoManPesc es una asociación con más de 15 años de experiencia, 50+ productores asociados y 1000+ clientes satisfechos. Nos dedicamos a llevar los mejores mangos del campo a tu mesa con prácticas sostenibles.'
  },
  {
    keywords: ['envio', 'envío', 'entrega', 'delivery', 'domicilio'],
    response: '🚚 Hacemos entregas directas del campo a tu mesa. Los pedidos se procesan en 24-48 horas. Para pedidos grandes (al mayor) coordinamos fechas de entrega especiales.'
  },
  {
    keywords: ['grafica', 'gráfica', 'grafico', 'gráfico', 'estadistica', 'estadística', 'dashboard'],
    response: '📈 En el panel de administrador encontrarás gráficas de: canastas recogidas por día, producción por asociado, tendencia de producción y estadísticas en tiempo real de toda la operación.'
  },
  {
    keywords: ['ayuda', 'help', 'como', 'cómo', 'no entiendo', 'no se', 'no sé', 'explica'],
    response: '¡Estoy aquí para ayudarte! 🤗 Puedes preguntarme sobre:\n• Nuestros mangos y precios\n• Cómo hacer pedidos\n• Cómo usar el sistema\n• Información de contacto\n• Colaboraciones\n• Horarios\n\n¡Escríbeme lo que necesites!'
  },
  {
    keywords: ['gracias', 'thanks', 'thank'],
    response: '¡De nada! 😊 Estoy aquí para ayudarte siempre. Si tienes más preguntas no dudes en escribirme. ¡Que disfrutes nuestros deliciosos mangos! 🥭'
  },
  {
    keywords: ['beneficio', 'ventajas', 'por que', 'por qué', 'elegir'],
    response: '✅ ¿Por qué elegir AsoManPesc?\n• 100% Natural sin pesticidas\n• Entrega fresca del campo a tu mesa\n• Precios justos sin intermediarios\n• Calidad garantizada\n• Comercio responsable\n• Pedidos al mayor y detal'
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
  
  return '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n• Información sobre mangos y precios\n• Cómo hacer pedidos\n• Uso del sistema (admin, asociado, cliente)\n• Datos de contacto\n• Colaboraciones (Hit Social, Postobón)\n• Horarios y ubicación\n\n¿Sobre qué tema te gustaría saber más?';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy el asistente virtual de AsoManPesc. ¿En qué puedo ayudarte? Puedes preguntarme sobre nuestros mangos, precios, pedidos o cómo usar la plataforma.',
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
    setInput('');
    setIsTyping(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const botResponse = getBotResponse(input);
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

  const quickQuestions = [
    '¿Qué mangos tienen?',
    '¿Cómo hago un pedido?',
    '¿Cuáles son los precios?',
    '¿Cómo funciona el sistema?',
    'Datos de contacto'
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-0' 
            : 'bg-green-600 hover:bg-green-700 animate-bounce'
        }`}
        style={{ animationDuration: isOpen ? '0s' : '2s' }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Badge de notificación */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white shadow-lg rounded-xl p-3 max-w-[200px] animate-pulse">
          <p className="text-xs text-gray-600">¿Necesitas ayuda? ¡Pregúntame!</p>
        </div>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-800 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🥭</span>
              </div>
              <div>
                <h3 className="font-bold">Asistente AsoManPesc</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-100">En línea</span>
                </div>
              </div>
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

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
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
                className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
