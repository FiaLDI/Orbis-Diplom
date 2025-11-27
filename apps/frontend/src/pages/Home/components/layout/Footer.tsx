import React from "react";
import { Send, Youtube } from "lucide-react";
import { NavigationMenu } from "../menu/footer";

export const Footer = () => {
  return (
    <footer className="relative text-white py-14 px-6 overflow-hidden">

      {/* Фоновое свечение */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,80,255,0.12),_transparent_70%)] pointer-events-none" />

      {/* Тонкая неоновая линия сверху */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">

        {/* Логотип + описание */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

          {/* Логотип и текст */}
          <div className="flex gap-5 items-center">
            <img src="/img/icon.png" alt="" className="w-14 h-14 drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]" />

            <div className="flex flex-col">
              <h2 className="font-[sarpanch] text-4xl tracking-wide drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
                ORBIS
              </h2>
              <p className="text-lg opacity-80 leading-snug max-w-[260px]">
                Неважно где ты — важно с нами.  
                Мы здесь, чтобы быть ближе.
              </p>
            </div>
          </div>

          {/* Навигационные блоки */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">

            {/* Навигация */}
            <div>
              <h3 className="text-xl mb-3 text-cyan-300 font-semibold drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                Навигация
              </h3>
              <div className="opacity-90">
                <NavigationMenu />
              </div>
            </div>

            {/* Социальные сети */}
            <div>
              <h3 className="text-xl mb-3 text-cyan-300 font-semibold drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                Социальные сети
              </h3>

              <div className="flex flex-col gap-3 text-lg">
                <a className="flex gap-3 items-center group cursor-pointer">
                  <Youtube className="w-6 h-6 text-white group-hover:text-cyan-300 transition-all" />
                  <span className="group-hover:text-cyan-300 transition-all">OrbisYT</span>
                </a>

                <a className="flex gap-3 items-center group cursor-pointer">
                  <Send className="w-6 h-6 text-white group-hover:text-cyan-300 transition-all" />
                  <span className="group-hover:text-cyan-300 transition-all">OrbisTG</span>
                </a>
              </div>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-xl mb-3 text-cyan-300 font-semibold drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                Связь с нами
              </h3>

              <div className="flex flex-col gap-1 text-lg opacity-90">
                <span className="hover:text-cyan-300 transition-all cursor-pointer">
                  orbis.help@orbis.ru
                </span>
                <span className="hover:text-cyan-300 transition-all cursor-pointer">
                  orbis.help2@orbis.ru
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя линия */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

        {/* Копирайт */}
        <p className="text-center text-sm opacity-60">
          © {new Date().getFullYear()} Orbis. Все права защищены.
        </p>

      </div>
    </footer>
  );
};
