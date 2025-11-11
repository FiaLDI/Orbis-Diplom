import { motion } from "framer-motion";
import React from "react";

export const ProgressBar: React.FC<{progress: number}> = ({ progress }) => (
  <motion.div
    className="absolute bottom-0 left-0 h-[3px] bg-white/70"
    animate={{ width: `${progress}%` }}
  />
);
