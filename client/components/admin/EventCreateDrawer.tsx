import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IMAGE_ACCEPT, imageError } from "@/lib/imageFile";

const MAX_SHOTS = 4;

interface EventCreateDrawerProps {
    planetId: string | null;
    onClose: () => void;
    onSave: (formData: FormData) => void;
}

interface EventFormProps {
    planetId: string;
    onSave: (formData: FormData) => void;
}

function EventForm({ planetId, onSave }: EventFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [screenshots, setScreenshots] = useState<File[]>([]);

    const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScreenshots(Array.from(e.target.files ?? []));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Укажите название ивента");
            return;
        }
        if (screenshots.length > MAX_SHOTS) {
            toast.error(`Можно прикрепить не больше ${MAX_SHOTS} скриншотов`);
            return;
        }
        const shotError = screenshots.map(imageError).find(Boolean);
        if (shotError) {
            toast.error(shotError);
            return;
        }

        const formData = new FormData();
        formData.append("name", title.trim());
        formData.append("description", description);
        formData.append("link", link);
        formData.append("place", planetId);
        screenshots.forEach((file) => formData.append("shots", file));
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-3">
                <Label htmlFor="event-name">Название</Label>
                <Input id="event-name" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="event-description">Описание</Label>
                <Input id="event-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="event-link">Ссылка</Label>
                <Input
                    id="event-link"
                    type="url"
                    pattern="https?://.+"
                    placeholder="https://"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="event-shots">Скриншоты</Label>
                <Input
                    id="event-shots"
                    type="file"
                    multiple
                    accept={IMAGE_ACCEPT}
                    onChange={handleScreenshotsChange}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Отмена</Button>
                </DialogClose>
                <Button type="submit">Сохранить</Button>
            </DialogFooter>
        </form>
    );
}

export function EventCreateDrawer({ planetId, onClose, onSave }: EventCreateDrawerProps) {
    return (
        <Dialog open={planetId !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Создать ивент</DialogTitle>
                    <DialogDescription>
                        Заполните данные ивента и прикрепите до {MAX_SHOTS} скриншотов.
                    </DialogDescription>
                </DialogHeader>
                {planetId && <EventForm planetId={planetId} onSave={onSave} />}
            </DialogContent>
        </Dialog>
    );
}
