import { IPlanet } from "@/app/types/Planet";
import styles from '@/app/styles/tablet.module.scss'
import { useMemo, useState } from "react";
import { useMap } from "@/app/context/mapContext";
import { ILegion } from "@/app/types/legion";
import { useAppSelector } from "@/hooks/useStore";

export const PlanetBar = (
    planet: IPlanet,
   
) => {
     const { legions } = useAppSelector(
         (state) => state.reducerLegions
     );

     const findById = (id: string): string | undefined => {
         if (legions) {
             const legion = legions.find((item: ILegion) => item._id === id);
             return legion?.icon;
         }
         return undefined;
     };

     // Memoize the legion images to prevent unnecessary recalculations
     const imgsLegions = useMemo(() => {
         if (!planet.legions || !legions) return [];
         return planet.legions
             .map((link) => findById(link))
             .filter((icon): icon is string => icon !== undefined);
     }, [planet.legions, legions]);



   



        const [data, setData] = useState<IPlanet>(planet);
        const {setCurrentLegions,setCurrentPlanet}=useMap()

    function handleSelectingPlanet(_id:string):void {
        
            setCurrentLegions(imgsLegions);
            setCurrentPlanet(planet);
    }

    return (
        <div
            key={planet._id}
            className={styles.planetBar}
            onClick={()=>handleSelectingPlanet(planet._id)}
        >
            <p className={styles.name}>{data.name}</p>
            <p className={styles.id}> -{data._id}</p>
            <p className={styles.position}>
                -расположение --- {data.ingamePosition}
            </p>
        </div>
    );
}