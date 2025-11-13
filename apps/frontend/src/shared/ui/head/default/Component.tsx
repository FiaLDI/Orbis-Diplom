import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ title }) => {
  return <div className="text-5xl lg:text-base pl-5 p-2">{title}</div>;
};
