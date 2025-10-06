"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "@/app/styles/planet.module.scss";
import { useMap } from "@/app/context/mapContext";
import { IPlanet } from "@/app/types/Planet";
import { useAppSelector } from "@/hooks/useStore";
import { ILegion } from "@/app/types/legion";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const Planet: React.FC<{ planet: IPlanet }> = ({ planet }) => {
    const { legions, loading } = useAppSelector(
        (state) => state.reducerLegions
    );
    const {isVisible }=useMap()

    const findById = (id: string): string | undefined => {
        if (legions) {
            const legion = legions.find((item: ILegion) => item._id === id);
            return legion?.icon;
        }
        return undefined;
    };

    const { scaleFactor, setCurrentPlanet, setCurrentLegions } =
        useMap();
    const [size, setSize] = useState(100);
    const [left, setLeft] = useState(1000);
    const [top, setTop] = useState(1000);

    // Memoize the legion images to prevent unnecessary recalculations
    const imgsLegions = useMemo(() => {
        if (!planet.legions || !legions) return [];
        return planet.legions
            .map((link) => findById(link))
            .filter((icon): icon is string => icon !== undefined);
    }, [planet.legions, legions]);

    useEffect(() => {
        if (planet) {
            setSize(planet.size);
            setTop(planet.top);
            setLeft(planet.left);
        }
    }, [planet]);

    const handlePlanetClick = () => {
        setCurrentLegions(imgsLegions);
        setCurrentPlanet(planet);
    };
    // const planetRef = useOutsideClick(() => setCurrentPlanet(null));


    return (
        <div
            // ref={planetRef as React.RefObject<HTMLDivElement>}
            className={styles.planet}
            style={{
                width: `${size * scaleFactor.x * 1.5}px`,
                aspectRatio: "1 / 1",
                left: `${left * scaleFactor.x - (size * scaleFactor.x) / 2}px`,
                top: `${top * scaleFactor.x - (size * scaleFactor.x) / 2}px`,
            }}
            onClick={handlePlanetClick}
        >
            <img
                className={styles["planet-icon"]}
                src={`${process.env.NEXT_PUBLIC_ORIGIN_SERVER}/static/` + planet.pic + ".png"}
                style={{ width: "60%" }}
                alt={`Planet ${planet.name}`}
            />
            <div


                className={[
                    planet.name.split(" ").length === 1
                        ? styles.one
                        : styles.two,
                    styles["planet-label"],
                    `opacity-${isVisible?1:0}`
                ].join(" ")}
            >
                {planet.name.split(" ").length === 1 ? (
                    <div
                        className="translate-y-[-0.3em]"
                        style={{ fontSize: `${size * scaleFactor.x * 0.28}px` }}
                    >
                        {planet.name}
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center w-full padding-top-2"
                        style={{
                            fontSize: `${size * scaleFactor.x * 0.28}px`,
                        }}
                    >
                        <p className="leading-none translate-y-[0.2em]  text-center">{planet.name.split(" ")[0]}</p>
                        <p className="leading-none translate-y-[-0.35em] text-center">{planet.name.split(" ")[1]}</p>
                    </div>
                )}
                <div className={[styles.wrapper,imgsLegions.length>1?"justify-between":"justify-center"].join(' ')}>
                    {!loading &&
                        imgsLegions.map((link: string, key: number) => (
                            <img
                                key={key}
                                src={process.env.NEXT_PUBLIC_ORIGIN_SERVER+
                                    "/static/" +
                                    link +
                                    ".png"
                                }
                                style={{
                                    zIndex: 1000,
                                    height: "100%",
                                    // aspectRatio: "1/1",
                                }}
                                alt={`Legion icon ${key + 1}`}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Planet;
