import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Paper, Breadcrumbs, Link } from '@mui/material';
import { useState } from 'react';
import { getCatalogDetail } from '../../providers/catalogDetailMockData';
import { SummaryTab } from './tabs/SummaryTab';
import { AvailabilityTab } from './tabs/AvailabilityTab';
import { AppearancesTab } from './tabs/AppearancesTab';
import { AuditTab } from './tabs/AuditTab';
import { NavigateNext } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catalog-tabpanel-${index}`}
      aria-labelledby={`catalog-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CatalogShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const catalogItem = id ? getCatalogDetail(id) : null;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    // En producción, aquí recargarías los datos del backend
  };

  if (!catalogItem) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Elemento no encontrado
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const isSong = catalogItem.type === 'song';

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          sx={{ color: '#1db954', cursor: 'pointer' }}
          onClick={() => navigate('/catalog')}
        >
          Catálogo
        </Link>
        <Typography sx={{ color: '#ffffff' }}>
          {catalogItem.title}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: '#b3b3b3' }}>
          {isSong ? 'Canción' : 'Colección'}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
          {catalogItem.title}
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2, backgroundColor: '#181818' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="catalog detail tabs"
          sx={{
            '& .MuiTab-root': {
              color: '#b3b3b3',
            },
            '& .Mui-selected': {
              color: '#1db954 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1db954',
            },
          }}
        >
          <Tab label="Resumen" id="catalog-tab-0" />
          <Tab label="Disponibilidad" id="catalog-tab-1" />
          <Tab label="Apariciones" id="catalog-tab-2" />
          {isSong && <Tab label="Auditoría" id="catalog-tab-3" />}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <SummaryTab item={catalogItem} onRefresh={handleRefresh} />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <AvailabilityTab itemId={catalogItem.id} />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <AppearancesTab item={catalogItem} />
      </TabPanel>

      {isSong && (
        <TabPanel value={currentTab} index={3}>
          <AuditTab itemId={catalogItem.id} key={refreshKey} />
        </TabPanel>
      )}
    </Box>
  );
}
