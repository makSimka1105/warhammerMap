import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Dispatch, SetStateAction } from "react";
import { TabType } from "../search/databaseTablet";
import styles from "@/app/styles/tablet.module.scss";
import { SearchLine } from "./searchLine";
import { authClient } from "@/lib/auth-client";
import { DrawerWithTabsAndForm } from "../admin/createObject";
import { Logout } from "../auth/logout";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";

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
  const [isExporting, setIsExporting] = useState(false);

  const exportEvents = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/events/export", { responseType: "blob" });
      const payload = JSON.parse(await response.data.text());
      if (!payload || typeof payload.exportedAt !== "string" || !Array.isArray(payload.events)) {
        throw new Error("Invalid export response");
      }
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition?.match(/filename="?([^";]+)"?/)?.[1] ?? "events.json";
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(payload.events.length ? "События успешно экспортированы" : "События отсутствуют");
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 413) {
        toast.error("Слишком много событий для экспорта");
      } else {
        toast.error(apiErrorMessage(error, "Ошибка при экспорте событий"));
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.tabletControls}>
      <SearchLine
        placeholder="Поиск..."
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        countPlanets={countPlanets}
        countLegions={countLegions}
      />
      {admin && <div className="right-0 z-10 flex h-full items-center gap-2">
        <DrawerWithTabsAndForm />
        <Button size="sm" onClick={exportEvents} disabled={isExporting}>
          {isExporting ? "Экспорт..." : "Экспорт событий"}
        </Button>
      </div>}
      {session && <div className="right-0 z-10">
        <Logout />
      </div>}
    </div>
  );
}
