"use client";
import styles from "@/app/styles/tablet.module.scss";
import React, { useMemo, useState } from "react";

import { LegionsList, PlanetsList } from "./itemsColumn";
import TabletControls from "./tabletControls";
import { useAppSelector } from "@/hooks/useStore";
import { IPlanet } from "@/app/types/planet";
import { ILegion } from "@/app/types/legion";

export enum TabType {
    planets = "planets",
    legions = "legions",
}

export default function DatabaseTablet() {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.planets);

    const { hasSearchQuery, searchResults } = useAppSelector(
        (state) => state.search
    );
    const { planets } = useAppSelector((state) => state.reducerPlanets);
    const { legions } = useAppSelector((state) => state.reducerLegions);

    const found = useMemo(
        () => ({
            planets: searchResults
                .filter((result) => result.type === TabType.planets)
                .map((result) => result.data as IPlanet),
            legions: searchResults
                .filter((result) => result.type === TabType.legions)
                .map((result) => result.data as ILegion),
        }),
        [searchResults]
    );

    const shownPlanets = hasSearchQuery ? found.planets : planets;
    const shownLegions = hasSearchQuery ? found.legions : legions;

    return (
        <div className={styles.mainTablet}>
            <div className={styles.wrapper}>
                <TabletControls
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    countPlanets={shownPlanets?.length ?? 0}
                    countLegions={shownLegions?.length ?? 0}
                />
                <div className={styles.listWrapper}>
                    {activeTab == TabType.planets &&
                        (hasSearchQuery && found.planets.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>Планеты не найдены</p>
                            </div>
                        ) : (
                            <PlanetsList planets={shownPlanets} />
                        ))}
                    {activeTab == TabType.legions &&
                        (hasSearchQuery && found.legions.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>Легионы не найдены</p>
                            </div>
                        ) : (
                            <LegionsList legions={shownLegions} />
                        ))}
                </div>
            </div>
        </div>
    );
}
