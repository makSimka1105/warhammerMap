import styles from "@/app/styles/tablet.module.scss";
import { useState } from "react";
import { ILegion } from "@/app/types/legion";

export const LegionBar = (legion: ILegion) => {
    const [data, setData] = useState<ILegion>(legion);

    return (
        <div key={legion._id} className={styles.legionBar}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.id}> {data._id}</div>
        </div>
    );
};
