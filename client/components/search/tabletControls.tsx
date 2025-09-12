import { Dispatch, SetStateAction } from "react";
import { TabType } from "../search/databaseTablet";
import { Button } from "../ui/button";
import styles from "@/app/styles/tablet.module.scss";
import { SearchLine } from "./searchLine";
type AdminControlsProps = {
    activeTab: TabType;
    setActiveTab: Dispatch<SetStateAction<TabType>>;

    countPlanets: number;
    countLegions: number;
};

export default function TabletControls({
    activeTab,
    setActiveTab,
    countPlanets,
    countLegions,
}: AdminControlsProps) {

    return (
        <div className={styles.tabletControls}>
            <div className={styles.buffer}></div>

            <SearchLine placeholder="Поиск..." className="mb-3" />
            <div>
                <a
                    className={styles.tabButton}
                    onClick={() => setActiveTab(TabType.planets)}
                >
                    п({countPlanets})
                </a>
                <a
                    className={styles.tabButton}
                    onClick={() => setActiveTab(TabType.legions)}
                >
                    л({countLegions})
                </a>
            </div>
        </div>
    );
}
