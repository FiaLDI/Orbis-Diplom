import React from "react";
import { MessageSquare, Bell, Globe } from "lucide-react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { TitleSection } from "../../components/section/TitleSection";

export const Edge = () => {
  return (
    <div className="bg-[rgba(27,30,75,0.3)] relative">
      <SectionLayout className="flex lg:flex-row gap-5 max-w-7xl">

        {/* Градиенты */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <TitleSection>Неважно где, важно с нами</TitleSection>

          <p className="text-xl opacity-80 mb-14">
            Чаты, уведомления и рабочие пространства — мгновенно, стабильно, в любом месте.
          </p>

          <div className="flex flex-col gap-6 max-w-3xl mx-auto mb-16">

            {/* Быстрые чаты */}
            <div className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <MessageSquare className="w-10 h-10 text-cyan-400 shrink-0" strokeWidth={1.25}/>
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-2">Быстрые чаты</h3>
                <p className="opacity-80 whitespace-nowrap">Сообщения доставляются мгновенно и без задержек.</p>
              </div>
            </div>

            {/* Уведомления */}
            <div className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <Bell className="w-10 h-10 text-fuchsia-400 shrink-0" strokeWidth={1.25} />
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-2">Мгновенные уведомления</h3>
                <p className="opacity-80 whitespace-nowrap">Всё важное приходит вовремя, без лишнего шума.</p>
              </div>
            </div>

            {/* Всегда на связи (одна карточка на 2 колонки) */}
            <div className="md:col-span-2 backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <Globe className="w-10 h-10 text-blue-400 shrink-0" strokeWidth={1.25}/>
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-2">Всегда на связи</h3>
                <p className="opacity-80">Работает на любом устройстве — в браузере или приложении.</p>
              </div>
            </div>

          </div>

          <button className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-full text-lg font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition">
            Попробовать Orbis
          </button>
        </div>

      </SectionLayout>
    </div>
  );
};
