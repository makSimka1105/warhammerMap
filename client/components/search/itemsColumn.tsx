import { useIsAdmin } from "@/hooks/useIsAdmin";
import React, { useState } from "react";
import { PlanetBar } from "@/components/search/planetBar";
import { IPlanet } from "@/app/types/planet";
import { ILegion } from "@/app/types/legion";
import { LegionBar } from "./legionBar";
import { PlanetData } from "../admin/planet/NewPlanetTab";
import { PlanetEditDrawer } from "../admin/planet/editPlanet";
import { createEvent, deletePlanet, updatePlanet } from "@/lib/slices/planetSlices";
import { useAppDispatch } from "@/hooks/useStore";
import { DeletePlanetDialog } from "../admin/planet/deletePlanet";
import { toast } from "sonner";
import { LegionEditDrawer } from "../admin/legion/editLegion";
import { DeleteLegionDialog } from "../admin/legion/deleteLegion";
import { deleteLegion, updateLegion } from "@/lib/slices/legionSlices";
import { refreshCatalog } from "@/lib/slices/refreshCatalog";
import { LegionData } from "../admin/legion/NewLegionTab";
import { EventCreateDrawer } from "../admin/EventCreateDrawer";

interface PlanetsListProps {
    planets: IPlanet[] | null;
}

interface LegionsListProps {
    legions: ILegion[] | null;
}

const toPlanetData = (planet: IPlanet): PlanetData => ({
    id: planet._id,
    name: planet.name,
    ingamePosition: planet.ingamePosition ?? "",
    description: planet.description ?? "",
    left: String(planet.left),
    top: String(planet.top),
    size: String(planet.size),
    pic: null,
    legion1: planet.legions?.[0] ?? "",
    legion2: planet.legions?.[1] ?? "",
});

const toLegionData = (legion: ILegion): LegionData => ({
    id: legion._id,
    name: legion.name,
    description: legion.description ?? "",
    icon: null,
});

export function PlanetsList({ planets }: PlanetsListProps) {
    const admin = useIsAdmin();
    const dispatch = useAppDispatch();

    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
    const [deletePlanetId, setDeletePlanetId] = useState<string | null>(null);
    const [eventPlanetId, setEventPlanetId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const result = await dispatch(deletePlanet(id));
        if (deletePlanet.fulfilled.match(result)) {
            toast.success("Планета успешно удалена");
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при удалении планеты");
        }
    };

    const handleSave = async (formData: FormData, id: string) => {
        const result = await dispatch(updatePlanet({ updatedPlanet: formData, id }));
        if (updatePlanet.fulfilled.match(result)) {
            toast.success("Планета успешно обновлена");
            setSelectedPlanet(null);
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при обновлении планеты");
        }
    };

    const handleSaveEvent = async (formData: FormData) => {
        const result = await dispatch(createEvent(formData));
        if (createEvent.fulfilled.match(result)) {
            toast.success("Ивент успешно создан");
            setEventPlanetId(null);
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при создании ивента");
        }
    };

    return (
        <>
            {planets && planets.length > 0 ? (
                planets.map((planet) => (
                    <PlanetBar
                        key={planet._id}
                        planet={planet}
                        onCreateEvent={setEventPlanetId}
                        onDelete={setDeletePlanetId}
                        onEdit={(item) => setSelectedPlanet(toPlanetData(item))}
                    />
                ))
            ) : (
                <div>планеты не найдены.</div>
            )}
            {admin && (
                <>
                    <PlanetEditDrawer
                        initialData={selectedPlanet}
                        onClose={() => setSelectedPlanet(null)}
                        onSave={handleSave}
                    />
                    <DeletePlanetDialog
                        planetId={deletePlanetId}
                        onClose={() => setDeletePlanetId(null)}
                        onDelete={handleDelete}
                    />
                    <EventCreateDrawer
                        planetId={eventPlanetId}
                        onClose={() => setEventPlanetId(null)}
                        onSave={handleSaveEvent}
                    />
                </>
            )}
        </>
    );
}

export function LegionsList({ legions }: LegionsListProps) {
    const admin = useIsAdmin();
    const dispatch = useAppDispatch();

    const [selectedLegion, setSelectedLegion] = useState<LegionData | null>(null);
    const [deleteLegionId, setDeleteLegionId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        const result = await dispatch(deleteLegion(id));
        if (deleteLegion.fulfilled.match(result)) {
            toast.success("Легион успешно удалён");
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при удалении легиона");
        }
    };

    const handleSave = async (formData: FormData, id: string) => {
        const result = await dispatch(updateLegion({ updatedLegion: formData, id }));
        if (updateLegion.fulfilled.match(result)) {
            toast.success("Легион успешно обновлён");
            setSelectedLegion(null);
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при обновлении легиона");
        }
    };

    return (
        <>
            {legions && legions.length > 0 ? (
                legions.map((legion) => (
                    <LegionBar
                        key={legion._id}
                        legion={legion}
                        onEdit={(item) => setSelectedLegion(toLegionData(item))}
                        onDelete={setDeleteLegionId}
                    />
                ))
            ) : (
                <div>легионы не найдены.</div>
            )}

            {admin && (
                <>
                    <LegionEditDrawer
                        initialData={selectedLegion}
                        onClose={() => setSelectedLegion(null)}
                        onSave={handleSave}
                    />
                    <DeleteLegionDialog
                        legionId={deleteLegionId}
                        onClose={() => setDeleteLegionId(null)}
                        onDelete={handleDelete}
                    />
                </>
            )}
        </>
    );
}
