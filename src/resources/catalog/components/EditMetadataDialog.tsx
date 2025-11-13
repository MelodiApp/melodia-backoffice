import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Typography,
} from '@mui/material';

interface EditMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'song' | 'collection';
  currentTitle: string;
  onSuccess: (newTitle: string) => void;
}

export function EditMetadataDialog({
  open,
  onClose,
  itemId,
  itemType,
  currentTitle,
  onSuccess,
}: EditMetadataDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError('El título no puede estar vacío');
      return;
    }

    if (title.trim() === currentTitle) {
      setError('No se han realizado cambios');
      return;
    }

    setLoading(true);

    // Simulación de llamada al backend
    setTimeout(() => {
      console.log(`Editando ${itemType} ${itemId}: nuevo título = ${title}`);
      onSuccess(title);
      handleClose();
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setTitle(currentTitle);
    setError(null);
    onClose();
  };

  const hasChanges = title.trim() !== currentTitle;

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
      <DialogTitle sx={{ color: '#ffffff' }}>Editar metadatos</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#b3b3b3' }} gutterBottom>
            Tipo: {itemType === 'song' ? 'Canción' : 'Colección'}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          placeholder="Ingrese el título"
          helperText="El título debe tener al menos 1 carácter"
          sx={{ 
            mb: 2,
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

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} sx={{ color: '#b3b3b3' }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !hasChanges || !title.trim()}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
