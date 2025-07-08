import React from "react";

const NUM_PARTICLES = 18;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const FloatingParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => {
        const size = random(16, 48);
        const left = random(0, 100);
        const top = random(0, 100);
        const duration = random(8, 18);
        const delay = random(0, 8);
        const color = [
          'bg-blue-400/20',
          'bg-purple-400/20',
          'bg-cyan-400/20',
          'bg-pink-400/20',
          'bg-green-400/20',
        ][Math.floor(Math.random() * 5)];
        return (
          <div
            key={i}
            className={`absolute rounded-full blur-2xl ${color}`}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animation: `floatY ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0px) scale(1); opacity: 0.7; }
          100% { transform: translateY(-40px) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FloatingParticles;
