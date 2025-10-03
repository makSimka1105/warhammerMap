import React, { useEffect, useState } from 'react';
import { PlanetBar } from '@/components/search/planetBar';
import { IPlanet } from '@/app/types/Planet';
import { ILegion } from '@/app/types/legion';
import { LegionBar } from './legionsBar';
import { PlanetData } from '../admin/planet/NewPlanetTab';
import { PlanetEditDrawer } from '../admin/planet/editPlanet';
import { authClient } from '@/lib/auth-client';
import { deletePlanet, fetchPlanets, updatePlanet } from '@/lib/slices/planetSlices';
import { useAppDispatch } from '@/hooks/useStore';
import { DeletePlanetDialog } from '../admin/planet/deletePlanet';
import { toast } from 'sonner';
import { LegionEditDrawer } from '../admin/legion/editLegion';
import { DeleteLegionDialog } from '../admin/legion/deleteLegion';
import { deleteLegion, fetchLegions, updateLegion } from '@/lib/slices/legionSlices';
import { LegionData } from '../admin/legion/NewLegionTab';



interface PlanetsListProps {
    planets: IPlanet[] | null;
}

interface LegionsListProps {
    legions: ILegion[] | null;
}

export function PlanetsList({ planets }: PlanetsListProps) {
    const { data: session, isPending } = authClient.useSession();
    const [admin, setAdmin] = useState(false)
    useEffect(() => {
        if (session?.user.role === "ADMIN") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [session]);
    const dispatch = useAppDispatch();

    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deletePlanetId, setDeletePlanetId] = React.useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const openDeleteDialog = (id: string) => {
        setDeletePlanetId(id);
        setIsDeleteOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeletePlanetId(null);
        setIsDeleteOpen(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const resultAction = await dispatch(deletePlanet(id));

            if (deletePlanet.fulfilled.match(resultAction)) {
                toast.success("Планета успешно удалена");
                dispatch(fetchPlanets());
            } else {
                // Если ошибка
                toast.error("Ошибка при удалении планеты");
            }
        } catch (error) {
            toast.error("Произошла ошибка при удалении");
        }
    };
    const handleClickDelete = (id: string) => {
        closeDeleteDialog()
        openDeleteDialog(id)

    };
    const mapPlanetToPlanetData = (planet: IPlanet): PlanetData => ({
        id: planet._id,
        name: planet.name,
        ingamePosition: planet.ingamePosition || "",
        description: planet.description,
        left: planet.left.toString(),
        top: planet.top.toString(),
        size: planet.size.toString(),
        pic: null,
        legion1: planet.legions ? planet.legions[0] : undefined,
        legion2: planet.legions ? planet.legions[1] : undefined,
        // если в IPlanet нет файла, оставляем null
    });
    const handleEditClick = (planet: IPlanet) => {

        const planetData = mapPlanetToPlanetData(planet);
        setSelectedPlanet(planetData);
        setIsDrawerOpen(true);
    };


    const handleClose = () => {
        setSelectedPlanet(null);
        setIsDrawerOpen(false);
    };

    const handleSave = async (formData: FormData, id: string) => {
        try {
            handleClose();
            const resultAction = await dispatch(updatePlanet({ updatedPlanet: formData, id }));

            if (updatePlanet.fulfilled.match(resultAction)) {
                toast.success(
                    "Планета успешно обновлена");
                dispatch(fetchPlanets());
            } else {
                toast.error("Ошибка при обновлении планеты");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
        }

        console.log("Сохранить данные:", formData);
    };


    return (
        <>
            {planets && planets.length > 0 ? (
                planets.map((planet, idx) => (
                    <>

                        <PlanetBar ondelete={handleClickDelete} onclick={handleEditClick} key={planet._id || idx} planet={planet} />
                    </>
                ))
            ) : (
                <div>планеты не найдены.</div>
            )}
            {admin && <PlanetEditDrawer
                key={selectedPlanet?.id}
                initialData={selectedPlanet}
                isOpen={isDrawerOpen}
                onClose={handleClose}
                onSave={handleSave}
            />}
            {admin &&
                <DeletePlanetDialog
                    key={selectedPlanet?.id}

                    planetId={deletePlanetId}
                    isOpen={isDeleteOpen}
                    onClose={closeDeleteDialog}
                    onDelete={handleDelete}
                />}

        </>
    );
}






export function LegionsList({ legions }: LegionsListProps) {
    const { data: session, isPending } = authClient.useSession();
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        if (session?.user.role === "ADMIN") {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [session]);

    const dispatch = useAppDispatch();

    const [selectedLegion, setSelectedLegion] = useState<LegionData | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteLegionId, setDeleteLegionId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const openDeleteDialog = (id: string) => {
        setDeleteLegionId(id);
        setIsDeleteOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteLegionId(null);
        setIsDeleteOpen(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const resultAction = await dispatch(deleteLegion(id));

            if (deleteLegion.fulfilled.match(resultAction)) {
                toast.success("Легион успешно удалён");
                dispatch(fetchLegions());
            } else {
                toast.error("Ошибка при удалении легиона");
            }
        } catch (error) {
            toast.error("Произошла ошибка при удалении");
        }
    };

    const handleClickDelete = (id: string) => {
        closeDeleteDialog();
        openDeleteDialog(id);
    };

    const mapLegionToLegionData = (legion: ILegion): LegionData => ({
        id: legion._id,
        name: legion.name,
        description: legion.description || "",
        icon: null, // если в ILegion нет файла, оставляем null
    });

    const handleEditClick = (legion: ILegion) => {
        const legionData = mapLegionToLegionData(legion);
        setSelectedLegion(legionData);
        setIsDrawerOpen(true);
    };

    const handleClose = () => {
        setSelectedLegion(null);
        setIsDrawerOpen(false);
    };

    const handleSave = async (formData: FormData, id: string) => {
        try {
            handleClose();
            const resultAction = await dispatch(updateLegion({ updatedLegion: formData, id }));

            if (updateLegion.fulfilled.match(resultAction)) {
                toast.success("Легион успешно обновлен");
                dispatch(fetchLegions());
            } else {
                toast.error("Ошибка при обновлении легиона");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
        }

        console.log("Сохранить данные:", formData);
    };

    return (
        <>
            {legions && legions.length > 0 ? (
                legions.map((legion, idx) => (
                    <LegionBar
                        key={legion._id || idx}
                        legion={legion}
                        onclick={handleEditClick}
                        ondelete={handleClickDelete}
                    />
                ))
            ) : (
                <div>легионы не найдены.</div>
            )}

            {admin && (
                <LegionEditDrawer
                    initialData={selectedLegion}
                    isOpen={isDrawerOpen}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}

            {admin && (
                <DeleteLegionDialog
                    legionId={deleteLegionId}
                    isOpen={isDeleteOpen}
                    onClose={closeDeleteDialog}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}
