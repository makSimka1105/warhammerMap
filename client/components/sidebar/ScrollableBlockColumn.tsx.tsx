import React, { useEffect, useMemo, useState } from "react";
import styles from "@/app/styles/scrolable.module.scss";
import { IEvent } from "@/app/types/event";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IPlanet } from "@/app/types/Planet";
import { useAppSelector } from "@/hooks/useStore";
import { useMap } from "@/app/context/mapContext";
import { ILegion } from "@/app/types/legion";
import { ImageGridPreview } from "../ui/ImageGrigPreview";

// Определение интерфейса для пропсов
interface ScrollableBlockColumnProps {
    description: string | null;
    events: IEvent[] | null;
    planetslinks?: string | null;
    isLoading?: boolean;
}

const ScrollableBlockColumn: React.FC<ScrollableBlockColumnProps> = ({
    description,
    events,
    planetslinks,
    isLoading = false,
}) => {



    const { planets, loading } = useAppSelector((state) => state.reducerPlanets);
    const { legions} = useAppSelector((state) => state.reducerLegions);

     const findById = (id: string): string | undefined => {
            if (legions) {
                const legion = legions.find((item: ILegion) => item._id === id);
                return legion?.icon;
            }
            return undefined;
        };
    
        // Memoize the legion images to prevent unnecessary recalculations
        const imgsLegions = (planet:IPlanet) => {
            if(!planet){
                return [];
            }
            if (!planet.legions || !legions) return [];
            return planet.legions
                .map((link) => findById(link))
                .filter((icon): icon is string => icon !== undefined);
        };
    
    const [currentPlanets, setCurrentPlanets] = useState<IPlanet[]>([]);

    const {setCurrentPlanet,setCurrentLegions}=useMap()

    useEffect(() => {
        if (planets && planetslinks) {
            setCurrentPlanets(
                planets.filter((planet) => planetslinks.includes(planet._id))
            );
        } else {
            setCurrentPlanets([]);
        }
        console.log(currentPlanets, planets, planetslinks)
    }, [planets, planetslinks]);


    // Memoize the description section to prevent unnecessary re-renders
    const descriptionSection = useMemo(() => {
        if (description) {
            return (
                <div className={styles.description}>
                    <p
                        className={styles.descriptionTitle}
                        style={{ marginBottom: 0 }}
                    >
                        описание
                    </p>
                    <p className=" break-all" style={{ marginBottom: 0, marginTop: 0 }}>
                        {description}
                    </p>
                </div>
            );
        }
        return (
            <div className={styles.noData}>
                <p>данные описания отсутствуют</p>
            </div>
        );
    }, [description]);

    // Memoize the events section
    const eventsSection = useMemo(() => {
        if (isLoading) {
            return (
                <div style={{ padding: "20px" }}>
                    <LoadingSpinner
                        size="medium"
                        text="Загрузка событий..."
                        color="#4299e1"
                    />
                </div>
            );
        }

        if (events && events.length > 0) {
            return events.map((event, index) => (
                <div
                    key={event._id || index}
                    className={styles.event}
                    style={{ width: "100%" }}
                >
                    <p
                        className={styles.eventTitle}
                        style={{ marginBottom: 0 }}
                    >
                        {event?.name}
                    </p>
                    {/* <ImageGridPreview images={event?.shots} /> */}
                    <p style={{ marginBottom: 0 }}>{event?.description}</p>
                </div>
            ));
        }
        return (
            <div className={styles.noData}>
                <p>данные о событиях отсутствуют</p>
            </div>
        );
    }, [events, isLoading]);

    const planetsSection = useMemo(() => {
        if (isLoading) {
            return (
                <div style={{ padding: "20px" }}>
                    <LoadingSpinner
                        size="medium"
                        text="Загрузка событий..."
                        color="#4299e1"
                    />
                </div>
            );
        }


        if (currentPlanets && currentPlanets.length > 0) {

            return currentPlanets.map((planet, index) => (
                <div
                    key={planet._id || index}
                    className={styles.planet}
                    style={{ width: "100%" }}
                    onClick={()=>{
                        setCurrentPlanet(planet)
                        setCurrentLegions(imgsLegions(planet))
                    }}
                >

                    <div className="flex flex-row justify-evenly h-[100%] transform hover:scale-110 transition">
                    <p
                        className={styles.eventTitle}
                    >
                        {planet?.name}
                    </p>
                    
                    <img className="h-[100%]" src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/`+planet.pic+".png"} alt="" />
                    </div>
                </div>
            ));
        }
        if (planets == null || planets.length == 0) {

            return (
                <div className={styles.noData}>
                    <p>данные о планетах отсутствуют</p>
                </div>
            );
        }
    }, [currentPlanets, isLoading]);

    // Memoize the entire component render to prevent unnecessary re-renders
    const memoizedContent = useMemo(() => {
        return (
            <div className={styles.scrollWrapper}>
                {descriptionSection}
                {planetsSection}
                {eventsSection}
            </div>
        );
    }, [descriptionSection, eventsSection, planetsSection]);

    return memoizedContent;

};

export default ScrollableBlockColumn;
