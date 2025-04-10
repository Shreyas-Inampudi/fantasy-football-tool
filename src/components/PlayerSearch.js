// src/components/PlayerSearch.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Fade,
  Divider,
  Card,
  alpha,
  Skeleton,
  Alert,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import './PlayerRankings.css';

// Team color mapping for visual enhancement
const teamColors = {
  ARI: '#97233F', ATL: '#A71930', BAL: '#241773', BUF: '#00338D',
  CAR: '#0085CA', CHI: '#0B162A', CIN: '#FB4F14', CLE: '#311D00',
  DAL: '#002244', DEN: '#FB4F14', DET: '#0076B6', GB: '#203731',
  HOU: '#03202F', IND: '#002C5F', JAX: '#006778', KC: '#E31837',
  LAC: '#0080C6', LAR: '#003594', LV: '#000000', MIA: '#008E97',
  MIN: '#4F2683', NE: '#002244', NO: '#D3BC8D', NYG: '#0B2265',
  NYJ: '#125740', PHI: '#004C54', PIT: '#FFB612', SEA: '#002244',
  SF: '#AA0000', TB: '#D50A0A', TEN: '#0C2340', WAS: '#5A1414',
  FA: '#808080' // Free agent
};

// Custom background for the table based on position
const getPositionBackground = (position) => {
  const positionColors = {
    'QB': 'rgba(99, 102, 241, 0.03)',
    'RB': 'rgba(236, 72, 153, 0.03)',
    'WR': 'rgba(14, 165, 233, 0.03)',
    'TE': 'rgba(234, 179, 8, 0.03)',
    'K': 'rgba(34, 197, 94, 0.03)',
    'DEF': 'rgba(239, 68, 68, 0.03)'
  };
  return positionColors[position] || 'transparent';
};

function PlayerSearch() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'ascending' });
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    const apiUrl = 'https://api.sleeper.app/v1/players/nfl';
    setLoading(true);
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        const playersArray = Object.values(data);
        setPlayers(playersArray);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const distinctTeams = React.useMemo(() => {
    const teamsSet = new Set();
    players.forEach(player => {
      if (player.active && player.team && player.position !== "DEF") {
        teamsSet.add(player.team);
      }
    });
    return Array.from(teamsSet).sort();
  }, [players]);

  const distinctPositions = React.useMemo(() => {
    const positionsSet = new Set();
    players.forEach(player => {
      if (player.active && player.team && player.position !== "DEF") {
        positionsSet.add(player.position);
      }
    });
    return Array.from(positionsSet).sort();
  }, [players]);

  const filteredPlayers = players.filter(player =>
    player.active &&
    player.team &&
    (player.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
    player.position !== "DEF" &&
    (selectedTeam === "" || player.team === selectedTeam) &&
    (selectedPosition === "" || player.position === selectedPosition)
  );

  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...filteredPlayers];
    if (sortConfig.key !== null) {
      sortablePlayers.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'ascending' ? aVal - bVal : bVal - aVal;
        }
        const aStr = (aVal || '').toString().toLowerCase();
        const bStr = (bVal || '').toString().toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortablePlayers;
  }, [filteredPlayers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Renders the player card for the table
  const renderPlayerRow = (player, index) => {
    const teamColor = teamColors[player.team] || '#333';
    
    return (
      <TableRow 
        key={player.player_id} 
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s'
          },
          transition: 'all 0.2s',
          backgroundColor: getPositionBackground(player.position)
        }}
      >
        <TableCell sx={{ borderLeft: `3px solid ${teamColor}` }}>{index + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: teamColor,
                width: 36, 
                height: 36,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {player.position}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{player.full_name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {player.team} #{player.number || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Chip 
            label={player.position} 
            size="small"
            sx={{ 
              backgroundColor: alpha(teamColor, 0.2),
              borderColor: alpha(teamColor, 0.5),
              color: 'white',
              fontWeight: 'bold',
              border: '1px solid'
            }} 
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={player.team}
            size="small"
            sx={{ 
              backgroundColor: alpha(teamColor, 0.2),
              color: 'white',
              fontWeight: 'bold',
              border: '1px solid',
              borderColor: alpha(teamColor, 0.5)
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {player.number || '-'}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Fade in={true} timeout={800}>
      <div>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            NFL Player Explorer
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search and filter active NFL players from the Sleeper API database
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Card 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05))',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon fontSize="small" color="primary" />
              Filter Options
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-label">Search Players</InputLabel>
                  <OutlinedInput
                    label="Search Players"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    }
                    placeholder="Enter player name..."
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="team-select-label">Team</InputLabel>
                  <Select
                    labelId="team-select-label"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    label="Team"
                  >
                    <MenuItem value="">All Teams</MenuItem>
                    {distinctTeams.map(team => (
                      <MenuItem key={team} value={team} sx={{ 
                        borderLeft: `4px solid ${teamColors[team] || '#333'}`,
                        pl: 2
                      }}>
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="position-select-label">Position</InputLabel>
                  <Select
                    labelId="position-select-label"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    label="Position"
                  >
                    <MenuItem value="">All Positions</MenuItem>
                    {distinctPositions.map(position => (
                      <MenuItem key={position} value={position}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {filteredPlayers.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredPlayers.length} players found
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon fontSize="small" color="secondary" />
                  <Typography variant="body2" color="text.secondary">
                    Sorted by: {sortConfig.key} ({sortConfig.direction})
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={70} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading players: {error.message}
          </Alert>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'full_name'}
                      direction={sortConfig.key === 'full_name' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('full_name')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Player
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'position'}
                      direction={sortConfig.key === 'position' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('position')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Position
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'team'}
                      direction={sortConfig.key === 'team' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('team')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Team
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortConfig.key === 'number'}
                      direction={sortConfig.key === 'number' ? sortConfig.direction : 'asc'}
                      onClick={() => requestSort('number')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Jersey #
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No players found matching your criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPlayers.map((player, index) => renderPlayerRow(player, index))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Fade>
  );
}

export default PlayerSearch;
