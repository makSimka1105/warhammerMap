"use client";
import React, { useState, useCallback, Dispatch, SetStateAction } from "react";
import styles from "@/app/styles/burgerMenu.module.scss";
import { useRouter } from "next/navigation";
import { useMap } from "@/app/context/mapContext";
import { BlockChoise } from "@/app/page";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface BurgerMenuProps {
    currentBlock: BlockChoise;
    setCurrentBlock: Dispatch<SetStateAction<BlockChoise>>;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({currentBlock,setCurrentBlock}) => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const { isVisible, setIsVisible } = useMap();
    const handleSwitch=useCallback(
        (block:BlockChoise)=>{
            try {
                if(block==BlockChoise.map ){
                    setCurrentBlock(BlockChoise.map)
                }

                if(block==BlockChoise.dashboard ){

                    setCurrentBlock(BlockChoise.dashboard)
                }

                
            } catch (error) {
                console.log(error)
            }
        },[currentBlock,setCurrentBlock]
    )


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



    const handleBorderToggle = useCallback(() => {
        try {
            setIsVisible(!isVisible);
        } catch (error) {
            console.error("Error toggling border visibility:", error);
        }
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
            path: "/",
            action: () => handleSwitch(BlockChoise.map),
        },
        {
            id: "search",
            label: "Open search",
            path: "/search",
            action: () => handleSwitch(BlockChoise.dashboard),
        },
        {
            id: "border",
            label: "Toggle border visibility",
            action: handleBorderToggle,
        },
        {
            id: "admin",
            label: "Navigate to login ",
            path: "/login",
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
