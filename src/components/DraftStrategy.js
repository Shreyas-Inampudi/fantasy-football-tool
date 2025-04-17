import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha
} from '@mui/material';
import {
  Psychology as TimelineIcon,
  Grade as GradeIcon,
  CheckCircle as CheckCircleIcon,
  SportsFootball as FootballIcon
} from '@mui/icons-material';

function DraftStrategy() {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draftPosition, setDraftPosition] = useState(1);
  const [leagueSize, setLeagueSize] = useState(12);
  const [scoringFormat, setScoringFormat] = useState('PPR');
  const [recommendations, setRecommendations] = useState(null);

  // Mock data for demonstration
  const generateRecommendations = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecommendations = {
        earlyRounds: {
          strategy: "Best Player Available (BPA)",
          targets: [
            "Focus on elite RBs and WRs in the first two rounds",
            "Consider top-tier TEs (Kelce, Kittle) if available late in first round",
            "Target high-volume passing game players"
          ],
          players: [
            { name: "Christian McCaffrey", position: "RB", recommendation: "Elite dual-threat RB" },
            { name: "Justin Jefferson", position: "WR", recommendation: "High-volume WR1" },
            { name: "Travis Kelce", position: "TE", recommendation: "Massive positional advantage" }
          ]
        },
        middleRounds: {
          strategy: "Value-Based Drafting",
          targets: [
            "Look for upside QB options in rounds 5-7",
            "Target rookie RBs with potential starting roles",
            "Focus on WRs in productive offenses"
          ],
          players: [
            { name: "Justin Fields", position: "QB", recommendation: "High rushing upside" },
            { name: "Javonte Williams", position: "RB", recommendation: "Potential breakout" },
            { name: "Drake London", position: "WR", recommendation: "Target monster" }
          ]
        },
        lateRounds: {
          strategy: "High-Upside Fliers",
          targets: [
            "Draft high-upside backup RBs",
            "Target rookie WRs in good situations",
            "Consider second-year players with breakout potential"
          ],
          players: [
            { name: "Tyler Allgeier", position: "RB", recommendation: "Handcuff with upside" },
            { name: "Rashee Rice", position: "WR", recommendation: "Rookie in high-powered offense" },
            { name: "Jayden Reed", position: "WR", recommendation: "Emerging talent" }
          ]
        }
      };
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1500);
  };

  // Generate recommendations when inputs change
  useEffect(() => {
    if (draftPosition && leagueSize && scoringFormat) {
      generateRecommendations();
    }
  }, [draftPosition, leagueSize, scoringFormat]);

  const renderStrategySection = (title, data, color) => (
    <Card sx={{ 
      mb: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          color: color,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <GradeIcon sx={{ color: color }} />
          {title}
        </Typography>
        <Divider sx={{ my: 2, borderColor: alpha(color, 0.3) }} />
        
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
          Strategy: {data.strategy}
        </Typography>
        
        <Typography variant="subtitle2" sx={{ mb: 1, color: color }}>
          Key Targets:
        </Typography>
        <List dense>
          {data.targets.map((target, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: alpha(color, 0.8) }} />
              </ListItemIcon>
              <ListItemText 
                primary={target}
                sx={{ color: 'white' }}
              />
            </ListItem>
          ))}
        </List>
        
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: color }}>
          Recommended Players:
        </Typography>
        <Grid container spacing={1}>
          {data.players.map((player, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper sx={{ 
                p: 1,
                backgroundColor: alpha(color, 0.1),
                border: `1px solid ${alpha(color, 0.3)}`,
                borderRadius: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FootballIcon sx={{ color: color }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {player.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha(color, 0.8) }}>
                      {player.position} - {player.recommendation}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

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
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TimelineIcon fontSize="large" sx={{ color: '#6366f1' }} />
            AI Draft Strategy Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Get personalized draft recommendations based on your draft position and league settings
          </Typography>
          <Divider sx={{ 
            mb: 4,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            height: '1px'
          }} />
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Draft Position</InputLabel>
              <Select
                value={draftPosition}
                label="Draft Position"
                onChange={(e) => setDraftPosition(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>League Size</InputLabel>
              <Select
                value={leagueSize}
                label="League Size"
                onChange={(e) => setLeagueSize(e.target.value)}
              >
                {[8, 10, 12, 14, 16].map((size) => (
                  <MenuItem key={size} value={size}>{size} Teams</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Scoring Format</InputLabel>
              <Select
                value={scoringFormat}
                label="Scoring Format"
                onChange={(e) => setScoringFormat(e.target.value)}
              >
                <MenuItem value="PPR">PPR</MenuItem>
                <MenuItem value="HALF_PPR">Half PPR</MenuItem>
                <MenuItem value="STANDARD">Standard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : recommendations ? (
          <>
            {renderStrategySection('Early Rounds (1-4)', recommendations.earlyRounds, '#6366f1')}
            {renderStrategySection('Middle Rounds (5-9)', recommendations.middleRounds, '#ec4899')}
            {renderStrategySection('Late Rounds (10+)', recommendations.lateRounds, '#14b8a6')}
          </>
        ) : null}
      </div>
    </Fade>
  );
}

export default DraftStrategy; 