"use client";
import React, { useEffect, useRef, useCallback } from "react";
import styles from "@/app/styles/map.module.scss";
import { useMap } from "@/app/context/mapContext";
import { useAppSelector } from "@/hooks/useStore";
import BorderComponent from "./mainBorders";
import Planet from "./planet";

const Map: React.FC = () => {
    const {
        isVisible,
        scale,
        offsetX,
        offsetY,
        setScale,
        setOffsetX,
        setOffsetY,
        isDragging,
        setIsDragging,
        viewerRef,
        spaceMapRef,
        clampOffsets,
    } = useMap();
    const { planets, loading } = useAppSelector(
        (state) => state.reducerPlanets
    );

    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const initialOffsetX = useRef<number>(0);
    const initialOffsetY = useRef<number>(0);

    const updateMapTransform = useCallback(() => {
        if (spaceMapRef.current) {
            spaceMapRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
    }, [spaceMapRef, offsetX, offsetY, scale]);

    useEffect(() => {
        updateMapTransform();
    }, [updateMapTransform]);

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();

            if (!viewerRef.current) return;

            const rect = viewerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const newScale = e.deltaY < 0 ? scale * 1.2 : scale / 1.2;
            const minScale = 1;
            const maxScale = 10;
            const clampedScale = Math.max(
                minScale,
                Math.min(maxScale, newScale)
            );

            const newOffsetX =
                mouseX - (mouseX - offsetX) * (clampedScale / scale);
            const newOffsetY =
                mouseY - (mouseY - offsetY) * (clampedScale / scale);

            const { clampedOffsetX, clampedOffsetY } = clampOffsets(
                newOffsetX,
                newOffsetY,
                clampedScale
            );

            setScale(clampedScale);
            setOffsetX(clampedOffsetX);
            setOffsetY(clampedOffsetY);
        },
        [
            scale,
            offsetX,
            offsetY,
            clampOffsets,
            setScale,
            setOffsetX,
            setOffsetY,
            viewerRef,
        ]
    );

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            setIsDragging(true);
            startX.current = e.clientX;
            startY.current = e.clientY;
            initialOffsetX.current = offsetX;
            initialOffsetY.current = offsetY;
            if (spaceMapRef.current) {
                spaceMapRef.current.style.cursor = "grabbing";
            }
        },
        [offsetX, offsetY, setIsDragging, spaceMapRef]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - startX.current;
                const deltaY = e.clientY - startY.current;
                const newOffsetX = initialOffsetX.current + deltaX;
                const newOffsetY = initialOffsetY.current + deltaY;

                const { clampedOffsetX, clampedOffsetY } = clampOffsets(
                    newOffsetX,
                    newOffsetY,
                    scale
                );

                setOffsetX(clampedOffsetX);
                setOffsetY(clampedOffsetY);
            }
        },
        [isDragging, scale, clampOffsets, setOffsetX, setOffsetY]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (spaceMapRef.current) {
            spaceMapRef.current.style.cursor = "grab";
        }
    }, [setIsDragging, spaceMapRef]);

    useEffect(() => {
        const viewerElement = viewerRef.current;
        if (viewerElement) {
            viewerElement.addEventListener(
                "wheel",
                handleWheel as EventListener,
                { passive: false }
            );
            viewerElement.addEventListener(
                "mousedown",
                handleMouseDown as EventListener
            );
        }
        document.addEventListener(
            "mousemove",
            handleMouseMove as EventListener
        );
        document.addEventListener("mouseup", handleMouseUp as EventListener);

        return () => {
            if (viewerElement) {
                viewerElement.removeEventListener(
                    "wheel",
                    handleWheel as EventListener
                );
                viewerElement.removeEventListener(
                    "mousedown",
                    handleMouseDown as EventListener
                );
            }
            document.removeEventListener(
                "mousemove",
                handleMouseMove as EventListener
            );
            document.removeEventListener(
                "mouseup",
                handleMouseUp as EventListener
            );
        };
    }, [
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        viewerRef,
    ]);

    return (
        <div id={styles["viewer-container"]} ref={viewerRef}>
            <div id={styles["space-map"]} ref={spaceMapRef}>
                <BorderComponent isVisible={isVisible} />
                {!loading && planets
                    ? planets.map((planet) => (
                          <Planet key={planet._id} planet={planet} />
                      ))
                    : null}
            </div>
            <div id={styles["zoom-level"]}> {scale.toFixed(2)}х</div>
        </div>
    );
};

export default Map;
