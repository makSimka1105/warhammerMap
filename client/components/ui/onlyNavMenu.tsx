
"use client";
import React, { useState, useCallback } from "react";
import styles from "@/app/styles/burgerMenu.module.scss";
import { useRouter } from "next/navigation";
import { useOutsideClick } from "@/hooks/useOutsideClick";


const OnlyNavMenu: React.FC = (
   
) => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
   

    const handleRouter = useCallback(
        (path: string) => {
            try {
                router.push(path);
            } catch (error) {
                console.error("Navigation error:", error);
                // Fallback: try to navigate using window.location if router fails
                try {
                    window.location.href = path;
                } catch (fallbackError) {
                    console.error(
                        "Fallback navigation also failed:",
                        fallbackError
                    );
                }
            }
        },
        [router]
    );

    const toggleMenu = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent, action: () => void) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                action();
            }
        },
        []
    );

    const menuItems = [
        {
            id: "home",
            label: "Navigate to home",
            path: "/",
            action: () => handleRouter("/"),
        },

        {
            id: "admin",
            label: "Navigate to admin dashboard",
            path: "/login",
            action: () => handleRouter("/login"),
        },
    ];
    const menuRef = useOutsideClick(() => setIsActive(false));

    return (
        <div
            className={styles.menuContainer}
            ref={menuRef as React.RefObject<HTMLDivElement>}
        >
            <button
                className={styles.menuButton}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={isActive}
                aria-controls="navigation-menu"
            ></button>
            <div className={styles.wrapper}>
                <div
                    id="navigation-menu"
                    className={`${styles.menuContent} ${isActive ? styles.menuContentActive : ""}`}
                    role="navigation"
                    aria-label="Main navigation"
                >
                    {menuItems.map((item) => (
                        <a
                            key={item.id}
                            id={item.id}
                            className={`${styles.menuLink} ${styles[`${item.id}Link` as keyof typeof styles]}`}
                            onClick={item.action}
                            onKeyDown={(e) => handleKeyDown(e, item.action)}
                            role="button"
                            tabIndex={0}
                            aria-label={item.label}
                        ></a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnlyNavMenu;
