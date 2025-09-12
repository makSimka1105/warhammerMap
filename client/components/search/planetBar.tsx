import { IPlanet } from "@/app/types/Planet";
import styles from '@/app/styles/tablet.module.scss'
import { useState } from "react";

export const PlanetBar = (
    planet: IPlanet,
   
) => {
        const [data, setData] = useState<IPlanet>(planet);

    return (
        <div key={planet._id} className={styles.planetBar}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.id}> {data._id}</div>
            <div className={styles.position}>
                расположение _ _ _ {data.ingamePosition}
            </div>
        </div>
    );
}