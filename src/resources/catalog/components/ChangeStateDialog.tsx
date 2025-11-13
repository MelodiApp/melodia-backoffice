import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import type { CatalogState } from '../../../types/catalogStates';
import {
  STATE_LABELS,
  STATE_COLORS,
  isTransitionAllowed,
  getTransitionConfig,
  validateTransition,
} from '../../../types/catalogStates';
import { changeItemState } from '../../../services/catalogStateService';

interface ChangeStateDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'song' | 'collection';
  itemTitle: string;
  currentState: CatalogState;
  currentScheduledDate?: string;
  onSuccess: () => void;
}

export function ChangeStateDialog({
  open,
  onClose,
  itemId,
  itemType,
  itemTitle,
  currentState,
  currentScheduledDate,
  onSuccess,
}: ChangeStateDialogProps) {
  const [newState, setNewState] = useState<CatalogState>(currentState);
  const [reason, setReason] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>(
    currentScheduledDate || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableStates: CatalogState[] = ['scheduled', 'published', 'blocked'];

  const handleSubmit = async () => {
    setError(null);

    // Validar transición
    const validation = validateTransition(currentState, newState, {
      reason,
      scheduledDate: scheduledDate || undefined,
    });

    if (!validation.valid) {
      setError(validation.error || 'Error de validación');
      return;
    }

    setLoading(true);

    try {
      const result = await changeItemState({
        itemId,
        itemType,
        currentState,
        newState,
        user: 'admin@melodia.com', // En producción, obtener del auth
        reason: reason || undefined,
        scheduledDate: scheduledDate || undefined,
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error || 'Error al cambiar el estado');
      }
    } catch (err) {
      setError('Error al cambiar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewState(currentState);
    setReason('');
    setScheduledDate(currentScheduledDate || '');
    setError(null);
    onClose();
  };

  const transitionConfig = getTransitionConfig(currentState, newState);
  const requiresReason = transitionConfig?.requiresReason;
  const requiresScheduleDate = transitionConfig?.requiresScheduleDate || newState === 'scheduled';
  const isValidTransition = isTransitionAllowed(currentState, newState);
  const hasChanges = newState !== currentState;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          color: '#ffffff',
        }
      }}
    >
      <DialogTitle sx={{ color: '#ffffff' }}>Cambiar estado</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#b3b3b3' }} gutterBottom>
            Ítem
          </Typography>
          <Typography variant="body1" fontWeight="medium" sx={{ color: '#ffffff' }}>
            {itemTitle}
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#b3b3b3' }} gutterBottom>
              Estado actual
            </Typography>
            <Chip
              label={STATE_LABELS[currentState]}
              color={STATE_COLORS[currentState]}
              size="small"
            />
          </Box>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: '#b3b3b3' }}>Nuevo estado</InputLabel>
          <Select
            value={newState}
            label="Nuevo estado"
            onChange={(e) => setNewState(e.target.value as CatalogState)}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#282828',
                  '& .MuiMenuItem-root': {
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#404040',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#1db954',
                      '&:hover': {
                        backgroundColor: '#1ed760',
                      },
                    },
                  },
                },
              },
            }}
            sx={{
              color: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1db954' },
              '& .MuiSvgIcon-root': { color: '#b3b3b3' },
            }}
          >
            {availableStates.map((state) => (
              <MenuItem key={state} value={state}>
                {STATE_LABELS[state]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!isValidTransition && hasChanges && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Esta transición no está permitida
          </Alert>
        )}

        {requiresScheduleDate && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Fecha y hora de publicación"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Debe ser una fecha futura"
              inputProps={{
                min: new Date().toISOString().slice(0, 16),
              }}
              sx={{
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: '#1db954' },
                  '&.Mui-focused fieldset': { borderColor: '#1db954' },
                },
                '& .MuiFormHelperText-root': { color: '#b3b3b3' },
              }}
            />
          </Box>
        )}

        {(requiresReason || newState === 'blocked') && (
          <TextField
            fullWidth
            label={requiresReason ? 'Razón (requerida)' : 'Razón (opcional)'}
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required={requiresReason}
            placeholder="Describe el motivo del cambio de estado..."
            sx={{ 
              mb: 2,
              '& .MuiInputLabel-root': { color: '#b3b3b3' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#1db954' },
                '&.Mui-focused fieldset': { borderColor: '#1db954' },
              },
            }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Prioridad de estados:</strong> Bloqueado &gt; Programado &gt; Publicado
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} sx={{ color: '#b3b3b3' }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isValidTransition || !hasChanges}
        >
          {loading ? 'Guardando...' : 'Cambiar estado'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
