import React, { useState, useEffect } from 'react';

const TalkingTom = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const floatingItems = [
    { icon: '🏃‍♂', label: 'Sprint Planner' },
    { icon: '📋', label: 'Kanban Board' },
    { icon: '🗣', label: 'Daily Standup' },
    { icon: '⚡', label: 'API Integration' },
    { icon: '📊', label: 'Progress Tracking' },
    { icon: '👥', label: 'Team Management' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
      createConfetti();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const createConfetti = () => {
    const colors = ['#4299e1', '#9f7aea', '#48bb78', '#ed8936', '#f56565', '#38b2ac'];
    const newConfetti = [];

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        delay: Math.random() * 2000,
        duration: 3 + Math.random() * 5,
        sideMovement: (Math.random() - 0.5) * 200
      });
    }

    setConfetti(newConfetti);
  };

  // Confetti piece component
  const ConfettiPiece = ({ piece }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);

        const removeTimer = setTimeout(() => {
          setConfetti(prev => prev.filter(c => c.id !== piece.id));
        }, piece.duration * 1000);

        return () => clearTimeout(removeTimer);
      }, piece.delay);

      return () => clearTimeout(timer);
    }, [piece]);

    return (
      <div
        className={`absolute w-2.5 h-2.5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${piece.left}vw`,          // <-- wrapped in quotes and template literal correctly
          top: '-10px',
          backgroundColor: piece.color,
          borderRadius: piece.borderRadius,
          animation: isVisible ? `confettiFall ${piece.duration}s cubic-bezier(0.1, 0.8, 0.9, 1) forwards` : 'none',
          '--side-movement': `${piece.sideMovement}px`
        }}
      />
    );
  };

  // Floating item component
  const FloatingItem = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const styleObj = {
      animation: 'floatAround 15s linear infinite',
      animationDelay: `${index * -3}s`,
      animationDuration: `${12 + index * 2}s`,
      transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
      transitionDelay: isAnimated ? `${index * 200}ms` : '0ms',
      position: 'absolute',
      width: '5rem', // equivalent to w-20
      height: '5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // bg-white/90
      borderRadius: '1rem', // rounded-2xl
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', // shadow-lg
      backdropFilter: 'blur(10px)', // backdrop-blur-sm
      border: '2px solid rgba(66, 153, 225, 0.3)', // border-blue-300/30
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isAnimated ? 0.9 : 0,
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined,
    };

    // Positions for each floating item
    switch (index) {
      case 0:
        styleObj.top = '10%';
        styleObj.left = '15%';
        break;
      case 1:
        styleObj.top = '20%';
        styleObj.right = '20%';
        break;
      case 2:
        styleObj.bottom = '30%';
        styleObj.left = '10%';
        break;
      case 3:
        styleObj.bottom = '15%';
        styleObj.right = '15%';
        break;
      case 4:
        styleObj.top = '50%';
        styleObj.left = '5%';
        break;
      case 5:
        styleObj.top = '40%';
        styleObj.right = '5%';
        break;
      default:
        break;
    }

    return (
      <div
        style={styleObj}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '1rem',
            opacity: 0.7,
            animation: 'pulse 2s ease-in-out infinite',
            background: 'linear-gradient(45deg, #4299e1, #9f7aea, #48bb78, #ed8936)',
            margin: '-2px',
            zIndex: -1
          }}
        />
        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{item.icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#2d3748', textAlign: 'center' }}>{item.label}</div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* Confetti */}
      {confetti.map(piece => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}

      {/* Floating Items */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {floatingItems.map((item, index) => (
          <FloatingItem key={index} item={item} index={index} />
        ))}
      </div>

      {/* Welcome Container */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 10,
          transition: 'all 1s ease-out',
          opacity: isAnimated ? 1 : 0,
          transform: isAnimated ? 'none' : 'translateY(-100vh)',
          animation: isAnimated ? 'bounce 1.5s infinite alternate' : 'none'
        }}
      >
        <img
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c9c27ab5-04d2-475c-9fe3-5ea7f85a3712.png"
          alt="A cheerful 3D rendered character representing a Scrum tool"
          style={{
            width: '300px',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            marginBottom: '2rem',
            border: '5px solid white',
            transition: 'transform 0.5s',
            transform: isAnimated ? 'scale(1)' : 'scale(0.75)'
          }}
        />

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem',
            textShadow: isAnimated
              ? '0 0 10px rgba(66, 153, 225, 0.6)'
              : '3px 3px 6px rgba(0, 0, 0, 0.15)',
            animation: isAnimated ? 'textGlow 2s infinite alternate' : 'none',
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? 'none' : 'translateX(-6rem) scale(0.9)',
            transition: 'all 0.8s'
          }}
        >
          Welcome to Our Scrum Management Tool!
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: '#718096',
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? 'none' : 'translateX(-6rem) scale(0.9)',
            transition: 'all 0.8s 0.2s'
          }}
        >
          Optimize your sprint planning and enhance team collaboration.
        </p>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        @keyframes textGlow {
          0% { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15); }
          100% { text-shadow: 0 0 10px rgba(66, 153, 225, 0.6); }
        }

        @keyframes floatAround {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
          50% { transform: translateY(10px) translateX(-15px) rotate(180deg); }
          75% { transform: translateY(25px) translateX(25px) rotate(270deg); }
          100% { transform: translateY(0) translateX(0) rotate(360deg); }
        }

        @keyframes confettiFall {
          0% {
            top: -10px;
            opacity: 0;
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            top: 50vh;
            opacity: 1;
            transform: translateX(calc(var(--side-movement) / 2)) rotate(180deg);
          }
          100% {
            top: 100vh;
            opacity: 0;
            transform: translateX(var(--side-movement)) rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes bounce {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};

export default TalkingTom;
