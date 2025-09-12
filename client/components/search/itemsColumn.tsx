import React from 'react';
import {PlanetBar} from '@/components/search/planetBar';
import { IPlanet } from '@/app/types/Planet';
import { ILegion } from '@/app/types/legion';
import { LegionBar } from './legionsBar';



interface PlanetsListProps {
    planets: IPlanet[]|null;
}

interface LegionsListProps {
    legions: ILegion[]|null;
}

export function PlanetsList({ planets }: PlanetsListProps) {
    return (
        <>
            {planets && planets.length > 0 ? (
                planets.map((planet, idx) => (
                    <PlanetBar key={planet._id || idx} {...planet} />
                ))
            ) : (
                <div>No planets found.</div>
            )}
        </>
    );
}
export function LegionsList({ legions }: LegionsListProps) {
    return (
        <>
            {legions && legions.length > 0 ? (
                legions.map((legion, idx) => (
                    <LegionBar key={legion._id || idx} {...legion} />
                ))
            ) : (
                <div>No planets found.</div>
            )}
        </>
    );
}
