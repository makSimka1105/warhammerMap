import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TabType } from "../search/databaseTablet";
import { Button } from "../ui/button";
import styles from "@/app/styles/tablet.module.scss";
import { SearchLine } from "./searchLine";
import { authClient } from "@/lib/auth-client";
import { DrawerWithTabsAndForm } from "../admin/createObject";
import { LogOut } from "lucide-react";
import { Logout } from "../auth/logout";
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


  const { data: session, isPending } = authClient.useSession();
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [session]);

  return (
    <div className={styles.tabletControls}>
      {/* <div className={styles.buffer}></div> */}

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
