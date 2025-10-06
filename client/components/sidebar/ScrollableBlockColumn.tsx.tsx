import React, { useEffect, useState } from "react";
import styles from "@/app/styles/scrolable.module.scss";
import { IEvent } from "@/app/types/event";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IPlanet } from "@/app/types/Planet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useMap } from "@/app/context/mapContext";
import { ILegion } from "@/app/types/legion";
import { ImageGridPreview } from "../ui/ImageGrigPreview";
import { authClient } from "@/lib/auth-client";
import { deleteEvent, fetchPlanets } from "@/lib/slices/planetSlices";
import { toast } from "sonner";

interface ScrollableBlockColumnProps {
  description: string | null;
  events: IEvent[] | null;
  planetslinks?: string[] | null;
  isLoading?: boolean;
}
export const truncateText = (text: string, maxLength: number) =>
 text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

const ScrollableBlockColumn: React.FC<ScrollableBlockColumnProps> = ({
  description,
  events,
  planetslinks,
  isLoading = false,
}) => {
  const { planets } = useAppSelector((state) => state.reducerPlanets);
  const { legions } = useAppSelector((state) => state.reducerLegions);

  // Использование
  const findById = (id: string): string | undefined => {
    if (legions) {
      const legion = legions.find((item: ILegion) => item._id === id);
      return legion?.icon;
    }
    return undefined;
  };

  const imgsLegions = (planet: IPlanet) => {
    if (!planet || !planet.legions || !legions) return [];
    return planet.legions
      .map((link) => findById(link))
      .filter((icon): icon is string => icon !== undefined);
  };

  const [currentPlanets, setCurrentPlanets] = useState<IPlanet[]>([]);
  const { currentPlanet, setCurrentPlanet, setCurrentLegions } = useMap();

  useEffect(() => {
    if (planets && planetslinks) {
      setCurrentPlanets(
        planets.filter((planet) => planetslinks.includes(planet._id))
      );
    } else {
      setCurrentPlanets([]);
    }
  }, [planets, planetslinks]);
  const { data: session, isPending } = authClient.useSession();
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [session]);
  const dispatch = useAppDispatch();

  const handleDeleteEvent = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteEvent(id));

      if (deleteEvent.fulfilled.match(resultAction)) {
        toast.success("ивент успешно удалена");
        dispatch(fetchPlanets());
      } else {
        // Если ошибка
        toast.error("Ошибка при удалении ивента");
      }
    } catch (error) {
      toast.error("Произошла ошибка при удалении");
    }
  };



  // Здесь начинается обычный JSX без useMemo
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
      {isLoading ? (
        <div style={{ padding: "20px" }}>
          <LoadingSpinner size="medium" text="Загрузка событий..." color="#4299e1" />
        </div>
      ) : currentPlanets && currentPlanets.length > 0 ? (
        currentPlanets.map((planet, index) => (
          <div
            key={planet._id || index}
            className={styles.planet}
            style={{ width: "90%", height: "17%" }}
          >
            <div
              onClick={() => {
                setCurrentPlanet(planet);
                setCurrentLegions(imgsLegions(planet));
              }}
              className="flex flex-row justify-evenly content-center h-[100%] border border-[#333] border-dashed border-[0.2vw]  ">
              <div className="flex flex-col ">
                <p className={[styles.eventTitle, "self-center "].join(" ")}>{truncateText(planet.name, 10)}</p>
                <p className={[styles.description, "self-center "].join(" ")}>{planet.ingamePosition}</p>

              </div>
              <img

                className="h-[80%] transform hover:scale-110 transition self-center"
                src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/${planet.pic}.png`}
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

      {isLoading ? (
        <div style={{ padding: "20px" }}>
          <LoadingSpinner size="medium" text="Загрузка событий..." color="#4299e1" />
        </div>
      ) : events && events.length > 0 ? (
        events.map((event, index) => (
          <div key={event._id || index} className={styles.event} style={{ width: "100%" }}>
            <p className={styles.eventTitle} style={{ marginBottom: 0 }}>
              {event.name}
            </p>
            <ImageGridPreview images={event?.shots} />
            <p style={{ marginBottom: 0 }}>{event.description}</p>
            <button className="text-[#007acc]" onClick={() => window.open(event.link, "_blank")}>
              смотреть в официальном канале
            </button>
            {admin && <div className="text-red-600"  onClick={()=>handleDeleteEvent(event._id)}>удалить</div>}
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
