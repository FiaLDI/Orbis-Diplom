import React from "react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { TitleSection } from "../../components/section/TitleSection";

export const ShowCase = () => {
  return (
    <div className="text-center relative py-20" id="more">
      {/* Фоновые лучи / свечение */}
      <div className="
        absolute inset-0 
        bg-[radial-gradient(circle_at_top,_rgba(0,140,255,0.15),_transparent_70%)]
        pointer-events-none
      "></div>

      <SectionLayout className="relative z-10 flex flex-col gap-14 items-center">

        {/* Заголовок */}
        <TitleSection className="drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]">
          ДРУЗЬЯ, ЧАТЫ,
          <br />
          ОБЩЕНИЕ — ВСЁ ЗДЕСЬ!
        </TitleSection>

        {/* Обёртка под картинку */}
        <div
          className="
            relative 
            w-full 
            max-w-5xl 
            mx-auto 
            rounded-3xl 
            overflow-hidden 
            shadow-[0_0_40px_rgba(0,200,255,0.25)]
            border border-cyan-300/20
            backdrop-blur-sm
          "
        >
          {/* Неоновая линия сверху */}
          <div className="
            absolute top-0 left-0 w-full h-[3px]
            bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent
          " />

          {/* Изображение с fade-in анимацией */}
          <img
            src="/img/preview.png"
            alt="Showcase"
            className="
              w-full
              object-cover 
              animate-[fadeIn_1.5s_ease-out]
            "
          />
        </div>
      </SectionLayout>
    </div>
  );
};
