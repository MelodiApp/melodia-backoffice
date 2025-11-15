import React from "react";
import { 
  EditButton as BaseEditButton, 
  DeleteButton as BaseDeleteButton,
  useRecordContext
} from "react-admin";
import { Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import type { User } from "../types/user";

/**
 * EditButton personalizado que se deshabilita para usuarios admin
 */
export const RestrictedEditButton = () => {
  const record = useRecordContext<User>();
  
  if (!record) return null;
  
  // Si es admin, mostrar botón deshabilitado
  if (record.role === "admin") {
    return (
      <Button
        disabled
        size="small"
        sx={{ 
          color: "#666",
          cursor: "not-allowed",
          "&:hover": {
            backgroundColor: "transparent"
          }
        }}
        startIcon={<Edit />}
      >
        Editar
      </Button>
    );
  }
  
  // Para otros roles, mostrar botón normal
  return <BaseEditButton />;
};

/**
 * DeleteButton personalizado que se deshabilita para usuarios admin
 */
export const RestrictedDeleteButton = () => {
  const record = useRecordContext<User>();
  
  if (!record) return null;
  
  // Si es admin, mostrar botón deshabilitado
  if (record.role === "admin") {
    return (
      <Button
        disabled
        size="small"
        sx={{ 
          color: "#666",
          cursor: "not-allowed",
          "&:hover": {
            backgroundColor: "transparent"
          }
        }}
        startIcon={<Delete />}
      >
        Eliminar
      </Button>
    );
  }
  
  // Para otros roles, mostrar botón normal
  return <BaseDeleteButton mutationMode="pessimistic" />;
};