import React from "react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { useNavigate } from "react-router-dom";
import { ButtonHome } from "../../components/button/home";

export const HeroSection = () => {
  const navigator = useNavigate();

  const SignalDeco = () => (
  <div className="h-32 w-full flex justify-center items-center relative">
    <svg
      viewBox="0 0 1600 200"
      className="w-full max-w-[1400px] h-full opacity-90"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Градиенты */}
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(90,140,255,0.15)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(90,140,255,0.15)" />
        </linearGradient>

        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,255,255,0.15)" />
          <stop offset="50%" stopColor="rgba(0,255,255,1)" />
          <stop offset="100%" stopColor="rgba(0,255,255,0.15)" />
        </linearGradient>

        <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,120,255,0.15)" />
          <stop offset="50%" stopColor="rgba(255,120,255,1)" />
          <stop offset="100%" stopColor="rgba(255,120,255,0.15)" />
        </linearGradient>

        {/* Glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Маска для бегущей волны */}
        <clipPath id="waveMask">
          <rect x="0" y="0" width="1600" height="200" />
        </clipPath>
      </defs>

      {/* --- Линия №1 (неподвижная база) --- */}
      <path
        d="M0 100 C300 20 600 180 900 70 S1600 130 1600 130"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      />

      {/* --- Бегущая волна №1 --- */}
      <g clipPath="url(#waveMask)">
        <path
          d="M0 100 C300 20 600 180 900 70 S1600 130 1600 130"
          stroke="url(#waveGradient1)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        >
          <animate
            attributeName="transform"
            type="translate"
            from="-1600 0"
            to="1600 0"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* --- Линия №2 --- */}
      <path
        d="M0 130 C280 160 700 40 1050 110 S1600 80 1600 80"
        stroke="rgba(0,255,255,0.15)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      />

      {/* Бегущая волна №2 */}
      <g clipPath="url(#waveMask)">
        <path
          d="M0 130 C280 160 700 40 1050 110 S1600 80 1600 80"
          stroke="url(#waveGradient2)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        >
          <animate
            attributeName="transform"
            type="translate"
            from="-1600 0"
            to="1600 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* --- Линия №3 --- */}
      <path
        d="M0 155 C320 90 750 180 1120 100 S1600 150 1600 150"
        stroke="rgba(255,120,255,0.15)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      />

      {/* Бегущая волна №3 */}
      <g clipPath="url(#waveMask)">
        <path
          d="M0 155 C320 90 750 180 1120 100 S1600 150 1600 150"
          stroke="url(#waveGradient3)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        >
          <animate
            attributeName="transform"
            type="translate"
            from="-1600 0"
            to="1600 0"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  </div>
  );

  return (
    <div className="text-white py-40 text-center lg:py-20 overflow-hidden relative">
      {/* background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(60,80,255,0.15),transparent_70%)]"></div>

      <SectionLayout className="relative z-10 flex flex-col gap-5 justify-center">

        <h1 className="text-7xl lg:text-6xl font-semibold text-shadow-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
          Всегда будь на связи
        </h1>

        <div className="w-full flex justify-center">
          <p className="w-full text-2xl opacity-90 max-w-[650px] leading-snug">
            Общайтесь, создавайте и работайте вместе. Даже если вы разбросаны по
            планетам —
            <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
              {" "}
              Orbis держит вас на связи.
            </span>
          </p>
        </div>

        <div className="h-28 flex justify-center relative">
          <SignalDeco />
        </div>

        <div className="flex flex-col gap-8 w-full justify-center items-center lg:flex-row">
          <ButtonHome
            buttonclass="lg:!py-3 lg:text-xl lg:w-1/3"
            handler={() => navigator("/login")}
          >
            Загрузить
          </ButtonHome>

          <ButtonHome
            buttonclass="lg:!py-3 lg:text-xl lg:w-1/3"
            handler={() => navigator("/login")}
          >
            Открыть в браузере
          </ButtonHome>
        </div>
      </SectionLayout>
    </div>
  );
};
