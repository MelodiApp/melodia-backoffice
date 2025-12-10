import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useNotify } from 'react-admin';
import type { CatalogStatus } from '../../../types/catalog';
import { changeItemState } from '../../../services/catalogStateService';

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'song' | 'collection';
  itemTitle?: string;
  currentState: CatalogStatus;
  newState: CatalogStatus;
  onSuccess?: () => void;
}

export default function ReasonDialog({ open, onClose, itemId, itemType, itemTitle, currentState, newState, onSuccess }: ReasonDialogProps) {
  const notify = useNotify();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para traducir el estado a español
  const getStateLabel = (state: CatalogStatus): string => {
    const stateLabels: Record<CatalogStatus, string> = {
      'published': 'publicado',
      'blocked': 'bloqueado',
      'scheduled': 'programado',
    };
    return stateLabels[state] || state;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!reason || reason.trim().length === 0) {
      setError('Debe ingresar una razón');
      return;
    }
    setLoading(true);
    try {
      const result = await changeItemState({
        itemId,
        itemType,
        currentState,
        newState,
        reason,
        user: 'admin@melodia.com',
      });

      if (result.success) {
        // Si estamos desbloqueando, el mensaje es genérico porque el backend decide el estado final
        const message = newState === 'blocked' 
          ? `"${itemTitle || itemId}" ha sido bloqueado`
          : `"${itemTitle || itemId}" ha sido desbloqueado`;
        notify(message, { type: 'success' });
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        setError(result.error || 'Error al cambiar el estado');
      }
    } catch (err) {
      console.error('Error in ReasonDialog:', err);
      setError('Error al cambiar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{newState === 'blocked' ? 'Bloquear ítem' : 'Desbloquear ítem'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Ítem</Typography>
          <Typography variant="body1" fontWeight="medium">{itemTitle || itemId}</Typography>
        </Box>
        <TextField
          fullWidth
          label="Razón (requerida)"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>Aceptar</Button>
      </DialogActions>
    </Dialog>
  );
}
