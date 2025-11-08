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
import { getStateChangeEvents } from '../../../services/catalogStateService';
import { STATE_LABELS } from '../../../types/catalogStates';

interface AuditTabProps {
  itemId: string;
}

export function AuditTab({ itemId }: AuditTabProps) {
  const auditEvents = getStateChangeEvents(itemId);

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
    switch (newState) {
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
    switch (newState) {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Auditoría de cambios de estado
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
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
                          <Typography variant="body1" fontWeight="medium">
                            {STATE_LABELS[event.previousState]} → {STATE_LABELS[event.newState]}
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
                          <Typography variant="body2" color="text.secondary">
                            Usuario: <strong>{event.user}</strong>
                          </Typography>
                          {event.reason && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Razón: {event.reason}
                            </Typography>
                          )}
                          {event.scheduledDate && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Fecha programada: {formatDateTime(event.scheduledDate)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < auditEvents.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
