import React, { useState, useEffect } from "react";

const features = [
  {
    icon: "🔒",
    title: "Secure Authentication",
    desc: "Protect your DNS & email with robust login and JWT security.",
    background: "/assets/bg.jpg"
  },
  {
    icon: "📧",
    title: "Email Analysis",
    desc: "Analyze SPF, DKIM, DMARC records for best practices.",
    background: "/assets/bg.jpg"
  },
  {
    icon: "🌐",
    title: "Domain Management",
    desc: "Easily add, validate, and monitor your domains.",
    background: "/assets/bg.jpg"
  },
  {
    icon: "⚡",
    title: "Fast & Reliable",
    desc: "Built for speed with modern tech and cloud hosting.",
    background: "/assets/bg.jpg"
  },
];

interface AuthInfoPanelProps {
  onClose?: () => void;
}

const AuthInfoPanel: React.FC<AuthInfoPanelProps> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const feature = features[current];

  const prev = () => setCurrent((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === features.length - 1 ? 0 : prev + 1));

  // Auto-slide every 3000ms
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className="h-full w-full bg-black backdrop-blur-md flex flex-col items-center justify-center shadow-2xl p-10 relative overflow-hidden"
      aria-label="Info panel"
      style={{
        backgroundImage: `url(${feature.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
    
      
    
      {/* Feature slider */}
      <div className="flex flex-col items-center text-center flex-1 justify-center relative z-10">
        {/* App Title - Static header */}
        <div className="text-center relative z-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-8">
            DNS/Email Security Tool
          </h1>
        </div>
        <span className="text-4xl mb-4 select-none drop-shadow-lg">{feature.icon}</span>
        <div className="text-xl font-bold text-white mb-2 drop-shadow-lg">{feature.title}</div>
        <div className="text-white text-base mb-4 max-w-xs drop-shadow-lg leading-relaxed">{feature.desc}</div>
      </div>
      
      {/* Slider controls */}
      <div className="flex items-center justify-center gap-4 mt-4 relative z-10">
        <button
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition"
          aria-label="Previous feature"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex gap-2">
          {features.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-white/40"} inline-block`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition"
          aria-label="Next feature"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      
      {/* Close button for mobile, if needed */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors md:hidden"
          aria-label="Close panel"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </aside>
  );
};

export default AuthInfoPanel; 