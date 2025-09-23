import styles from "@/app/styles/tablet.module.scss";
import { useState } from "react";
import { ILegion } from "@/app/types/legion";
import { useMap } from "@/app/context/mapContext";

export const LegionBar = (legion: ILegion) => {
    const {setCurrentPlanet}=useMap()
    const [data, setData] = useState<ILegion>(legion);
    const handleLegionSelecting = (legion:ILegion)=>{
        setCurrentPlanet(legion)


    }

    return (
        <div key={legion._id} className={styles.planetBar} onClick={()=>handleLegionSelecting(legion)}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.id}> {data._id}</div>
        </div>
    );
};
