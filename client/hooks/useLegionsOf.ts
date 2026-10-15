import { useMemo } from "react";
import { ILegion } from "@/app/types/legion";
import { IPlanet } from "@/app/types/planet";
import { useAppSelector } from "./useStore";

export function useLegionsOf(planet: IPlanet): ILegion[] {
    const legions = useAppSelector((state) => state.reducerLegions.legions);

    return useMemo(() => {
        if (!planet.legions || !legions) return [];
        return planet.legions
            .map((id) => legions.find((legion) => legion._id === id))
            .filter((legion): legion is ILegion => legion !== undefined);
    }, [planet.legions, legions]);
}
