import { useIsAdmin } from "@/hooks/useIsAdmin";
import { IPlanet } from "@/app/types/Planet";
import styles from '@/app/styles/tablet.module.scss'
import { useEffect, useMemo, useState } from "react";
import { useMap } from "@/app/context/mapContext";
import { ILegion } from "@/app/types/legion";
import { useAppSelector } from "@/hooks/useStore";
import { truncateText } from "../sidebar/ScrollableBlockColumn";
import { fileUrl } from "@/lib/fileUrl";


interface PlanetBarProps {
    planet: IPlanet;
    onclick: (planet: IPlanet) => void;
    ondelete: (id: string) => void;
    onCreateEvent: (id: string) => void;
}
export const PlanetBar = (
    { planet, onclick, ondelete ,onCreateEvent}: PlanetBarProps

) => {

    const handleCreateEventClick = () => {
    if (onCreateEvent) {
        onCreateEvent(planet._id);
        
    }
};
    const { legions } = useAppSelector(
        (state) => state.reducerLegions
    );
    const admin = useIsAdmin();

    const findById = (id: string): string | undefined => {
        if (legions) {
            const legion = legions.find((item: ILegion) => item._id === id);
            return legion?.icon;
        }
        return undefined;
    };

    // Memoize the legion images to prevent unnecessary recalculations
    const imgsLegions = (() => {
        if (!planet.legions || !legions) return [];
        return planet.legions
            .map((link) => findById(link))
            .filter((icon): icon is string => icon !== undefined);
    })();







    const { setCurrentLegions, setCurrentPlanet } = useMap()

    function handleSelectingPlanet(_id: string): void {

        setCurrentLegions(imgsLegions);
        setCurrentPlanet(planet);
    }

    return (
        <div
            key={planet._id}
            className={styles.planetBar}
            onClick={() => handleSelectingPlanet(planet._id)}
        >
            <div className="flex flex-row justify-around w-[100%] h-[100%]">

                <div className="flex flex-col ">
                    <div className={styles.name}>{truncateText(planet.name,12)}</div>
                    <div className={[styles.position, "inline-block whitespace-nowrap"].join(' ')}>-расположение ---{planet.ingamePosition}</div>

                </div>


                {/* <div className="flex flex-row w-full justify-end"> */}

                    <div className="flex flex-row  justify-evenly h-full ">
                        {imgsLegions && imgsLegions.length > 0 ? (
                            imgsLegions.map((icon, index) => (
                                <img
                                    key={icon}
                                    src={fileUrl(icon)} // пример формирования src
                                    alt={`Легион ${index}`}
                                    className="h-[100%] object-contain rounded" />
                            ))
                        ) : (
                            <div>легионы не найдены.</div>
                        )}
                    </div>
                    {admin && <div className="flex flex-col  ">
                        <button className={styles.id} onClick={(e) => { e.stopPropagation(); onclick(planet); }}>Редактировать</button>
                        <button className={styles.id} onClick={(e) => { e.stopPropagation(); ondelete(planet._id); }}>Удалить</button>
                        <button className={styles.id} onClick={(e) => { e.stopPropagation(); handleCreateEventClick(); }}>Создать ивент</button>
                        
                    </div>}

                {/* </div> */}
            </div>



        </div>
    );
}