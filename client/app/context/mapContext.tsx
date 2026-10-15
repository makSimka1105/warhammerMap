"use client";
import React, {
    createContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { toast } from "sonner";
import { IPlanet } from "../types/planet";
import { fetchPlanets } from "@/lib/slices/planetSlices";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { fetchLegions } from "@/lib/slices/legionSlices";
import { ILegion } from "../types/legion";

const BASE_MAP_WIDTH = 2500;

interface MapContextType {
    currentPlanet: IPlanet | ILegion | null;
    setCurrentPlanet: (item: IPlanet | ILegion | null) => void;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    scale: number;
    offsetX: number;
    offsetY: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    setOffsetX: React.Dispatch<React.SetStateAction<number>>;
    setOffsetY: React.Dispatch<React.SetStateAction<number>>;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    viewerRef: React.RefObject<HTMLDivElement | null>;
    spaceMapRef: React.RefObject<HTMLDivElement | null>;
    clampOffsets: (
        currentOffsetX: number,
        currentOffsetY: number,
        currentScale: number
    ) => { clampedOffsetX: number; clampedOffsetY: number };
    scaleFactor: { x: number };
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    const planets = useAppSelector((state) => state.reducerPlanets.planets);
    const legions = useAppSelector((state) => state.reducerLegions.legions);

    useEffect(() => {
        dispatch(fetchPlanets())
            .unwrap()
            .catch(() => toast.error("Не удалось загрузить планеты"));
        dispatch(fetchLegions())
            .unwrap()
            .catch(() => toast.error("Не удалось загрузить легионы"));
    }, [dispatch]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [scale, setScale] = useState<number>(1);
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const viewerRef = useRef<HTMLDivElement>(null);
    const spaceMapRef = useRef<HTMLDivElement>(null);

    const [scaleFactor, setScaleFactor] = useState({ x: 1 });

    const currentPlanet = useMemo(() => {
        if (!selectedId) return null;
        return (
            planets?.find((planet) => planet._id === selectedId) ??
            legions?.find((legion) => legion._id === selectedId) ??
            null
        );
    }, [selectedId, planets, legions]);

    const setCurrentPlanet = useCallback(
        (item: IPlanet | ILegion | null) => setSelectedId(item?._id ?? null),
        []
    );

    const clampOffsets = useCallback(
        (
            currentOffsetX: number,
            currentOffsetY: number,
            currentScale: number
        ) => {
            if (!viewerRef.current) {
                return {
                    clampedOffsetX: currentOffsetX,
                    clampedOffsetY: currentOffsetY,
                };
            }
            const viewerWidth = viewerRef.current.clientWidth;
            const viewerHeight = viewerRef.current.clientHeight;
            const mapWidth = viewerWidth * currentScale;
            const mapHeight = viewerHeight * currentScale;
            let newOffsetX = currentOffsetX;
            let newOffsetY = currentOffsetY;

            if (newOffsetX > 0) newOffsetX = 0;
            if (newOffsetY > 0) newOffsetY = 0;

            if (mapHeight <= viewerHeight) {
                newOffsetY = (viewerHeight - mapHeight) / 2;
            } else if (newOffsetY + mapHeight < viewerHeight) {
                newOffsetY = viewerHeight - mapHeight;
            }

            if (mapWidth <= viewerWidth) {
                newOffsetX = (viewerWidth - mapWidth) / 2;
            } else if (newOffsetX + mapWidth < viewerWidth) {
                newOffsetX = viewerWidth - mapWidth;
            }
            return { clampedOffsetX: newOffsetX, clampedOffsetY: newOffsetY };
        },
        []
    );

    const calculateScaleFactor = useCallback(() => {
        if (spaceMapRef.current) {
            const { width } = spaceMapRef.current.getBoundingClientRect();
            setScaleFactor({ x: width / BASE_MAP_WIDTH });
        }
    }, []);

    useEffect(() => {
        calculateScaleFactor();

        window.addEventListener("resize", calculateScaleFactor);
        return () => {
            window.removeEventListener("resize", calculateScaleFactor);
        };
    }, [calculateScaleFactor]);

    const contextValue: MapContextType = {
        isVisible,
        setIsVisible,
        currentPlanet,
        setCurrentPlanet,
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
        scaleFactor,
    };

    return (
        <MapContext.Provider value={contextValue}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
};
