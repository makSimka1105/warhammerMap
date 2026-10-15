import { useIsAdmin } from "@/hooks/useIsAdmin";
import React, { useMemo } from "react";
import styles from "@/app/styles/scrollable.module.scss";
import { IEvent } from "@/app/types/event";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useMap } from "@/app/context/mapContext";
import { ImageGridPreview } from "../ui/ImageGridPreview";
import { deleteEvent, fetchPlanets } from "@/lib/slices/planetSlices";
import { toast } from "sonner";
import { fileUrl } from "@/lib/fileUrl";

interface ScrollableBlockColumnProps {
  description: string | null;
  events: IEvent[] | null;
  planetslinks?: string[] | null;
}

export const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const ScrollableBlockColumn: React.FC<ScrollableBlockColumnProps> = ({
  description,
  events,
  planetslinks,
}) => {
  const { planets } = useAppSelector((state) => state.reducerPlanets);
  const { setCurrentPlanet } = useMap();
  const admin = useIsAdmin();
  const dispatch = useAppDispatch();

  const currentPlanets = useMemo(() => {
    if (!planets || !planetslinks) return [];
    return planets.filter((planet) => planetslinks.includes(planet._id));
  }, [planets, planetslinks]);

  const handleDeleteEvent = async (id: string) => {
    const result = await dispatch(deleteEvent(id));
    if (deleteEvent.fulfilled.match(result)) {
      toast.success("Ивент удалён");
      dispatch(fetchPlanets());
    } else {
      toast.error(result.payload ?? "Ошибка при удалении ивента");
    }
  };

  return (
    <div className={styles.scrollWrapper}>
      {description ? (
        <div className={styles.description}>
          <p className={styles.descriptionTitle} style={{ marginBottom: 0 }}>
            описание
          </p>
          <p className="break-all" style={{ marginBottom: 0, marginTop: 0 }}>
            {description}
          </p>
        </div>
      ) : (
        <div className={styles.noData}>
          <p>данные описания отсутствуют</p>
        </div>
      )}
      <div className={styles.border}></div>
      {currentPlanets.length > 0 ? (
        currentPlanets.map((planet) => (
          <div
            key={planet._id}
            className={styles.planet}
            style={{ width: "90%", height: "17%" }}
          >
            <div
              onClick={() => setCurrentPlanet(planet)}
              className="flex flex-row justify-evenly content-center h-[100%] border border-[#333] border-dashed border-[0.2vw]  ">
              <div className="flex flex-col ">
                <p className={[styles.eventTitle, "self-center "].join(" ")}>{truncateText(planet.name, 10)}</p>
                <p className={[styles.description, "self-center "].join(" ")}>{planet.ingamePosition}</p>
              </div>
              <img
                className="h-[80%] transform hover:scale-110 transition self-center"
                src={fileUrl(planet.pic)}
                alt=""
              />
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noData}>
        </div>
      )}
      <div className={styles.border}></div>

      {events && events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} className={styles.event} style={{ width: "100%" }}>
            <p className={styles.eventTitle} style={{ marginBottom: 0 }}>
              {event.name}
            </p>
            <ImageGridPreview images={event.shots} />
            <p style={{ marginBottom: 0 }}>{event.description}</p>
            {event.link && (
              <button className="text-[#007acc]" onClick={() => window.open(event.link, "_blank", "noopener,noreferrer")}>
                смотреть в официальном канале
              </button>
            )}
            {admin && (
              <button className="text-red-600" onClick={() => handleDeleteEvent(event._id)}>
                удалить
              </button>
            )}
            <div className={styles.border}></div>
          </div>
        ))
      ) : (
        <div className={styles.noData}>
          <p>данные о событиях отсутствуют</p>
        </div>
      )}
    </div>
  );
};

export default ScrollableBlockColumn;
