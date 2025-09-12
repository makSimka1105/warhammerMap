import React from "react";
import styles from "@/app/styles/upperMenu.module.scss";
import RunningMarquee from "./RunningMarquee ";

const UpperMenu: React.FC = () => {
    return (
        <div id="upper-menu" className={styles.upperMenu}>
            <RunningMarquee
                text={
                    "Тронный мир и столица Империума Человечества, родная планета человеческой расы, а также место рождения самого Императора Человечества. Это самое священное и почитаемое место среди всех миллионов миров, составляющих межзвёздную державу человечества."
                }
            />
        </div>
    );
};

export default UpperMenu;
