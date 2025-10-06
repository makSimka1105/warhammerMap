import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface EventCreateDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
    planetId: string | null; // сюда будем передавать ID планеты из которой вызвали
}

export function EventCreateDrawer({ isOpen, onClose, onSave, planetId }: EventCreateDrawerProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [screenshots, setScreenshots] = useState<File[]>([]);

    const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).slice(0, 4);
        setScreenshots(filesArray);
        console.log("Выбранные файлы:", filesArray);
    };

    const handleSubmit = () => {
        if (!planetId) {
            alert("Не выбрана планета");
            return;
        }
        const formData = new FormData();
        formData.append('name', title);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('place', planetId);
        screenshots.forEach(file => formData.append('shots', file as File));
        console.log(screenshots)       // screenshots.forEach((file, idx) => {
        //     formData.append(`screenshots[${idx}]`, file);
        // });
        onSave(formData);
    };


    // return (
    //     // <div className="drawer-overlay">
    //         <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>

    //         <div className="drawer-content">
    //             <h2>Создать ивент</h2>
    //             <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
    //             <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
    //             <input placeholder="Ссылка" value={link} onChange={e => setLink(e.target.value)} />
    //             <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} />
    //             <button onClick={handleSubmit}>Создать</button>
    //             <button onClick={onClose}>Закрыть</button>
    //         </div>

    //         </Dialog>
    //     // </div>
    // );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтверждение удаления</DialogTitle>
                    <DialogDescription>
                        Вы уверены, что хотите удалить этот легион? Это действие невозможно
                        отменить.
                    </DialogDescription>
                </DialogHeader>
                <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
                <input placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
                <input placeholder="Ссылка" value={link} onChange={e => setLink(e.target.value)} />
                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} />


                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleSubmit}>
                        сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
