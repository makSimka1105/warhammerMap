import styles from "@/app/styles/tablet.module.scss";
import { useEffect, useState } from "react";
import { ILegion } from "@/app/types/legion";
import { useMap } from "@/app/context/mapContext";
import { authClient } from "@/lib/auth-client";


interface LegionBarProps {
    legion: ILegion;
    onclick: (planet: ILegion) => void;
    ondelete: (id: string) => void;
}

export const LegionBar = (
    { legion, onclick, ondelete }: LegionBarProps

) => {
    // console.log(process.env.NEXT_PUBLIC_ORIGIN_SERVER)

    const { data: session, isPending } = authClient.useSession();
    const [admin, setAdmin] = useState(false)
    useEffect(() => {
        if (session?.user.role === "ADMIN") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [session]);
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
                        src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/${legion.icon}.png`}
                        alt={legion.name}
                        className="h-[100%] object-contain "
                    />
                ) : (
                    <div>иконка не найдена</div>
                )}

                {/* Кнопки редактирования и удаления */}
                {admin && <div className="flex flex-col gap-2 mt-2">
                    <button className={styles.id} onClick={() => onclick(legion)}>
                        Редактировать
                    </button>
                    <button className={styles.id} onClick={() => ondelete(legion._id)}>
                        Удалить
                    </button>
                </div>}
            </div>
        </div>
    );

};
