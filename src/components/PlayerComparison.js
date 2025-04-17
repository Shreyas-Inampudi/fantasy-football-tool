import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Divider,
  alpha
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  TrendingUp as BetterIcon
} from '@mui/icons-material';

const positions = ['QB', 'RB', 'WR', 'TE'];

const statCategories = {
  QB: [
    { key: 'pass_yd', label: 'Passing Yards', unit: 'yards' },
    { key: 'pass_td', label: 'Passing TDs', unit: 'TDs' },
    { key: 'pass_int', label: 'Interceptions', unit: 'INTs', lowerIsBetter: true },
    { key: 'rush_yd', label: 'Rushing Yards', unit: 'yards' },
    { key: 'rush_td', label: 'Rushing TDs', unit: 'TDs' }
  ],
  RB: [
    { key: 'rush_yd', label: 'Rushing Yards', unit: 'yards' },
    { key: 'rush_td', label: 'Rushing TDs', unit: 'TDs' },
    { key: 'rec', label: 'Receptions', unit: 'catches' },
    { key: 'rec_yd', label: 'Receiving Yards', unit: 'yards' },
    { key: 'rec_td', label: 'Receiving TDs', unit: 'TDs' }
  ],
  WR: [
    { key: 'rec', label: 'Receptions', unit: 'catches' },
    { key: 'rec_yd', label: 'Receiving Yards', unit: 'yards' },
    { key: 'rec_td', label: 'Receiving TDs', unit: 'TDs' },
    { key: 'targets', label: 'Targets', unit: 'targets' }
  ],
  TE: [
    { key: 'rec', label: 'Receptions', unit: 'catches' },
    { key: 'rec_yd', label: 'Receiving Yards', unit: 'yards' },
    { key: 'rec_td', label: 'Receiving TDs', unit: 'TDs' },
    { key: 'targets', label: 'Targets', unit: 'targets' }
  ]
};

function PlayerComparison() {
  const [position, setPosition] = useState('QB');
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([null, null]);

  // Fetch players when position changes
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.sleeper.app/v1/players/nfl');
        if (!response.ok) throw new Error('Failed to fetch players');
        const data = await response.json();
        
        // Filter active players by position
        const activePlayers = Object.values(data).filter(player => 
          player.active && 
          player.position === position &&
          player.team !== null
        );
        
        setPlayers(activePlayers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [position]);

  // Fetch stats for selected players
  useEffect(() => {
    const fetchPlayerStats = async (player, index) => {
      if (!player) {
        setStats(prev => {
          const newStats = [...prev];
          newStats[index] = null;
          return newStats;
        });
        return;
      }

      try {
        // In a real implementation, you would fetch actual stats here
        // For now, we'll use mock data
        const mockStats = generateMockStats(player.position);
        setStats(prev => {
          const newStats = [...prev];
          newStats[index] = mockStats;
          return newStats;
        });
      } catch (err) {
        setError(`Failed to fetch stats for ${player.full_name}`);
      }
    };

    selectedPlayers.forEach((player, index) => {
      fetchPlayerStats(player, index);
    });
  }, [selectedPlayers]);

  // Generate mock stats for demo purposes
  const generateMockStats = (position) => {
    const stats = {};
    statCategories[position].forEach(cat => {
      stats[cat.key] = Math.floor(Math.random() * 1000);
    });
    return stats;
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
    setSelectedPlayers([null, null]);
    setStats([null, null]);
  };

  const handlePlayerSelect = (newValue, index) => {
    setSelectedPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = newValue;
      return newPlayers;
    });
  };

  const renderPlayerSelection = (index) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Autocomplete
          value={selectedPlayers[index]}
          onChange={(event, newValue) => handlePlayerSelect(newValue, index)}
          options={players}
          getOptionLabel={(option) => option.full_name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Select Player ${index + 1}`}
              variant="outlined"
              error={Boolean(error)}
              helperText={error}
            />
          )}
          loading={loading}
        />
      </CardContent>
    </Card>
  );

  const renderComparison = () => {
    if (!selectedPlayers[0] || !selectedPlayers[1] || !stats[0] || !stats[1]) {
      return null;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Statistic</TableCell>
              <TableCell align="right">{selectedPlayers[0].full_name}</TableCell>
              <TableCell align="right">Difference</TableCell>
              <TableCell align="right">{selectedPlayers[1].full_name}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statCategories[position].map((category) => {
              const val1 = stats[0][category.key];
              const val2 = stats[1][category.key];
              const diff = val1 - val2;
              const better = category.lowerIsBetter ? diff < 0 : diff > 0;

              return (
                <TableRow key={category.key}>
                  <TableCell>{category.label}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {better && <BetterIcon color="success" sx={{ mr: 1 }} />}
                      {val1}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {Math.abs(diff)} {category.unit}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {!better && diff !== 0 && <BetterIcon color="success" sx={{ mr: 1 }} />}
                      {val2}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Fade in={true}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Player Comparison
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Position</InputLabel>
          <Select
            value={position}
            onChange={handlePositionChange}
            label="Position"
          >
            {positions.map(pos => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderPlayerSelection(0)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderPlayerSelection(1)}
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          {renderComparison()}
        </Box>
      </Box>
    </Fade>
  );
}

export default PlayerComparison; 