import { useIsAdmin } from "@/hooks/useIsAdmin";
import styles from "@/app/styles/tablet.module.scss";
import { ILegion } from "@/app/types/legion";
import { useMap } from "@/app/context/mapContext";
import { fileUrl } from "@/lib/fileUrl";

interface LegionBarProps {
    legion: ILegion;
    onEdit: (legion: ILegion) => void;
    onDelete: (id: string) => void;
}

export const LegionBar = ({ legion, onEdit, onDelete }: LegionBarProps) => {
    const admin = useIsAdmin();
    const { setCurrentPlanet } = useMap();

    return (
        <div
            className={styles.planetBar}
            onClick={() => setCurrentPlanet(legion)}
        >
            <div className="flex flex-row justify-around w-full h-[100%]">
                <div className="flex flex-col">
                    <p className={styles.name}>{legion.name}</p>
                    <p className={styles.name}>обьектов-{legion.planets?.length ?? 0}</p>
                </div>

                {legion.icon ? (
                    <img
                        src={fileUrl(legion.icon)}
                        alt={legion.name}
                        className="h-[100%] object-contain "
                    />
                ) : (
                    <div>иконка не найдена</div>
                )}

                {admin && <div className="flex flex-col gap-2 mt-2">
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onEdit(legion); }}>
                        Редактировать
                    </button>
                    <button className={styles.id} onClick={(e) => { e.stopPropagation(); onDelete(legion._id); }}>
                        Удалить
                    </button>
                </div>}
            </div>
        </div>
    );
};
