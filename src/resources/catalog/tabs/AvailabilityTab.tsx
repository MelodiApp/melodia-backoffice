import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { CheckCircle, Schedule, Block } from '@mui/icons-material';
import { catalogService } from '../../../services/catalogService';
import type { CatalogDetail } from '../../../types/catalogDetail';

interface AvailabilityTabProps {
  itemId: string;
  itemType: 'song' | 'collection';
}

interface AvailabilityData {
  status: string;
  scheduledDate?: string;
  blockedReason?: string;
  regions?: any[];
}

export function AvailabilityTab({ itemId, itemType }: AvailabilityTabProps) {
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus: string): string => {
    const statusMap: Record<string, string> = {
      'PUBLISHED': 'published',
      'BLOCKED': 'blocked',
      'PROGRAMMED': 'scheduled',
    };
    return statusMap[backendStatus] || 'published';
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        console.log('🔍 [AvailabilityTab] Fetching availability for:', { itemId, itemType });
        setLoading(true);
        const data = itemType === 'song'
          ? await catalogService.getSongStatus(itemId)
          : await catalogService.getCollectionStatus(itemId);
        console.log('✅ [AvailabilityTab] Received data:', data);
        setAvailability(data);
      } catch (err) {
        console.error('❌ [AvailabilityTab] Error fetching availability:', err);
        setError('Error al cargar la información de disponibilidad');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [itemId, itemType]);

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

  if (loading) {
    console.log('⏳ [AvailabilityTab] Loading state');
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando información de disponibilidad...</Typography>
      </Box>
    );
  }

  if (error || !availability) {
    console.log('❌ [AvailabilityTab] Error or no availability:', { error, availability });
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'No se pudo cargar la información de disponibilidad'}
        </Alert>
      </Box>
    );
  }

  console.log('🎯 [AvailabilityTab] Rendering with availability:', availability);
  const normalizedStatus = mapBackendStatus(availability.status);
  console.log('🔄 [AvailabilityTab] Normalized status:', normalizedStatus);
  const statusConfig = getStatusConfig(normalizedStatus);

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

          {normalizedStatus === 'scheduled' && availability.scheduledDate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Programado para: <strong>{formatDateTime(availability.scheduledDate)}</strong>
              </Typography>
            </Alert>
          )}

          {normalizedStatus === 'blocked' && availability.blockedReason && (
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
