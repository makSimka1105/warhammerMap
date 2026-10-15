"use client";
import React, { Dispatch, SetStateAction } from "react";
import { TabType } from "./databaseTablet";
import styles from "@/app/styles/searchLine.module.scss";

type TabSwitcherProps = {
    activeTab: TabType;
    setActiveTab: Dispatch<SetStateAction<TabType>>;
    countPlanets: number;
    countLegions: number;
};

export function TabSwitcher({
    setActiveTab,
    countPlanets,
    countLegions,
    activeTab,
}: TabSwitcherProps) {
    return (
        <div className={styles.tabSwitcher}>
            <button
                type="button"
                aria-label="Планеты"
                aria-pressed={activeTab === TabType.planets}
                className={`${styles.tabButton} ${
                    activeTab === TabType.planets ? styles.active : ""
                }`}
                onClick={() => setActiveTab(TabType.planets)}
            >
                ({countPlanets})
            </button>
            <button
                type="button"
                aria-label="Легионы"
                aria-pressed={activeTab === TabType.legions}
                className={`${styles.tabButton} ${
                    activeTab === TabType.legions ? styles.active : ""
                }`}
                onClick={() => setActiveTab(TabType.legions)}
            >
                ({countLegions})
            </button>
        </div>
    );
}
