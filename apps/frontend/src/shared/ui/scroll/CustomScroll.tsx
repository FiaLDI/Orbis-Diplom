import React, { useEffect, useRef, useState } from "react";

const CustomScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const header = document.querySelector("header");

        const handleScroll = () => {
            if (header) {
                if (window.scrollY === 0) {
                    if (scrollTimeout.current) {
                        clearTimeout(scrollTimeout.current);
                        scrollTimeout.current = null;
                    }
                    header.classList.remove("scrolled");
                }

                header.classList.add("scrolled");

                if (scrollTimeout.current) {
                    clearTimeout(scrollTimeout.current);
                }

                scrollTimeout.current = setTimeout(() => {
                    if (!isScrolling) {
                        header.classList.remove("scrolled");
                    }
                }, 1000);
            }
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();

            if (isScrolling) return;
            setIsScrolling(true);

            const delta = event.deltaY;
            const currentScroll = window.scrollY;
            const viewportHeight = window.innerHeight;

            let targetScroll;

            if (delta > 0) {
                targetScroll = currentScroll + viewportHeight;
            } else {
                targetScroll = currentScroll - viewportHeight;
            }

            targetScroll = Math.max(
                0,
                Math.min(targetScroll, document.body.scrollHeight - viewportHeight)
            );

            window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });

            setTimeout(() => {
                setIsScrolling(false);
            }, 500);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const viewportHeight = window.innerHeight;
            const currentScroll = window.scrollY;
            let targetScroll;

            switch (event.key) {
                case "ArrowDown":
                case "PageDown":
                case " ":
                    targetScroll = currentScroll + viewportHeight;
                    break;
                case "ArrowUp":
                case "PageUp":
                    targetScroll = currentScroll - viewportHeight;
                    break;
                default:
                    return;
            }

            targetScroll = Math.max(
                0,
                Math.min(targetScroll, document.body.scrollHeight - viewportHeight)
            );

            window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isScrolling]);

    return <div>{children}</div>;
};

export default CustomScroll;
