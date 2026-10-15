import { IPlanet } from "@/app/types/planet";
import styles from "@/app/styles/upperInfo.module.scss";
import { Label } from "../ui/label";
import { useLegionsOf } from "@/hooks/useLegionsOf";
import { ILegion } from "@/app/types/legion";
import { fileUrl } from "@/lib/fileUrl";

function isPlanet(item: IPlanet | ILegion): item is IPlanet {
    return "pic" in item;
}

const LegionUpperInfo: React.FC<{ legion: ILegion }> = ({ legion }) => (
    <div className={styles.upperInfo}>
        <div className={styles.title}>
            <p className={styles.nameLegion}>{legion.name}</p>
        </div>
        <div className={styles.iconWrapper}>
            <img
                className={styles.icon}
                src={fileUrl(legion.icon)}
                alt={legion.name}
            />
        </div>
    </div>
);

const PlanetUpperInfo: React.FC<{ planet: IPlanet }> = ({ planet }) => {
    const legions = useLegionsOf(planet);

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
                    src={fileUrl(planet.pic)}
                    alt={planet.name}
                />
            </div>

            <div className={styles.imageContainer}>
                {legions.map((legion) => (
                    <div key={legion._id} className={styles.imageWrapper}>
                        <img
                            src={fileUrl(legion.icon)}
                            alt={legion.name}
                            className=" object-cover h-full"
                        />
                        <Label className={styles.imageLabel}>{legion.name}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const UpperInfo: React.FC<{ item: IPlanet | ILegion }> = ({ item }) =>
    isPlanet(item) ? (
        <PlanetUpperInfo planet={item} />
    ) : (
        <LegionUpperInfo legion={item} />
    );
