import React from "react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { TitleSection } from "../../components/section/TitleSection";
import { ShieldCheck, FolderTree, Users, ClipboardCheck } from "lucide-react";

const items = [
  {
    icon: <ShieldCheck size={40} className="text-cyan-400" strokeWidth={1.25}/>,
    title: "Роли и доступ",
    text: "Создавайте роли и настраивайте уровни доступа для участников сервера.",
  },
  {
    icon: <FolderTree size={40} className="text-fuchsia-400" strokeWidth={1.25}/>,
    title: "Структура каналов",
    text: "Организуйте обсуждения по темам и проектам.",
  },
  {
    icon: <Users size={40} className="text-emerald-400" strokeWidth={1.25} />,
    title: "Управление участниками",
    text: "Добавляйте людей, назначайте обязанности и контролируйте активность.",
  },
  {
    icon: <ClipboardCheck size={40} className="text-yellow-400" strokeWidth={1.25} />,
    title: "Задачи и контроль",
    text: "Создавайте задачи и управляйте рабочими процессами.",
  },
];

export const Slider = () => {
  return (
    <div className="bg-[rgba(27,30,75,0.3)] flex justify-center py-5">
      <div className="w-[800px]">
        <SectionLayout>
          <TitleSection>Полный контроль над вашим пространством</TitleSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex gap-4"
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="opacity-70">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
};
