import React from "react";
import { SectionLayout } from "../../components/Layout/SectionLayout";
import { TitleSection } from "../../components/UI/TitleSection";

export const Slider = () => {
    return (
        <div className="bg-[rgba(27,30,75,0.3)] flex justify-center">
            <div className="w-[720px]">
                <SectionLayout>
                    <TitleSection >
                        Пусть друзья выбирают себе ники — у тебя всё равно своё имя для каждого.
                    </TitleSection>
                </SectionLayout>
            </div>
        </div>
    );
};
