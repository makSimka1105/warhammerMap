"use client";
import { Dispatch } from "react";
import React, { SetStateAction } from "react";
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
    countPlanets = 0,
    countLegions = 0,
    activeTab,
}: TabSwitcherProps) {
    const handleTabClick = (tab: TabType) => {
        setActiveTab?.(tab);
    };

    return (
        <div className={styles.tabSwitcher}>
            <div
                className={`${styles.tabButton} ${
                    activeTab === TabType.planets ? styles.active : ""
                }`}
                onClick={() => handleTabClick(TabType.planets)}
                // type="button"
            >
                п({countPlanets})
            </div>
            <div
                className={`${styles.tabButton} ${
                    activeTab === TabType.legions ? styles.active : ""
                }`}
                onClick={() => handleTabClick(TabType.legions)}
                // type="button"
            >
                л({countLegions})
            </div>
        </div>
    );
}
