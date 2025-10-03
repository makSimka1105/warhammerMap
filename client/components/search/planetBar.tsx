import { IPlanet } from "@/app/types/Planet";
import styles from '@/app/styles/tablet.module.scss'
import { useEffect, useMemo, useState } from "react";
import { useMap } from "@/app/context/mapContext";
import { ILegion } from "@/app/types/legion";
import { useAppSelector } from "@/hooks/useStore";
import { authClient } from "@/lib/auth-client";


interface PlanetBarProps {
    planet: IPlanet;
    onclick: (planet: IPlanet) => void;
    ondelete: (id: string) => void;
}
export const PlanetBar = (
    { planet, onclick, ondelete }: PlanetBarProps

) => {
    const { legions } = useAppSelector(
        (state) => state.reducerLegions
    );
    const { data: session, isPending } = authClient.useSession();
    const [admin, setAdmin] = useState(false)
    useEffect(() => {
        if (session?.user.role === "ADMIN") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [session]);

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







    const [data, setData] = useState<IPlanet>(planet);
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
            <div className="flex flex-row justify-between w-[100%] h-[100%]">

                <div className="flex flex-col ">
                    <div className={styles.name}>{data.name}</div>
                    <div className={[styles.position, "inline-block whitespace-nowrap"].join(' ')}>-расположение ---{data.ingamePosition}</div>

                </div>


                <div className="w-[40%]">

                    <div className="flex flex-row  justify-evenly h-[70%] ">
                        {imgsLegions && imgsLegions.length > 0 ? (
                            imgsLegions.map((icon, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/static/${icon}.png`} // пример формирования src
                                    alt={`Легион ${index}`}
                                    className="h-[100%] object-contain rounded" />
                            ))
                        ) : (
                            <div>легионы не найдены.</div>
                        )}
                    </div>
                    {admin &&<div className="flex flex-row gap-5">
                       <button className={styles.id} onClick={() => onclick(planet)}>Редактировать</button>
                         <button className={styles.id} onClick={() => ondelete(planet._id)}>Удалить</button>

                    </div>}

                </div>
            </div>



        </div>
    );
}