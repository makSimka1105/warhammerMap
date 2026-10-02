import { useIsAdmin } from "@/hooks/useIsAdmin";
import styles from "@/app/styles/tablet.module.scss";
import { useEffect, useState } from "react";
import { ILegion } from "@/app/types/legion";
import { useMap } from "@/app/context/mapContext";
import { fileUrl } from "@/lib/fileUrl";


interface LegionBarProps {
    legion: ILegion;
    onclick: (planet: ILegion) => void;
    ondelete: (id: string) => void;
}

export const LegionBar = (
    { legion, onclick, ondelete }: LegionBarProps

) => {

    const admin = useIsAdmin();
    const { setCurrentPlanet } = useMap()
    // const [data, setData] = useState<ILegion>(legion);
    const handleLegionSelecting = (legion: ILegion) => {
        setCurrentPlanet(legion)


    }

    return (
        <div
            key={legion._id}
            className={styles.planetBar}
            onClick={() => handleLegionSelecting(legion)}
        >
            <div className="flex flex-row justify-around w-full h-[100%]">
                <div className="flex flex-col">
                    <p className={styles.name}>{legion.name}</p>
                    <p className={styles.name}>обьектов-{legion.planets?.length}</p>

                </div>

                {/* Отображение одной иконки легиона */}
                {legion.icon ? (
                    <img
                        src={fileUrl(legion.icon)}
                        alt={legion.name}
                        className="h-[100%] object-contain "
                    />
                ) : (
                    <div>иконка не найдена</div>
                )}

                {/* Кнопки редактирования и удаления */}
                {admin && <div className="flex flex-col gap-2 mt-2">
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onclick(legion); }}>
                        Редактировать
                    </button>
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); ondelete(legion._id); }}>
                        Удалить
                    </button>
                </div>}
            </div>
        </div>
    );

};
