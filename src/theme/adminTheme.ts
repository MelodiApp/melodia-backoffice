import { defaultDarkTheme } from "react-admin";
import { deepmerge } from "@mui/utils";

/**
 * Tema personalizado para React Admin con estilo Spotify
 *
 * Basado en el diseño de Spotify con paleta oscura y verde característico
 * Se combina con el tema oscuro por defecto de React Admin para mantener compatibilidad
 */
export const spotifyTheme = deepmerge(defaultDarkTheme, {
  palette: {
    mode: "dark",
    primary: {
      main: "#1db954", // Verde Spotify
      light: "#1ed760",
      dark: "#169c46",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#121212", // Fondo oscuro Spotify
      paper: "#181818", // Tarjetas/Paper
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#1db954",
    },
    divider: "#282828",
  },
  typography: {
    fontFamily: '"Circular", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    // Sidebar personalizado
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          borderLeft: "3px solid transparent",
          "&.RaMenuItemLink-active": {
            borderLeft: "3px solid #1db954",
            backgroundColor: "#282828",
            color: "#1db954",
          },
          "&:hover": {
            backgroundColor: "#282828",
            color: "#ffffff",
          },
        },
      },
    },
    // Botones
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#1db954",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#1ed760",
          },
        },
        outlined: {
          borderColor: "#1db954",
          color: "#1db954",
          "&:hover": {
            borderColor: "#1ed760",
            backgroundColor: "rgba(29, 185, 84, 0.08)",
          },
        },
      },
    },
    // AppBar
    RaAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#181818",
          color: "#ffffff",
        },
      },
    },
    // Layout
    RaLayout: {
      styleOverrides: {
        root: {
          "& .RaLayout-content": {
            backgroundColor: "#121212",
          },
        },
      },
    },
    // Sidebar/Menu
    RaSidebar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          borderRight: "1px solid #282828",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.5)",
          "& .MuiPaper-root": {
            backgroundColor: "#121212",
          },
        },
      },
    },
    RaMenu: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#121212",
          borderRight: "1px solid #282828",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    // Tablas
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#2a2a2a",
            color: "#ffffff",
            fontWeight: 600,
            borderBottom: "1px solid #404040",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#282828 !important",
          },
          "&.MuiTableRow-hover": {
            "&:hover": {
              backgroundColor: "#282828",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #282828",
        },
      },
    },
    // Chips
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#282828",
          color: "#ffffff",
        },
      },
    },
    // Paper/Cards
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    // Inputs
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#404040",
            },
            "&:hover fieldset": {
              borderColor: "#1db954",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1db954",
            },
          },
        },
      },
    },
    // Menu y Select dropdowns
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#282828",
          color: "#ffffff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#404040",
          },
          "&.Mui-selected": {
            backgroundColor: "#1db954",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#1ed760",
            },
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#282828",
        },
      },
    },
  },
});
