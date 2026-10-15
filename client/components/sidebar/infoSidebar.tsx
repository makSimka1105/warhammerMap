import styles from "@/app/styles/infoSidebar.module.scss";
import React from "react";
import { useMap } from "@/app/context/mapContext";

import ScrollableBlockColumn from "./ScrollableBlockColumn";
import { UpperInfo } from "./upperInfo";
import { IPlanet } from "@/app/types/planet";
import { ILegion } from "@/app/types/legion";

const InfoSidebar: React.FC = () => {
    const { currentPlanet } = useMap();

    if (currentPlanet == null) {
        return <div id={styles.infoSidebar}></div>;
    }

    return (
        <div id={styles.infoSidebar}>
            <UpperInfo item={currentPlanet} />
            <ScrollableBlockColumn
                description={currentPlanet.description || null}
                events={(currentPlanet as IPlanet).events ?? null}
                planetslinks={(currentPlanet as ILegion).planets ?? null}
            />
        </div>
    );
};

export default InfoSidebar;
