import React, { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IEvent } from "@/app/types/event";
import { IPlanet } from "@/app/types/planet";

interface EventEditDrawerProps {
    event: IEvent | null;
    planets: IPlanet[] | null;
    onClose: () => void;
    onSave: (id: string, changes: { name: string; description: string; link: string; place: string }) => Promise<boolean>;
}

export function EventEditDrawer({ event, planets, onClose, onSave }: EventEditDrawerProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [place, setPlace] = useState("");

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDescription(event.description ?? "");
            setLink(event.link ?? "");
            setPlace(event.place);
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event || !name.trim()) return;
        if (await onSave(event._id, { name: name.trim(), description, link, place })) onClose();
    };

    return (
        <Dialog open={event !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать ивент</DialogTitle>
                    <DialogDescription>Измените данные ивента.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="edit-event-name">Название</Label>
                        <Input id="edit-event-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="edit-event-description">Описание</Label>
                        <Input id="edit-event-description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="edit-event-link">Ссылка</Label>
                        <Input
                            id="edit-event-link"
                            type="url"
                            pattern="https?://.+"
                            placeholder="https://"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="edit-event-place">Планета</Label>
                        <select
                            id="edit-event-place"
                            className="border-input bg-transparent h-9 rounded-md border px-3 text-sm"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            required
                        >
                            {planets?.map((planet) => (
                                <option key={planet._id} value={planet._id}>{planet.name}</option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Сохранить</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
