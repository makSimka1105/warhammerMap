import styles from "@/app/styles/infoSidebar.module.scss";
import React from "react";
import { useMap } from "@/app/context/mapContext";

import ScrollableBlockColumn from "./ScrollableBlockColumn.tsx";
import { UpperInfo } from "./upperInfo";
import { IPlanet } from "@/app/types/Planet.js";

interface InfoSidebarProps {
    children?: React.ReactNode;
}

const InfoSidebar: React.FC<InfoSidebarProps> = () => {
    const { currentPlanet } = useMap();

    if (!currentPlanet) {
        return <div id={styles.infoSidebar}></div>;
    }
    return (
        <div id={styles.infoSidebar}>
            {}
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

                planetslinks={currentPlanet.planets||null}
            />
        </div>
    );
};

export default InfoSidebar;
