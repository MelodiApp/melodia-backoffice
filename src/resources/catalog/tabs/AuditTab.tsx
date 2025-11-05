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
import { Lock, LockOpen } from '@mui/icons-material';
import { getAuditEvents } from '../../../providers/catalogDetailMockData';

interface AuditTabProps {
  itemId: string;
}

export function AuditTab({ itemId }: AuditTabProps) {
  const auditEvents = getAuditEvents(itemId);

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

  const getEventConfig = (event: string) => {
    const configs: Record<string, { icon: React.ReactElement; color: any; label: string }> = {
      blocked: {
        icon: <Lock />,
        color: 'error',
        label: 'Bloqueado',
      },
      unblocked: {
        icon: <LockOpen />,
        color: 'success',
        label: 'Desbloqueado',
      },
    };

    return configs[event] || configs.blocked;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Auditoría
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Historial de cambios de estado de bloqueo (últimos eventos)
        </Typography>

        {auditEvents.length === 0 ? (
          <Alert severity="info">
            No hay eventos de auditoría registrados para esta canción
          </Alert>
        ) : (
          <List>
            {auditEvents.map((event, index) => {
              const config = getEventConfig(event.event);

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
                          bgcolor: `${config.color}.light`,
                          color: `${config.color}.main`,
                        }}
                      >
                        {config.icon}
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {config.label}
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
