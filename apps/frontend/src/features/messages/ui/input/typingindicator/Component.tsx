import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ users }) => {
  if (!users.length) return null;

  const names =
    users.length === 1
      ? users[0]
      : users.length === 2
        ? `${users[0]} и ${users[1]}`
        : `${users.slice(0, 2).join(", ")} и ещё ${users.length - 2}`;

  return (
    <AnimatePresence>
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 text-gray-300 text-sm px-1 mt-1 select-none"
        >
          <span>
            {names} {users.length > 1 ? "печатают" : "печатает"}
          </span>
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
