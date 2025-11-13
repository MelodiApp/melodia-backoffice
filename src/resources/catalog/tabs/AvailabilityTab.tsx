import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { CheckCircle, Schedule, Block } from '@mui/icons-material';
import { getAvailability } from '../../../providers/catalogDetailMockData';

interface AvailabilityTabProps {
  itemId: string;
}

export function AvailabilityTab({ itemId }: AvailabilityTabProps) {
  const availability = getAvailability(itemId);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: any; icon: React.ReactElement; label: string }
    > = {
      blocked: {
        color: 'error',
        icon: <Block />,
        label: 'Bloqueado',
      },
      scheduled: {
        color: 'info',
        icon: <Schedule />,
        label: 'Programado',
      },
      published: {
        color: 'success',
        icon: <CheckCircle />,
        label: 'Publicado',
      },
    };

    return configs[status] || configs.published;
  };

  const statusConfig = getStatusConfig(availability.effectiveStatus);

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

  return (
    <Box>
      {/* Estado efectivo */}
      <Card sx={{ backgroundColor: '#181818' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
            Estado efectivo
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="medium"
            />
          </Box>

          {availability.effectiveStatus === 'scheduled' && availability.scheduledDate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Programado para: <strong>{formatDateTime(availability.scheduledDate)}</strong>
              </Typography>
            </Alert>
          )}

          {availability.effectiveStatus === 'blocked' && availability.blockedReason && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Razón del bloqueo:</strong> {availability.blockedReason}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
