'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Rise Investment Advisor chatbot. I can help you with:\n\n• Investment strategies\n• Options trading questions\n• Market analysis\n• Risk assessment\n• Portfolio guidance\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Generate bot response based on user input
  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Greetings
    if (message.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm here to help you with your investment questions. What would you like to know?";
    }

    // Investment strategies
    if (message.match(/\b(strategy|strategies|how to invest|investment strategy)\b/)) {
      return "Great question! Here are some common investment strategies:\n\n1. **Diversification**: Spread investments across different assets, sectors, and regions\n2. **Dollar-Cost Averaging**: Invest a fixed amount regularly regardless of market conditions\n3. **Long-Term Investing**: Hold investments for 5+ years to ride out market volatility\n4. **Index Fund Investing**: Low-cost way to match market performance\n5. **Options Strategies**: Covered calls, cash-secured puts for income generation\n\nWould you like more details on any specific strategy?";
    }

    // Options trading
    if (message.match(/\b(options|option|calls?|puts?|strike|premium|greeks?)\b/)) {
      return "Options trading can be powerful but complex. Here's a quick overview:\n\n• **Calls**: Right to buy at a strike price\n• **Puts**: Right to sell at a strike price\n• **Covered Calls**: Generate income from stocks you own\n• **Cash-Secured Puts**: Collect premium while waiting to buy at discount\n\nCheck out our Options Calculator on the main page and visit the Strategies and Tutorials sections for detailed guides. What specific aspect of options interests you?";
    }

    // Risk assessment
    if (message.match(/\b(risk|risky|safe|conservative|aggressive|volatility)\b/)) {
      return "Risk management is crucial! Here's how to think about it:\n\n**Risk Levels:**\n• **Low**: ETFs, index funds, blue-chip stocks\n• **Medium**: Individual stocks, sector ETFs\n• **High**: Options, individual stocks, crypto\n\n**Tips:**\n• Never invest more than you can afford to lose\n• Diversify across asset classes\n• Match risk to your time horizon and goals\n• Use stop-loss orders for protection\n\nWhat's your risk tolerance? I can help tailor recommendations.";
    }

    // Market analysis
    if (message.match(/\b(market|nasdaq|s&p|sp500|dow|trend|analysis|forecast)\b/)) {
      return "Market analysis is key to informed investing:\n\n**Current Market Overview:**\n• Check the Market Summary section on the homepage for real-time data\n• NASDAQ, NYSE, and S&P 500 metrics are updated regularly\n• Review historical charts for individual investments\n• Consider both technical and fundamental analysis\n\n**Remember:** Past performance doesn't guarantee future results. Focus on long-term trends rather than short-term volatility.\n\nWould you like help analyzing a specific investment?";
    }

    // Portfolio questions
    if (message.match(/\b(portfolio|diversify|allocation|balance|holdings)\b/)) {
      return "Building a balanced portfolio is essential:\n\n**Diversification Guidelines:**\n• Stocks: 60-80% (depending on age/risk tolerance)\n• Bonds: 20-40%\n• International: 20-30% of stock allocation\n• Cash/Emergency fund: 3-6 months expenses\n\n**Tips:**\n• Rebalance quarterly or annually\n• Use dollar-cost averaging\n• Consider tax implications\n• Review and adjust as goals change\n\nUse the Comparison Tool on the site to analyze multiple investments side-by-side!";
    }

    // ETFs and index funds
    if (message.match(/\b(etf|index fund|passive|active|expense ratio|diversified)\b/)) {
      return "ETFs and Index Funds are excellent for most investors:\n\n**Benefits:**\n• Low expense ratios\n• Instant diversification\n• Liquidity (trade like stocks)\n• Tax efficiency\n\n**Popular Options:**\n• S&P 500 Index Funds (VOO, SPY)\n• Total Stock Market (VTI)\n• Sector-specific ETFs\n• International ETFs\n\nBrowse our investment recommendations to see curated options with detailed metrics. What type of ETF interests you?";
    }

    // Help requests
    if (message.match(/\b(help|what can you do|capabilities|features)\b/)) {
      return "I can help you with:\n\n📊 **Investment Research**\n• Strategy recommendations\n• Risk assessment\n• Portfolio guidance\n\n📈 **Options Trading**\n• Strategy explanations\n• Greeks and calculations\n• Risk/reward analysis\n\n📚 **Learning Resources**\n• Tutorial recommendations\n• Concept explanations\n• Market education\n\n💡 **Site Navigation**\n• Finding specific features\n• Using tools (Calculator, Comparison Tool)\n• Understanding metrics\n\nFeel free to ask me anything about investing!";
    }

    // Calculator mentions
    if (message.match(/\b(calculator|calculate|greeks|profit|loss|p\/l)\b/)) {
      return "Great! We have an Options Calculator on the main page. It can help you:\n\n• Calculate Option Greeks (Delta, Gamma, Theta, Vega, Rho)\n• Determine profit/loss scenarios\n• Find breakeven points\n• Analyze different strike prices\n\nClick on 'Options Calculator' in the Learning Resources section or scroll to the Tools section on the homepage. You can also type 'how to use the calculator' for more guidance!";
    }

    // Comparison tool
    if (message.match(/\b(compare|comparison|side by side|which is better)\b/)) {
      return "Use our Comparison Tool to analyze investments:\n\n1. Browse investment cards on the main page\n2. Click 'Compare' on any investment\n3. Add up to 4 investments to compare\n4. Review side-by-side metrics:\n   • YTD Returns\n   • Dividend Yields\n   • Risk Levels\n   • Recommendation Scores\n\nThis helps you make informed decisions by seeing all options together. Try it out!";
    }

    // Default responses for investment-related queries
    if (message.match(/\b(invest|buy|sell|trade|stock|share|fund)\b/)) {
      return "I'd be happy to help with investment decisions! Here are some key considerations:\n\n**Before Investing:**\n• Define your goals (retirement, growth, income)\n• Assess your time horizon\n• Determine risk tolerance\n• Research thoroughly\n\n**Resources on Rise:**\n• Browse investment recommendations\n• Use filters to find specific criteria\n• Check historical performance\n• Review institutional holdings\n• Analyze options strategies\n\nWould you like help with a specific investment or strategy?";
    }

    // General knowledge questions
    if (message.match(/\b(what is|explain|tell me about|define)\b/)) {
      return "I'd be happy to explain! However, I can provide more accurate and detailed information if you're more specific. For example:\n\n• 'What is a covered call?'\n• 'Explain options Greeks'\n• 'Tell me about index funds'\n• 'Define dollar-cost averaging'\n\nOr visit our Strategies and Tutorials sections for comprehensive guides. What would you like to learn about?";
    }

    // Thank you responses
    if (message.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
      return "You're welcome! I'm here to help anytime. Feel free to ask more questions about investments, strategies, or using the Rise platform. Happy investing! 🚀";
    }

    // Default fallback
    const defaultResponses = [
      "That's an interesting question! While I'm learning about investment topics, I'd recommend checking out our Strategies and Tutorials sections for detailed information. Could you rephrase your question or ask about something specific?",
      "I understand you're asking about that topic. For comprehensive guidance, please explore our site's resources:\n\n• **Strategies Page**: Detailed strategy explanations\n• **Tutorials**: Video learning resources\n• **Investment Cards**: Research specific investments\n• **Comparison Tool**: Compare multiple options\n\nWhat specific investment topic can I help with?",
      "I'm designed to help with investment and trading questions. Could you ask about:\n\n• Investment strategies\n• Options trading\n• Risk management\n• Portfolio building\n• Site features and tools\n\nOr try rephrasing your question with more context?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What investment strategy should I use?",
    "How do covered calls work?",
    "What's my risk tolerance?",
    "Explain options Greeks",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-md h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px] bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 p-4 rounded-t-2xl border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-yellow-50">Rise Assistant</h3>
                <p className="text-xs text-gray-400">Investment Advisor Bot</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700/50 transition-colors text-gray-400 hover:text-yellow-50"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-slate-700/50 text-gray-100 border border-slate-600/50'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700/50 rounded-2xl p-3 border border-slate-600/50">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Questions (show when only welcome message exists) */}
            {messages.length === 1 && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="w-full text-left px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-gray-300 border border-slate-600/30 hover:border-slate-600/50 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about investments, strategies, options..."
                className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-yellow-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Rise AI • Investment guidance
            </p>
          </div>
        </div>
      )}
    </>
  );
}
