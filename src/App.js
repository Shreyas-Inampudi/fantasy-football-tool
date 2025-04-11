// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Paper,
  useScrollTrigger,
  Slide,
  IconButton,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  BarChart as StatsIcon,
  SportsFootball as FootballIcon,
  CompareArrows as CompareIcon
} from '@mui/icons-material';
import PlayerSearch from './components/PlayerSearch';
import PlayerStats from './components/PlayerStats';
import PlayerComparison from './components/PlayerComparison';
import './App.css';

// Create a modern theme with a sleek color scheme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f172a', // Dark blue-gray
      paper: '#1e293b',   // Slightly lighter blue-gray
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Main content component wrapped in Router context
function AppContent() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const menuItems = [
    { text: 'Player Search', icon: <SearchIcon />, path: '/player-search' },
    { text: 'Player Stats', icon: <StatsIcon />, path: '/player-stats' },
    { text: 'Player Comparison', icon: <CompareIcon />, path: '/compare' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <HideOnScroll>
        <AppBar position="fixed" elevation={0} sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}>
          <Toolbar>
            <FootballIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Fantasy Football Tool
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  color="inherit"
                  variant={location.pathname === item.path ? "contained" : "text"}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: location.pathname === item.path ? 'primary.dark' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Routes>
              <Route path="/player-search" element={<PlayerSearch />} />
              <Route path="/player-stats" element={<PlayerStats />} />
              <Route path="/compare" element={<PlayerComparison />} />
              <Route path="/" element={<PlayerSearch />} />
            </Routes>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
