import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavigationMenu } from "../menu/navbar";

export const Header = () => {
  const navigator = useNavigate();
  const [burgerActive, setBurgerActive] = useState(false);

  const handleBurger = useCallback(() => {
    setBurgerActive((prev) => !prev);
  }, []);

  return (
    <header className="
      sticky top-0 z-50 
      backdrop-blur-xl
      bg-foreground/5
      border-b border-cyan-400/20
      text-white
    ">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center py-5 px-6 lg:max-w-7xl mx-auto"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => navigator("/")}
        >
          <img
            src="/img/ico.svg"
            alt="logo"
            className="w-12 h-12 drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]"
          />

          <div className="
            font-[sarpanch] text-4xl tracking-wider
            drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]
          ">
            ORBIS
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <NavigationMenu navigate={navigator} />
        </nav>

        {/* Sign In */}
        <button
          onClick={() => navigator("/login")}
          className="
            hidden lg:block
            font-[sarpanch] text-xl px-6 py-2 rounded-lg
            border border-cyan-300/40
            hover:border-cyan-300
            transition-all
            hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
          "
        >
          SIGN IN
        </button>

        {/* Burger */}
        <button onClick={handleBurger} className="lg:hidden">
          {burgerActive ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {burgerActive && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              lg:hidden w-full
              bg-[rgba(10,20,40,0.8)]
              backdrop-blur-md
              border-b border-cyan-400/20
              shadow-[0_0_20px_rgba(0,200,255,0.15)]
            "
          >
            <NavigationMenu navigate={navigator} mobile />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
