import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteLegionDialogProps {
  legionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const DeleteLegionDialog: React.FC<DeleteLegionDialogProps> = ({
  legionId: legionId,
  isOpen,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    if (legionId) {
      onDelete(legionId);
      onClose();
    }
  };

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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
