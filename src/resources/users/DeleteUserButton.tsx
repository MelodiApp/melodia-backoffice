import { useState } from "react";
import { useDelete, useNotify, useRecordContext } from "react-admin";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteUserButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const [open, setOpen] = useState(false);
  const [deleteOne, { isLoading }] = useDelete();

  const handleClick = () => {
    console.log("DeleteUserButton: Botón eliminar clickeado");
    console.log("DeleteUserButton: Usuario a eliminar:", record);
    setOpen(true);
  };

  const handleClose = () => {
    console.log("DeleteUserButton: Dialog cerrado sin eliminar");
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!record) {
      console.error("DeleteUserButton: No hay registro para eliminar");
      return;
    }

    console.log(
      "DeleteUserButton: Confirmación de eliminación para usuario:",
      record.username,
    );
    console.log("DeleteUserButton: ID del usuario:", record.id);

    deleteOne(
      "users",
      { id: record.id, previousData: record },
      {
        onSuccess: () => {
          console.log(
            "DeleteUserButton: Usuario eliminado exitosamente:",
            record.username,
          );
          notify("Usuario eliminado", { type: "success" });
          setOpen(false);
        },
        onError: (error) => {
          console.error("DeleteUserButton: Error al eliminar usuario:", error);
          notify("Error al eliminar el usuario", { type: "error" });
          setOpen(false);
        },
      },
    );
  };

  if (!record) return null;

  return (
    <>
      <Button
        onClick={handleClick}
        color="error"
        startIcon={<DeleteIcon />}
        size="small"
        disabled={isLoading}
      >
        Eliminar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás segura de que querés eliminar al usuario{" "}
            <strong>{record.username}</strong>? Esta acción no se puede
            deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
