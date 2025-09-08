import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material'
import { Refresh } from '@mui/icons-material'
import { useUsers, useMusicStats } from '../hooks'

export const DataDemo: React.FC = () => {
  // Example usage of React Query hooks
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({ page: 1, limit: 5 })

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMusicStats()

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        React Query Demo
      </Typography>

      <Stack spacing={3}>
        {/* Users Demo */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Users</Typography>
              <Button
                startIcon={<Refresh />}
                onClick={() => refetchUsers()}
                disabled={usersLoading}
                size="small"
              >
                Refresh
              </Button>
            </Box>

            {usersLoading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            )}

            {usersError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load users: {usersError.message}
              </Alert>
            )}

            {usersData && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Users: {usersData.total} | Page: {usersData.page}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  This data comes from the API using React Query hooks. In a real app, this would show actual users.
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Array.from({ length: Math.min(5, usersData.total || 0) }, (_, i) => (
                    <Chip
                      key={i}
                      label={`User ${i + 1}`}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {!usersLoading && !usersError && !usersData && (
              <Typography variant="body2" color="text.secondary">
                No data available (API not connected)
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Music Stats Demo */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Music Statistics</Typography>
              <Button
                startIcon={<Refresh />}
                onClick={() => refetchStats()}
                disabled={statsLoading}
                size="small"
              >
                Refresh
              </Button>
            </Box>

            {statsLoading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            )}

            {statsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load stats: {statsError.message}
              </Alert>
            )}

            {statsData && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  This shows how React Query manages complex data fetching with automatic caching and background updates.
                </Typography>
                
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Total Songs: {statsData.totalSongs}
                  </Typography>
                  <Typography variant="body2">
                    Total Artists: {statsData.totalArtists}
                  </Typography>
                  <Typography variant="body2">
                    Total Plays: {statsData.totalPlays}
                  </Typography>
                </Stack>
              </Box>
            )}

            {!statsLoading && !statsError && !statsData && (
              <Typography variant="body2" color="text.secondary">
                No data available (API not connected)
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card sx={{ bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How it works
            </Typography>
            <Typography variant="body2" paragraph>
              The hooks above demonstrate React Query in action:
            </Typography>
            <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
              <li>Automatic loading states</li>
              <li>Error handling</li>
              <li>Data caching (try refreshing the page)</li>
              <li>Background refetching</li>
              <li>Optimistic updates</li>
              <li>Request deduplication</li>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Open the React Query DevTools (bottom left) to see queries in action!
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
