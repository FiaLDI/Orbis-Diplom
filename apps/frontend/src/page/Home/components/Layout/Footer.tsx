import React from "react";
import { NavBar } from "../Shared/NavBar";
import { Send, Youtube } from "lucide-react";

export const Footer = () => {
    return (
        <>
            <footer className="text-white py-10 px-5 bg-gradient-to-t from-[#0046d25e] to-[#04122f7c]">
                <div className="h-fit w-full flex flex-col gap-3 lg:max-w-7xl mx-auto lg:flex-row lg:justify-between ">
                    <div className="flex gap-5">
                        <div className="">
                            <img src="/img/icon.png" alt="" />
                        </div>
                        <div className="">
                            <h2 className="font-[sarpanch] text-3xl ">ORBIS</h2>
                            <p className="text-lg">
                                Неважно где ты, важно с нами. <br />
                                Мы здесь, чтобы стать ближе.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5 flex-col lg:flex-row lg:gap-10">
                        <div className="flex gap-5">
                            <div className="w-full">
                                <h2 className="text-2xl lg:text-lg">
                                    Навигация
                                </h2>
                                <NavBar
                                    styleContainer="flex bg-transparent flex-row w-full gap-5  lg:flex-col lg:text-lg lg:gap-0"
                                    styleList="cursor-pointer select-none !p-1 text-lg"
                                />
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-full">
                                <h2 className="text-2xl lg:text-lg">
                                    Социальные сети
                                </h2>
                                <div className="text-3xl lg:text-lg">
                                    <div className="flex gap-3">
                                        <Youtube className="w-6 h-6" />
                                        <div className="">OrbisYT</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Send className="w-6 h-6" />
                                        <div className="">OrbisTG</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-full">
                                <h2 className="text-2xl lg:text-lg">
                                    Связь с нами
                                </h2>
                                <div className="text-2xl lg:text-lg">
                                    <div className="">orbis.help@orbis.ru</div>
                                    <div className="">orbis.help2@orbis.ru</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
