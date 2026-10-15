import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Dispatch, SetStateAction } from "react";
import { TabType } from "../search/databaseTablet";
import styles from "@/app/styles/tablet.module.scss";
import { SearchLine } from "./searchLine";
import { authClient } from "@/lib/auth-client";
import { DrawerWithTabsAndForm } from "../admin/createObject";
import { Logout } from "../auth/logout";

type TabletControlsProps = {
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
}: TabletControlsProps) {
  const { data: session } = authClient.useSession();
  const admin = useIsAdmin();

  return (
    <div className={styles.tabletControls}>
      <SearchLine
        placeholder="Поиск..."
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        countPlanets={countPlanets}
        countLegions={countLegions}
      />
      {admin && <div className="right-0 z-10">
        <DrawerWithTabsAndForm />
      </div>}
      {session && <div className="right-0 z-10">
        <Logout />
      </div>}
    </div>
  );
}
