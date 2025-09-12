import React from "react";
import styles from "@/app/styles/RunningMarquee.module.scss";

interface RunningMarqueeProps {
    text: string;
}

const RunningMarquee: React.FC<RunningMarqueeProps> = ({ text }) => {
    return (
        <div className={styles.marquee}>
            <div className={styles.track}>
                <span className={styles.text}>{text}</span>
                <span className={styles.text}>{text}</span>
            </div>
        </div>
    );
};

export default RunningMarquee;
