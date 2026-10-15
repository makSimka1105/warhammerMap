"use client";
import React, { useState, useCallback, Dispatch, SetStateAction } from "react";
import styles from "@/app/styles/burgerMenu.module.scss";
import { useRouter } from "next/navigation";
import { useMap } from "@/app/context/mapContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export enum BlockChoice {
  map = 'map',
  dashboard = 'dashboard',
}

interface BurgerMenuProps {
    setCurrentBlock: Dispatch<SetStateAction<BlockChoice>>;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ setCurrentBlock }) => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const { isVisible, setIsVisible } = useMap();

    const handleRouter = useCallback(
        (path: string) => router.push(path),
        [router]
    );

    const toggleMenu = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    const handleBorderToggle = useCallback(() => {
        setIsVisible(!isVisible);
    }, [isVisible, setIsVisible]);

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
            action: () => setCurrentBlock(BlockChoice.map),
        },
        {
            id: "search",
            label: "Open search",
            action: () => setCurrentBlock(BlockChoice.dashboard),
        },
        {
            id: "border",
            label: "Toggle border visibility",
            action: handleBorderToggle,
        },
        {
            id: "admin",
            label: "Navigate to login",
            action: () => handleRouter("/login"),
        },
    ];
    const menuRef = useOutsideClick(() => setIsActive(false));

    return (
        <div className={styles.menuContainer} ref={menuRef as React.RefObject<HTMLDivElement>}>
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

export default BurgerMenu;
