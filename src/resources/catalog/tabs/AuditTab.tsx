import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { Schedule, CheckCircle, Block } from '@mui/icons-material';
import { getStateChangeEvents, fetchStateChangeEvents } from '../../../services/catalogStateService';
import { useEffect, useState } from 'react';
import type { StateChangeEvent } from '../../../types/catalogStates';
import { STATE_LABELS } from '../../../types/catalogStates';

interface AuditTabProps {
  itemId: string;
}

export function AuditTab({ itemId }: AuditTabProps) {
  const [auditEvents, setAuditEvents] = useState<StateChangeEvent[]>(() => getStateChangeEvents(itemId));

  useEffect(() => {
    let mounted = true;
    fetchStateChangeEvents(itemId)
      .then((events) => {
        if (mounted) setAuditEvents(events);
      })
      .catch((err) => {
        console.warn('Failed to fetch audits for item', itemId, err);
      });
    return () => { mounted = false; };
  }, [itemId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (newState: string) => {
    const lower = (newState || '').toLowerCase();
    switch (lower) {
      case 'scheduled':
        return <Schedule />;
      case 'published':
        return <CheckCircle />;
      case 'blocked':
        return <Block />;
      default:
        return <CheckCircle />;
    }
  };

  const getEventColor = (newState: string): 'info' | 'success' | 'error' => {
    const lower = (newState || '').toLowerCase();
    switch (lower) {
      case 'scheduled':
        return 'info';
      case 'published':
        return 'success';
      case 'blocked':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStateLabel = (s?: string) => {
    if (!s) return 'Unknown';
    const key = (String(s) || '').toLowerCase();
    // Normalize: backend may provide "programmed"; map to scheduled
    const normalized = key === 'programmed' ? 'scheduled' : key;
    const label = STATE_LABELS[normalized as keyof typeof STATE_LABELS] || normalized;
    // Return Spanish label with Title Case (uppercase first letter)
    return String(label);
  };

  return (
    <Card sx={{ backgroundColor: '#181818' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
          Auditoría de cambios de estado
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: '#b3b3b3' }}>
          Historial completo de transiciones de estado con usuario, fecha y razón
        </Typography>

        {auditEvents.length === 0 ? (
          <Alert severity="info">
            No hay eventos de auditoría registrados para este ítem
          </Alert>
        ) : (
          <List>
            {auditEvents.map((event, index) => {
              const icon = getEventIcon(event.newState);
              const color = getEventColor(event.newState);

              return (
                <Box key={event.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: '#121212',
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: '#404040',
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${color}.light`,
                          color: `${color}.main`,
                        }}
                      >
                        {icon}
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" fontWeight="medium" sx={{ color: '#ffffff' }}>
                            {getStateLabel(event.previousState)} → {getStateLabel(event.newState)}
                          </Typography>
                          <Chip
                            label={formatDateTime(event.timestamp)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Usuario: <strong>{event.user}</strong>
                          </Typography>
                          {event.reason && (
                            <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 0.5 }}>
                              Razón: {event.reason}
                            </Typography>
                          )}
                          {event.scheduledDate && (
                            <Typography variant="body2" sx={{ color: '#b3b3b3', mt: 0.5 }}>
                              Fecha programada: {formatDateTime(event.scheduledDate)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < auditEvents.length - 1 && <Divider sx={{ my: 1, borderColor: '#404040' }} />}
                </Box>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
