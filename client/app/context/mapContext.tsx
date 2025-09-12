// MultipleFiles/MapContext.tsx
"use client";
import React, {
    createContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
} from "react";
import { IPlanet } from "../types/Planet"; // Убедитесь, что путь правильный
import { fetchPlanets } from "@/lib/slices/planetSlices";
import { useAppDispatch } from "../../hooks/useStore";
import { fetchLegions } from "@/lib/slices/legionSlices";
import { ILegion } from "../types/legion";

// const planetsData:IPlanet[] = [
//     {
//         _id:'1',
//         type:'planet',
//         name:'дворец императора',
//         left: 760,
//         top: 1279,
//         size: 89 ,
//         pic:'/assets/icons/terra_norings.png',
//         ingamePosition: ' жв 870 ' ,
//         description:'Тронный мир и столица Империума Человечества, родная планета человеческой расы, а также место рождения самого Императора Человечества. Это самое священное и почитаемое место среди всех миллионов миров, составляющих межзвездную державу человечества.',
//         events:[]
//     },
//     {
//         _id:'2',
//         type:'planet',
//         name: 'марс',
//         left: 701,
//         top: 1348,
//         size: 59 ,
//         pic:'/assets/icons/mars.png',
//         ingamePosition: ' - ' ,
//         description:'01010101001101101 01010101010100010 010 10 1001101021010101001010100100000000 11001 11001 01 0101011101110111010.',
//         events:[]
//     }
// ];

// Интерфейс для результатов поиска
export interface SearchResult {
    id: string;
    name: string;
    type: "planet" | "legion";
    data: IPlanet | ILegion; // ILegion
}

// Интерфейс для значений контекста
interface MapContextType {
    currentLegions: string[];
    setCurrentLegions: React.Dispatch<React.SetStateAction<string[]>>;

    // dispatch:AppDispatch;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    planets?: IPlanet[]; // Состояние для хранения планет
    setPlanets?: React.Dispatch<React.SetStateAction<IPlanet[]>>; //
    loading?: boolean; // Состояние для загрузки данных
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Функция для установки состояния загрузки
    currentPlanet: IPlanet | null; // Текущая планета для взаимодействия
    setCurrentPlanet: React.Dispatch<React.SetStateAction<IPlanet | null>>; //
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
    getScaledPosition: (planet: IPlanet) => { top: number; left: number };


    
}

// Создание контекста с значениями по умолчанию (можно использовать null и проверять в провайдере)
export const MapContext = createContext<MapContextType | undefined>(undefined);

// Провайдер контекста
export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchPlanets());
        dispatch(fetchLegions());
    }, [dispatch]);

    const [currentLegions, setCurrentLegions] = useState([""]);
    const [isVisible, setIsVisible] = useState(true);
    const [scale, setScale] = useState<number>(1);
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [currentPlanet, setCurrentPlanet] = useState<IPlanet | null>(null); // Текущая планета для взаимодействия

    const viewerRef = useRef<HTMLDivElement>(null);
    const spaceMapRef = useRef<HTMLDivElement>(null);

    const BASE_MAP_SIZE = { width: 2500 };
    const [scaleFactor, setScaleFactor] = useState({ x: 1 });

    const [searchResults,setSearchResults]=useState<SearchResult>()

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

            const xScale = width / BASE_MAP_SIZE.width;
            setScaleFactor({ x: xScale });

            // Debug logging for development only
            if (process.env.NODE_ENV === "development") {
                console.log(
                    `Scale factor calculated: ${xScale}, ${width}, ${BASE_MAP_SIZE.width}`
                );
            }
        }
    }, []);

    useEffect(() => {
        calculateScaleFactor();

        const handleResize = () => {
            calculateScaleFactor();
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [calculateScaleFactor]);

    const getScaledPosition = useCallback(
        (planet: IPlanet) => {
            return {
                top: planet.top * scaleFactor.x,
                left: planet.left * scaleFactor.x,
            };
        },
        [scaleFactor.x]
    );

    const contextValue: MapContextType = {


        currentLegions,
        setCurrentLegions,
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
        getScaledPosition,
    };

    return (
        <MapContext.Provider value={contextValue}>
            {children}
        </MapContext.Provider>
    );
};

// Хук для удобного использования контекста
export const useMap = () => {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
};
