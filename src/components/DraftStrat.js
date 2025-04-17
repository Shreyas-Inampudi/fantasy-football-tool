import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Psychology as AIIcon,
  SportsFootball as FootballIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material';

const DraftStrat = () => {
  const [draftPosition, setDraftPosition] = useState('');
  const [leagueSize, setLeagueSize] = useState(12);
  const [scoringType, setScoringType] = useState('PPR');
  const [mockDraftResults, setMockDraftResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);

  // Mock data for demonstration - organized by rounds
  const mockDraftData = {
    rounds: [
      {
        round: 1,
        picks: [
          { pick: 1, name: 'Christian McCaffrey', position: 'RB', adp: 1, tier: 1, team: 'Team 1' },
          { pick: 2, name: 'Justin Jefferson', position: 'WR', adp: 2, tier: 1, team: 'Team 2' },
          { pick: 3, name: 'JaMarr Chase', position: 'WR', adp: 3, tier: 1, team: 'Team 3' },
          { pick: 4, name: 'Austin Ekeler', position: 'RB', adp: 4, tier: 1, team: 'Team 4' },
          { pick: 5, name: 'Travis Kelce', position: 'TE', adp: 5, tier: 1, team: 'Team 5' },
          { pick: 6, name: 'Saquon Barkley', position: 'RB', adp: 6, tier: 1, team: 'Team 6' },
          { pick: 7, name: 'Jonathan Taylor', position: 'RB', adp: 7, tier: 1, team: 'Team 7' },
          { pick: 8, name: 'Davante Adams', position: 'WR', adp: 8, tier: 1, team: 'Team 8' },
          { pick: 9, name: 'Bijan Robinson', position: 'RB', adp: 9, tier: 1, team: 'Team 9' },
          { pick: 10, name: 'Stefon Diggs', position: 'WR', adp: 10, tier: 1, team: 'Team 10' },
          { pick: 11, name: 'Derrick Henry', position: 'RB', adp: 11, tier: 1, team: 'Team 11' },
          { pick: 12, name: 'Tyreek Hill', position: 'WR', adp: 12, tier: 1, team: 'Team 12' },
        ]
      },
      {
        round: 2,
        picks: [
          { pick: 13, name: 'A.J. Brown', position: 'WR', adp: 13, tier: 2, team: 'Team 12' },
          { pick: 14, name: 'Nick Chubb', position: 'RB', adp: 14, tier: 2, team: 'Team 11' },
          { pick: 15, name: 'Garrett Wilson', position: 'WR', adp: 15, tier: 2, team: 'Team 10' },
          { pick: 16, name: 'Josh Jacobs', position: 'RB', adp: 16, tier: 2, team: 'Team 9' },
          { pick: 17, name: 'Jaylen Waddle', position: 'WR', adp: 17, tier: 2, team: 'Team 8' },
          { pick: 18, name: 'Patrick Mahomes', position: 'QB', adp: 18, tier: 2, team: 'Team 7' },
          { pick: 19, name: 'Mark Andrews', position: 'TE', adp: 19, tier: 2, team: 'Team 6' },
          { pick: 20, name: 'Rhamondre Stevenson', position: 'RB', adp: 20, tier: 2, team: 'Team 5' },
          { pick: 21, name: 'Chris Olave', position: 'WR', adp: 21, tier: 2, team: 'Team 4' },
          { pick: 22, name: 'Joe Mixon', position: 'RB', adp: 22, tier: 2, team: 'Team 3' },
          { pick: 23, name: 'DeVonta Smith', position: 'WR', adp: 23, tier: 2, team: 'Team 2' },
          { pick: 24, name: 'Aaron Jones', position: 'RB', adp: 24, tier: 2, team: 'Team 1' },
        ]
      },
      {
        round: 3,
        picks: [
          { pick: 25, name: 'Jalen Hurts', position: 'QB', adp: 25, tier: 3, team: 'Team 1' },
          { pick: 26, name: 'DK Metcalf', position: 'WR', adp: 26, tier: 3, team: 'Team 2' },
          { pick: 27, name: 'George Kittle', position: 'TE', adp: 27, tier: 3, team: 'Team 3' },
          { pick: 28, name: 'James Conner', position: 'RB', adp: 28, tier: 3, team: 'Team 4' },
          { pick: 29, name: 'Tee Higgins', position: 'WR', adp: 29, tier: 3, team: 'Team 5' },
          { pick: 30, name: 'David Montgomery', position: 'RB', adp: 30, tier: 3, team: 'Team 6' },
          { pick: 31, name: 'Josh Allen', position: 'QB', adp: 31, tier: 3, team: 'Team 7' },
          { pick: 32, name: 'Michael Pittman Jr.', position: 'WR', adp: 32, tier: 3, team: 'Team 8' },
          { pick: 33, name: 'Dameon Pierce', position: 'RB', adp: 33, tier: 3, team: 'Team 9' },
          { pick: 34, name: 'Drake London', position: 'WR', adp: 34, tier: 3, team: 'Team 10' },
          { pick: 35, name: 'Kyle Pitts', position: 'TE', adp: 35, tier: 3, team: 'Team 11' },
          { pick: 36, name: 'J.K. Dobbins', position: 'RB', adp: 36, tier: 3, team: 'Team 12' },
        ]
      }
    ]
  };

  const handleGenerateRecommendations = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setAiRecommendations({
        strategy: "Based on your draft position and league settings, we recommend:",
        recommendations: [
          "Focus on RB-WR in the first two rounds",
          "Target high-upside WRs in rounds 3-4",
          "Consider reaching for a top TE in round 5",
          "Look for value RBs in the middle rounds",
        ],
        risks: [
          "RB depth is shallow this year",
          "Top WRs have tough matchups in playoffs",
        ],
        sleepers: [
          { name: "Player A", position: "RB", reason: "Increased role in passing game" },
          { name: "Player B", position: "WR", reason: "New offensive scheme" },
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleStartMockDraft = () => {
    setMockDraftResults(mockDraftData);
    setCurrentRound(1);
  };

  const handleRoundChange = (event, value) => {
    setCurrentRound(value);
  };

  const getCurrentRoundData = () => {
    return mockDraftResults.rounds?.find(round => round.round === currentRound)?.picks || [];
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AIIcon color="primary" />
        AI Draft Strategy
      </Typography>

      <Grid container spacing={3}>
        {/* Settings Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Draft Settings
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Draft Position</InputLabel>
              <Select
                value={draftPosition}
                label="Draft Position"
                onChange={(e) => setDraftPosition(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>League Size</InputLabel>
              <Select
                value={leagueSize}
                label="League Size"
                onChange={(e) => setLeagueSize(e.target.value)}
              >
                {[8, 10, 12, 14, 16].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} Teams
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Scoring Type</InputLabel>
              <Select
                value={scoringType}
                label="Scoring Type"
                onChange={(e) => setScoringType(e.target.value)}
              >
                <MenuItem value="PPR">PPR</MenuItem>
                <MenuItem value="Half-PPR">Half-PPR</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerateRecommendations}
              disabled={isLoading || !draftPosition}
              startIcon={isLoading ? <CircularProgress size={20} /> : <AIIcon />}
            >
              Generate AI Recommendations
            </Button>
          </Paper>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleStartMockDraft}
            startIcon={<FootballIcon />}
          >
            Start Mock Draft
          </Button>
        </Grid>

        {/* Recommendations Panel */}
        <Grid item xs={12} md={8}>
          {aiRecommendations && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <Typography variant="body1" paragraph>
                {aiRecommendations.strategy}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Key Recommendations:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {aiRecommendations.recommendations.map((rec, index) => (
                  <Chip
                    key={index}
                    label={rec}
                    color="primary"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Potential Risks:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {aiRecommendations.risks.map((risk, index) => (
                  <Chip
                    key={index}
                    label={risk}
                    color="warning"
                    icon={<WarningIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Sleepers to Watch:
              </Typography>
              <Grid container spacing={2}>
                {aiRecommendations.sleepers.map((sleeper, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">
                          {sleeper.name} ({sleeper.position})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sleeper.reason}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Mock Draft Results */}
          {mockDraftResults.rounds && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Mock Draft - Round {currentRound}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    size="small"
                    startIcon={<PrevIcon />}
                    onClick={() => setCurrentRound(prev => Math.max(1, prev - 1))}
                    disabled={currentRound === 1}
                  >
                    Previous Round
                  </Button>
                  <Pagination
                    count={mockDraftResults.rounds.length}
                    page={currentRound}
                    onChange={handleRoundChange}
                    color="primary"
                  />
                  <Button
                    size="small"
                    endIcon={<NextIcon />}
                    onClick={() => setCurrentRound(prev => Math.min(mockDraftResults.rounds.length, prev + 1))}
                    disabled={currentRound === mockDraftResults.rounds.length}
                  >
                    Next Round
                  </Button>
                </Stack>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pick</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>ADP</TableCell>
                      <TableCell>Tier</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentRoundData().map((pick) => (
                      <TableRow 
                        key={pick.pick}
                        sx={{
                          backgroundColor: pick.team === `Team ${draftPosition}` ? 'rgba(99, 102, 241, 0.1)' : 'inherit'
                        }}
                      >
                        <TableCell>{pick.pick}</TableCell>
                        <TableCell>{pick.team}</TableCell>
                        <TableCell>{pick.name}</TableCell>
                        <TableCell>{pick.position}</TableCell>
                        <TableCell>{pick.adp}</TableCell>
                        <TableCell>
                          <Chip
                            label={`Tier ${pick.tier}`}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DraftStrat; 