import { useIsAdmin } from "@/hooks/useIsAdmin";
import { IPlanet } from "@/app/types/planet";
import styles from "@/app/styles/tablet.module.scss";
import { useMap } from "@/app/context/mapContext";
import { useLegionsOf } from "@/hooks/useLegionsOf";
import { truncateText } from "../sidebar/ScrollableBlockColumn";
import { fileUrl } from "@/lib/fileUrl";

interface PlanetBarProps {
    planet: IPlanet;
    onEdit: (planet: IPlanet) => void;
    onDelete: (id: string) => void;
    onCreateEvent: (id: string) => void;
}

export const PlanetBar = ({
    planet,
    onEdit,
    onDelete,
    onCreateEvent,
}: PlanetBarProps) => {
    const admin = useIsAdmin();
    const legions = useLegionsOf(planet);
    const { setCurrentPlanet } = useMap();

    return (
        <div
            className={styles.planetBar}
            onClick={() => setCurrentPlanet(planet)}
        >
            <div className="flex flex-row justify-around w-[100%] h-[100%]">
                <div className="flex flex-col ">
                    <div className={styles.name}>{truncateText(planet.name, 12)}</div>
                    <div className={[styles.position, "inline-block whitespace-nowrap"].join(" ")}>-расположение ---{planet.ingamePosition}</div>
                </div>

                <div className="flex flex-row  justify-evenly h-full ">
                    {legions.length > 0 ? (
                        legions.map((legion) => (
                            <img
                                key={legion._id}
                                src={fileUrl(legion.icon)}
                                alt={legion.name}
                                className="h-[100%] object-contain rounded" />
                        ))
                    ) : (
                        <div>легионы не найдены.</div>
                    )}
                </div>
                {admin && <div className="flex flex-col  ">
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onEdit(planet); }}>Редактировать</button>
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onDelete(planet._id); }}>Удалить</button>
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onCreateEvent(planet._id); }}>Создать ивент</button>
                </div>}
            </div>
        </div>
    );
};
