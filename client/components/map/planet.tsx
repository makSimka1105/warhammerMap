"use client";
import React from "react";
import styles from "@/app/styles/planet.module.scss";
import { useMap } from "@/app/context/mapContext";
import { IPlanet } from "@/app/types/planet";
import { useAppSelector } from "@/hooks/useStore";
import { useLegionsOf } from "@/hooks/useLegionsOf";
import { fileUrl } from "@/lib/fileUrl";

const Planet: React.FC<{ planet: IPlanet }> = ({ planet }) => {
    const loading = useAppSelector((state) => state.reducerLegions.loading);
    const { isVisible, scaleFactor, setCurrentPlanet } = useMap();
    const legions = useLegionsOf(planet);

    const { size, left, top } = planet;
    const nameParts = planet.name.split(" ");

    return (
        <div
            className={styles.planet}
            style={{
                width: `${size * scaleFactor.x * 1.5}px`,
                aspectRatio: "1 / 1",
                left: `${left * scaleFactor.x - (size * scaleFactor.x) / 2}px`,
                top: `${top * scaleFactor.x - (size * scaleFactor.x) / 2}px`,
            }}
            onClick={() => setCurrentPlanet(planet)}
        >
            <img
                className={styles["planet-icon"]}
                src={fileUrl(planet.pic)}
                style={{ width: "60%" }}
                alt={`Planet ${planet.name}`}
            />
            <div
                className={[
                    nameParts.length === 1 ? styles.one : styles.two,
                    styles["planet-label"],
                    `opacity-${isVisible ? 1 : 0}`,
                ].join(" ")}
            >
                {nameParts.length === 1 ? (
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
                        <p className="leading-none translate-y-[0.2em]  text-center">{nameParts[0]}</p>
                        <p className="leading-none translate-y-[-0.35em] text-center">{nameParts[1]}</p>
                    </div>
                )}
                <div className={[styles.wrapper, legions.length > 1 ? "justify-between" : "justify-center"].join(" ")}>
                    {!loading &&
                        legions.map((legion) => (
                            <img
                                key={legion._id}
                                src={fileUrl(legion.icon)}
                                style={{
                                    zIndex: 1000,
                                    height: "100%",
                                }}
                                alt={`Легион ${legion.name}`}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Planet;
