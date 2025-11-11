import type { StateChangeEvent, CatalogState } from '../types/catalogStates';
import { catalogService } from './catalogService';

/**
 * Mock de eventos de auditoría para el sistema de estados
 */
export const mockStateChangeEvents: Record<string, StateChangeEvent[]> = {
  '1': [
    {
      id: 'ev-1',
      itemId: '1',
      itemType: 'song',
      timestamp: '2024-09-01T12:00:00Z',
      user: 'admin@melodia.com',
      previousState: 'blocked',
      newState: 'published',
    },
    {
      id: 'ev-2',
      itemId: '1',
      itemType: 'song',
      timestamp: '2024-08-15T10:30:00Z',
      user: 'moderator@melodia.com',
      previousState: 'published',
      newState: 'blocked',
      reason: 'Revisión de contenido',
    },
  ],
  '5': [
    {
      id: 'ev-3',
      itemId: '5',
      itemType: 'song',
      timestamp: '2024-11-01T14:00:00Z',
      user: 'artist@melodia.com',
      previousState: 'published',
      newState: 'scheduled',
      scheduledDate: '2025-12-01T00:00:00Z',
    },
  ],
  '7': [
    {
      id: 'ev-4',
      itemId: '7',
      itemType: 'song',
      timestamp: '2024-11-05T10:30:00Z',
      user: 'admin@melodia.com',
      previousState: 'published',
      newState: 'blocked',
      reason: 'Solicitud de derechos de autor pendiente',
    },
    {
      id: 'ev-5',
      itemId: '7',
      itemType: 'song',
      timestamp: '2024-10-15T14:20:00Z',
      user: 'moderator@melodia.com',
      previousState: 'blocked',
      newState: 'published',
    },
    {
      id: 'ev-6',
      itemId: '7',
      itemType: 'song',
      timestamp: '2024-10-10T09:15:00Z',
      user: 'admin@melodia.com',
      previousState: 'published',
      newState: 'blocked',
      reason: 'Contenido reportado',
    },
  ],
};

/**
 * Obtiene los eventos de auditoría de un ítem
 */
export function getStateChangeEvents(itemId: string): StateChangeEvent[] {
  return mockStateChangeEvents[itemId] || [];
}

/**
 * Agrega un nuevo evento de auditoría (mock)
 */
export function addStateChangeEvent(event: Omit<StateChangeEvent, 'id' | 'timestamp'>): StateChangeEvent {
  const newEvent: StateChangeEvent = {
    ...event,
    id: `ev-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  if (!mockStateChangeEvents[event.itemId]) {
    mockStateChangeEvents[event.itemId] = [];
  }

  mockStateChangeEvents[event.itemId].unshift(newEvent);

  return newEvent;
}

/**
 * Servicio para cambiar el estado de un ítem del catálogo
 */
export interface ChangeStateParams {
  itemId: string;
  itemType: 'song' | 'collection';
  currentState: CatalogState;
  newState: CatalogState;
  user: string;
  reason?: string;
  scheduledDate?: string;
}

export interface ChangeStateResult {
  success: boolean;
  error?: string;
  event?: StateChangeEvent;
}

/**
 * Cambia el estado de un ítem (usando el backend real)
 */
export async function changeItemState(
  params: ChangeStateParams
): Promise<ChangeStateResult> {
  try {
    // Llamar al backend para cambiar el estado
    await catalogService.updateItemStatus(
      params.itemId,
      params.itemType,
      params.newState
    );

    // Agregar evento de auditoría local
    const event = addStateChangeEvent({
      itemId: params.itemId,
      itemType: params.itemType,
      user: params.user,
      previousState: params.currentState,
      newState: params.newState,
      reason: params.reason,
      scheduledDate: params.scheduledDate,
    });

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    return {
      success: false,
      error: 'Error al cambiar el estado en el servidor',
    };
  }
}
