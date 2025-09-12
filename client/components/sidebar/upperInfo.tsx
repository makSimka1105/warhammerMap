import { IPlanet } from "@/app/types/Planet";
import styles from "@/app/styles/upperInfo.module.scss";
import { useMap } from "@/app/context/mapContext";
import { Label } from "../ui/label";
import { useAppSelector } from "@/hooks/useStore";

export const UpperInfo: React.FC<{ planet: IPlanet | null }> = ({ planet }) => {
    const { currentLegions } = useMap();
    const legions = useAppSelector((state) => state.reducerLegions.legions);

    if (!planet) {
        return <></>;
    }

    const hasImages = planet.legions && planet.legions.length > 0;

    // Helper function to get legion name by ID
    const getLegionName = (legionId: string): string => {
        if (!legions) return "";
        const legion = legions.find((l) => l._id === legionId);
        return legion?.name || "";
    };

    return (
        <div className={styles.upperInfo}>
            <div className={styles.title}>
                <p className={styles.name}>{planet.name}</p>
                <p className={styles.ingamePosition}>
                    координаты: {planet.ingamePosition || "Unknown"}
                </p>
            </div>
            <div className={styles.iconWrapper}>
                <img
                    className={styles.icon}
                    src={"http://localhost:5000/static/" + planet.pic + ".png"}
                    alt={planet.name}
                />
            </div>

            <div className={styles.imageContainer}>
                {hasImages ? (
                    currentLegions.map((id, index) => (
                        <div key={index} className={styles.imageWrapper}>
                            <img
                                src={
                                    "http://localhost:5000/static/" +
                                    id +
                                    ".png"
                                }
                                style={{ objectFit: "cover", width: "100%" }}
                            />
                            <Label className={styles.imageLabel}>
                                {getLegionName(planet.legions?.[index] || "")}
                            </Label>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};
