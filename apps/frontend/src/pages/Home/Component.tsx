import React from "react";
import { HeroSection } from "./sections/Hero";
import { Edge } from "./sections/Edge";
import { ShowCase } from "./sections/Showcase";
import { Slider } from "./sections/Slider";
import { Start } from "./sections/Start";
import { SupportForm } from "./sections/Support/SupportForm";

export const Component = () => {
  return (
    <>
      <HeroSection />
      <Edge />
      <ShowCase />
      <Slider />
      <Start />
      <SupportForm />
    </>
  );
};
