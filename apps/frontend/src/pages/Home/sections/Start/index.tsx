import {
  Smartphone,
  Laptop,
  Globe,
  CheckCircle,
  Download,
} from "lucide-react";
import React from "react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { TitleSection } from "../../components/section/TitleSection";

export const Start = () => {
  return (
    <div id="start">
      <SectionLayout className="gap-5">
        <TitleSection>Начать общаться</TitleSection>

        {/*  TWO CARDS  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Desktop + Mobile */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-7 h-7 text-cyan-400" />
              <h3 className="text-2xl font-semibold">ПК и мобильный телефон</h3>
            </div>

            <ul className="flex flex-col gap-3 text-lg opacity-90">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Регистрация по ссылке
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Скачать приложение
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Установка и запуск
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Авторизация
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Ищи друзей
              </li>
            </ul>
          </div>

          {/* Website */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-7 h-7 text-fuchsia-300" />
              <h3 className="text-2xl font-semibold">Сайт</h3>
            </div>

            <ul className="flex flex-col gap-3 text-lg opacity-90">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-300" />
                Регистрация
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-300" />
                Авторизация
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-fuchsia-300" />
                Ищи друзей и чаты
              </li>
            </ul>
          </div>
        </div>

        {/* INSTALLATION */}
        <div className="flex flex-col justify-center items-center gap-8">
          <h3 className="text-3xl font-semibold">Установить</h3>

          <div className="flex gap-12">

            <button className="flex flex-col items-center gap-2 hover:opacity-80 transition">
              <Smartphone className="w-14 h-14 text-cyan-400" strokeWidth={1.25}/>
              <span className="text-xl font-medium">Android</span>
            </button>

            <button className="flex flex-col items-center gap-2 hover:opacity-80 transition">
              <Laptop className="w-14 h-14 text-fuchsia-300" strokeWidth={1.25} />
              <span className="text-xl font-medium">Windows</span>
            </button>

          </div>
        </div>

      </SectionLayout>
    </div>
  );
};
