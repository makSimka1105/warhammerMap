import styles from "@/app/styles/infoSidebar.module.scss";
import React, { useEffect, useState } from "react";
import { useMap } from "@/app/context/mapContext";

import ScrollableBlockColumn from "./ScrollableBlockColumn.tsx";
import { UpperInfo } from "./upperInfo";
import { IPlanet } from "@/app/types/Planet.js";
import { ILegion } from "@/app/types/legion.js";

interface InfoSidebarProps {
    children?: React.ReactNode;
}

const InfoSidebar: React.FC<InfoSidebarProps> = () => {
    const { currentPlanet } = useMap();
    // const [planetsForList, setPlanetsForList] = useState([""])

    if (currentPlanet==null) {
        return <div id={styles.infoSidebar}></div>;
    }
    if((currentPlanet as ILegion).planets!=undefined){
           return (
        <div id={styles.infoSidebar}>
            { }
            <UpperInfo item={currentPlanet} />
            <ScrollableBlockColumn
                description={
                    (currentPlanet as any).description
                        ? (currentPlanet as any).description
                        : null
                }
                events={
                    (currentPlanet as any).events
                        ? (currentPlanet as any).events
                        : null
                }

                planetslinks={(currentPlanet as ILegion).planets || null}
            />
        </div>
    );
    }
    

    return (
        <div id={styles.infoSidebar}>
            { }
            <UpperInfo item={currentPlanet} />
            <ScrollableBlockColumn
                description={
                    (currentPlanet as any).description
                        ? (currentPlanet as any).description
                        : null
                }
                events={
                    (currentPlanet as any).events
                        ? (currentPlanet as any).events
                        : null
                }

                planetslinks={(currentPlanet as ILegion).planets || null}
            />
        </div>
    );
};

export default InfoSidebar;
