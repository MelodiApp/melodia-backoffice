import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { queryKeys } from './queryClient'
import type { UsersResponse, UserDetailResponse } from '../services/userService'

// Hook para listar usuarios del sistema (CA 1 & CA 2)
export const useUsers = (params?: {
  search?: string
}) => {
  return useQuery({
    queryKey: queryKeys.users.list(params || {}),
    queryFn: () => userService.getUsers(params),
  })
}

// Hook para obtener perfil detallado de un usuario (CA 1 & CA 2 - Visualizar perfil)
export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id, // Solo ejecutar si hay un ID
  })
}

// Hook para bloquear/desbloquear usuario (CA 1, CA 2, CA 3 & CA 4 - Bloquear usuario)
export const useToggleUserBlock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userService.toggleUserBlock(id),
    onSuccess: (data) => {
      // Actualizar la lista de usuarios
      queryClient.setQueryData<UsersResponse>(queryKeys.users.list({}), (oldData) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          users: oldData.users.map(user => 
            user.id === data.user.id ? data.user : user
          ),
        }
      })

      // Actualizar el detalle del usuario si está en caché
      queryClient.setQueryData<UserDetailResponse>(
        queryKeys.users.detail(data.user.id), 
        { user: data.user }
      )
      
      // Invalidar consultas relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: (error) => {
      console.error('Error al cambiar estado de bloqueo del usuario:', error)
    },
  })
}
