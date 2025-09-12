// MultipleFiles/mapComp.tsx
"use client";
import React, { useEffect, useRef, useCallback } from "react";
import styles from "@/app/styles/map.module.scss";
import { useMap } from "@/app/context/mapContext";
import { useAppSelector } from "@/hooks/useStore";
import BurgerMenu from "../ui/burgerMenu";
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
    } = useMap(); // Используем хук для получения значений из контекста
    const { planets, loading, error } = useAppSelector(
        (state) => state.reducerPlanets
    );

    // useRef для изменяемых значений, которые не вызывают ререндер
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const initialOffsetX = useRef<number>(0);
    const initialOffsetY = useRef<number>(0);

    const updateMapTransform = useCallback(() => {
        if (spaceMapRef.current) {
            spaceMapRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
    }, [spaceMapRef, offsetX, offsetY, scale]);

    // Вызываем updateMapTransform при изменении соответствующих состояний
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

            let newOffsetX =
                mouseX - (mouseX - offsetX) * (clampedScale / scale);
            let newOffsetY =
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
            // Проверяем, если клик был на планете
            const isPlanetClick =
                e.target instanceof HTMLElement &&
                e.target.classList.contains("icon"); // Замените 'planet-class' на реальный класс планеты

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

    // const handleMouseDown = useCallback((e: MouseEvent) => {
    //     setIsDragging(true);
    //     startX.current = e.clientX;
    //     startY.current = e.clientY;
    //     initialOffsetX.current = offsetX;
    //     initialOffsetY.current = offsetY;
    //     if (spaceMapRef.current) {
    //         spaceMapRef.current.style.cursor = 'grabbing';
    //     }
    // }, [offsetX, offsetY, setIsDragging, spaceMapRef]);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - startX.current;
                const deltaY = e.clientY - startY.current;
                let newOffsetX = initialOffsetX.current + deltaX;
                let newOffsetY = initialOffsetY.current + deltaY;

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

    // Добавление и удаление слушателей событий
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

    // const dispatch = useAppDispatch();

    return (
        <div id={styles["viewer-container"]} ref={viewerRef}>
            <div id={styles["space-map"]} ref={spaceMapRef}>
                <BorderComponent isVisible={isVisible} />
                {!loading && planets
                    ? planets.map((planet, index) => (
                          <Planet key={index} planet={planet} />
                      ))
                    : null}
            </div>
            <div id={styles["zoom-level"]}> {scale.toFixed(2)}х</div>
        </div>
    );
};

export default Map;
