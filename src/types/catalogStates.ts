/**
 * Estados disponibles en el catálogo
 * - scheduled: Programado para publicación futura
 * - published: Publicado y disponible
 * - blocked: Bloqueado por administrador
 */
export type CatalogState = 'scheduled' | 'published' | 'blocked';

/**
 * Transiciones permitidas entre estados
 */
export interface StateTransition {
  from: CatalogState | null; // null = cualquier estado
  to: CatalogState;
  automatic?: boolean; // true si es automática (ej: scheduled -> published)
  requiresReason?: boolean; // true si requiere razón
  requiresScheduleDate?: boolean; // true si requiere fecha programada
}

/**
 * Evento de auditoría de cambio de estado
 */
export interface StateChangeEvent {
  id: string;
  itemId: string;
  itemType: 'song' | 'collection';
  timestamp: string;
  user: string;
  previousState: CatalogState;
  newState: CatalogState;
  reason?: string;
  scheduledDate?: string;
}

/**
 * Transiciones permitidas en el sistema
 */
export const ALLOWED_TRANSITIONS: StateTransition[] = [
  // Programado -> Publicado (automático al llegar la fecha)
  {
    from: 'scheduled',
    to: 'published',
    automatic: true,
  },
  // Publicado -> Bloqueado
  {
    from: 'published',
    to: 'blocked',
    requiresReason: true,
  },
  // Bloqueado -> Publicado
  {
    from: 'blocked',
    to: 'published',
  },
  // Programado -> Bloqueado
  {
    from: 'scheduled',
    to: 'blocked',
    requiresReason: true,
  },
  // Bloqueado -> Programado
  {
    from: 'blocked',
    to: 'scheduled',
    requiresScheduleDate: true,
  },
  // Publicación directa (sin estado previo o desde cualquier estado)
  {
    from: null,
    to: 'published',
  },
  // Programar desde cualquier estado
  {
    from: null,
    to: 'scheduled',
    requiresScheduleDate: true,
  },
];

/**
 * Prioridad de estados para calcular el estado efectivo
 * Mayor número = mayor prioridad
 */
export const STATE_PRIORITY: Record<CatalogState, number> = {
  blocked: 3,
  scheduled: 2,
  published: 1,
};

/**
 * Verifica si una transición es válida
 */
export function isTransitionAllowed(
  from: CatalogState,
  to: CatalogState
): boolean {
  // Disallow no-op transitions (same state)
  if (from === to) return false;

  return ALLOWED_TRANSITIONS.some(
    (t) => (t.from === null || t.from === from) && t.to === to
  );
}

/**
 * Obtiene el estado efectivo aplicando la prioridad
 * Bloqueado > Programado > Publicado
 */
export function getEffectiveState(state: CatalogState): CatalogState {
  return state; // En este caso simple, el estado es el estado efectivo
}

/**
 * Verifica si un estado programado debe cambiar a publicado automáticamente
 */
export function shouldAutoPublish(
  state: CatalogState,
  scheduledDate?: string
): boolean {
  if (state !== 'scheduled' || !scheduledDate) {
    return false;
  }

  const now = new Date();
  const scheduled = new Date(scheduledDate);
  return now >= scheduled;
}

/**
 * Obtiene la configuración de una transición
 */
export function getTransitionConfig(
  from: CatalogState,
  to: CatalogState
): StateTransition | undefined {
  return ALLOWED_TRANSITIONS.find(
    (t) => (t.from === null || t.from === from) && t.to === to
  );
}

/**
 * Valida los datos de una transición
 */
export interface TransitionValidation {
  valid: boolean;
  error?: string;
}

export function validateTransition(
  from: CatalogState,
  to: CatalogState,
  data: { reason?: string; scheduledDate?: string }
): TransitionValidation {
  const config = getTransitionConfig(from, to);

  if (!config) {
    return {
      valid: false,
      error: 'Transición no permitida',
    };
  }

  if (config.requiresReason && !data.reason) {
    return {
      valid: false,
      error: 'Se requiere una razón para esta transición',
    };
  }

  if (config.requiresScheduleDate && !data.scheduledDate) {
    return {
      valid: false,
      error: 'Se requiere una fecha de programación',
    };
  }

  if (data.scheduledDate) {
    const scheduledDate = new Date(data.scheduledDate);
    const now = new Date();

    if (scheduledDate <= now) {
      return {
        valid: false,
        error: 'La fecha de programación debe ser futura',
      };
    }
  }

  return { valid: true };
}

/**
 * Labels para mostrar en la UI
 */
export const STATE_LABELS: Record<CatalogState, string> = {
  scheduled: 'Programado',
  published: 'Publicado',
  blocked: 'Bloqueado',
};

/**
 * Colores para los estados en la UI
 */
export const STATE_COLORS: Record<CatalogState, 'info' | 'success' | 'error'> = {
  scheduled: 'info',
  published: 'success',
  blocked: 'error',
};
