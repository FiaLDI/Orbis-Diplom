import { Circle, Minus } from "lucide-react";
import React from "react";
import { ButtonHome } from "../../components/ButtonHome";
import { SectionLayout } from "../../components/Layout/SectionLayout";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
    const navigator = useNavigate();

    return (
        <div className="text-white py-50 text-center lg:py-10 overflow-hidden">
            <SectionLayout classListContainer="flex flex-col gap-5 lg:max-w-7xl lg:gap-2 lg:items-center">
                <h1 className="text-7xl shadow text-shadow text-shadow-white lg:text-5xl">
                    Всегда будь на связи
                </h1>
                <p className="text-3xl my-10 lg:text-3xl max-w-[600px]">
                    Общайтесь, сотрудничайте и создавайте проекты вместе <br />
                        Даже на расстоянии планет, <br />
                        ORBIS держит вашу команду на связи.
                </p>
                <div className="flex items-center justify-center my-20 lg:my-5">
                    {window.innerWidth < 1199 ? (
                        <>
                            <Circle className="w-40 h-40" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-20 h-20" strokeWidth={1.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-40 h-40" strokeWidth={0.5} />
                        </>
                    ) : (
                        <>
                            <Circle className="w-30 h-30" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-10 h-10" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-15 h-15" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-20 h-20" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-25 h-25" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-20 h-20" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-15 h-15" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-10 h-10" strokeWidth={0.5} />
                            <Minus className="m-4" />
                            <Minus className="m-4" />
                            <Circle className="w-30 h-30" strokeWidth={0.5} />
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-10 w-full justify-center items-center lg:flex-row ">
                    <ButtonHome buttonclass="lg:!py-2 lg:text-2xl lg:w-1/3" handler={()=>navigator("/login")}>
                        Загрузить
                    </ButtonHome>
                    <ButtonHome buttonclass="lg:!py-2 lg:text-2xl lg:w-1/3" handler={()=>navigator("/login")}>
                        Открыть в браузере
                    </ButtonHome>
                </div>
            </SectionLayout>
        </div>
    );
};
