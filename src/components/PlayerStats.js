// src/components/PlayerStats.js

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Card,
  Chip,
  Divider,
  Fade,
  Grid,
  Skeleton,
  alpha,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  FilterAlt as FilterIcon,
  BarChart as StatsIcon,
  CalendarMonth as YearIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import {
  addPlayerStats,
  getPlayerStats,
  updatePlayerStats,
  importPlayerStats,
  searchPlayers,
  getPlayersByTeam
} from '../services/database';

// Team color mapping for visual enhancement
const teamColors = {
  "Arizona Cardinals": '#97233F', 
  "Atlanta Falcons": '#A71930', 
  "Baltimore Ravens": '#241773', 
  "Buffalo Bills": '#00338D',
  "Carolina Panthers": '#0085CA', 
  "Chicago Bears": '#0B162A', 
  "Cincinnati Bengals": '#FB4F14', 
  "Cleveland Browns": '#311D00',
  "Dallas Cowboys": '#002244', 
  "Denver Broncos": '#FB4F14', 
  "Detroit Lions": '#0076B6', 
  "Green Bay Packers": '#203731',
  "Houston Texans": '#03202F', 
  "Indianapolis Colts": '#002C5F', 
  "Jacksonville Jaguars": '#006778', 
  "Kansas City Chiefs": '#E31837',
  "Los Angeles Chargers": '#0080C6', 
  "Los Angeles Rams": '#003594', 
  "Las Vegas Raiders": '#000000', 
  "Miami Dolphins": '#008E97',
  "Minnesota Vikings": '#4F2683', 
  "New England Patriots": '#002244', 
  "New Orleans Saints": '#D3BC8D', 
  "New York Giants": '#0B2265',
  "New York Jets": '#125740', 
  "Philadelphia Eagles": '#004C54', 
  "Pittsburgh Steelers": '#FFB612', 
  "Seattle Seahawks": '#002244',
  "San Francisco 49ers": '#AA0000', 
  "Tampa Bay Buccaneers": '#D50A0A', 
  "Tennessee Titans": '#0C2340', 
  "Washington Commanders": '#5A1414'
};

// Get team color by name or return a default color
const getTeamColor = (teamName) => {
  return teamColors[teamName] || '#6366f1';
};

// Get category color based on the category name
const getCategoryColor = (categoryName) => {
  const colorMap = {
    "passing": "#6366f1", // Indigo
    "rushing": "#ec4899", // Pink
    "receiving": "#14b8a6", // Teal
    "scoring": "#f59e0b", // Amber
    "defense": "#10b981", // Emerald
    "kicking": "#6366f1", // Indigo
    "returns": "#8b5cf6"  // Violet
  };
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (categoryName.toLowerCase().includes(key)) {
      return color;
    }
  }
  
  return "#6366f1"; // Default to indigo
};

// Get the appropriate unit of measurement based on the category name
const getCategoryUnit = (categoryName) => {
  // Convert camelCase or spaced category names to readable format
  const formatCategoryName = (name) => {
    // First replace any camelCase with spaces
    const withSpaces = name.replace(/([A-Z])/g, ' $1').trim();
    
    // Handle special cases where words are joined without camelCase
    const commonWords = ['YARDS', 'TACKLES', 'TOUCHDOWNS', 'GOALS', 'RETURNS'];
    let formattedName = withSpaces.toUpperCase();
    
    commonWords.forEach(word => {
      const regex = new RegExp(`${word}$`);
      if (formattedName.includes(word) && !formattedName.match(regex)) {
        formattedName = formattedName.replace(word, ` ${word}`);
      }
    });

    return formattedName;
  };
  
  // For complex category names, extract the exact metric
  if (/[A-Z]/.test(categoryName)) {
    return formatCategoryName(categoryName);
  }
  
  // Fallback to predefined categories if not in camelCase or specific format
  const unitMap = {
    "passing": "PASSING YARDS",
    "rushing": "RUSHING YARDS", 
    "receiving": "RECEIVING YARDS",
    "scoring": "POINTS",
    "defense": "TACKLES",
    "kicking": "FIELD GOALS",
    "returns": "RETURN YARDS",
    "completions": "COMPLETIONS",
    "attempts": "ATTEMPTS",
    "touchdowns": "TOUCHDOWNS",
    "interceptions": "INTERCEPTIONS",
    "sacks": "SACKS",
    "fumbles": "FUMBLES",
    "punts": "PUNTS",
    "punting": "PUNTING YARDS",
    "yards": "YARDS",
    "average": "AVERAGE",
    "passingyards": "PASSING YARDS",
    "rushingyards": "RUSHING YARDS",
    "receivingyards": "RECEIVING YARDS",
    "puntingyards": "PUNTING YARDS",
    "returnyards": "RETURN YARDS",
    "fieldgoals": "FIELD GOALS",
    "passingtouchdowns": "PASSING TOUCHDOWNS",
    "rushingtouchdowns": "RUSHING TOUCHDOWNS",
    "receivingtouchdowns": "RECEIVING TOUCHDOWNS"
  };
  
  // Check if category name includes any of the keys
  for (const [key, unit] of Object.entries(unitMap)) {
    if (categoryName.toLowerCase().includes(key)) {
      return unit;
    }
  }
  
  // If no match found, add spaces between words and capitalize
  return categoryName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase();
};

function PlayerStats() {
  // State management
  const [year, setYear] = useState("2024");
  const SEASONTYPE = "2"; 
  const [leagueLeadersData, setLeagueLeadersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState({});
  const [teamDetails, setTeamDetails] = useState({});
  const [filterTeam, setFilterTeam] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [localStats, setLocalStats] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortDirection, setSortDirection] = useState('desc');

  // Format category names for display
  const formatCategoryName = (name) => {
    // First replace any camelCase with spaces
    const withSpaces = name.replace(/([A-Z])/g, ' $1').trim();
    
    // Handle special cases where words are joined without camelCase
    const commonWords = ['YARDS', 'TACKLES', 'TOUCHDOWNS', 'GOALS', 'RETURNS'];
    let formattedName = withSpaces.toUpperCase();
    
    commonWords.forEach(word => {
      const regex = new RegExp(`${word}$`);
      if (formattedName.includes(word) && !formattedName.match(regex)) {
        formattedName = formattedName.replace(word, ` ${word}`);
      }
    });

    return formattedName;
  };

  // API URL
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${SEASONTYPE}/leaders?lang=en&region=us`;

  // Year selection handler
  const handleYearChange = (event) => {
    setYear(event.target.value);
    setLeagueLeadersData(null);
    setAthleteDetails({});
    setTeamDetails({});
    setFilterTeam("");
    setFilterPosition("");
    setSearchQuery("");
  };

  // Available years for selection
  const availableYears = [
    "2024", "2023", "2022", "2021", "2020",
    "2019", "2018", "2017", "2016", "2015",
    "2014", "2013", "2012", "2011", "2010"
  ];

  // Fetch league leaders data
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error fetching league leaders: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setLeagueLeadersData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  // Fetch athlete details
  useEffect(() => {
    if (!leagueLeadersData || !leagueLeadersData.categories) return;
    
    const refs = [];
    leagueLeadersData.categories.forEach(category => {
      category.leaders.forEach(leader => {
        const ref = leader.athlete?.$ref;
        if (ref && !(ref in athleteDetails)) {
          refs.push(ref);
        }
      });
    });
    
    const uniqueRefs = Array.from(new Set(refs));
    
    uniqueRefs.forEach(ref => {
      fetch(ref)
        .then(r => {
          if (!r.ok) throw new Error(`Error fetching athlete data from ${ref}`);
          return r.json();
        })
        .then(data => {
          const name = data.fullName || data.displayName || "Unknown";
          setAthleteDetails(prev => ({ ...prev, [ref]: { name } }));
        })
        .catch(err => {
          console.error("Error fetching athlete data", err);
          setAthleteDetails(prev => ({ ...prev, [ref]: { name: "Unknown" } }));
        });
    });
  }, [leagueLeadersData]);

  // Fetch team details
  useEffect(() => {
    if (!leagueLeadersData || !leagueLeadersData.categories) return;
    
    const teamRefs = [];
    leagueLeadersData.categories.forEach(category => {
      category.leaders.forEach(leader => {
        const teamRef = leader.team?.$ref;
        if (teamRef && !(teamRef in teamDetails)) {
          teamRefs.push(teamRef);
        }
      });
    });
    
    const uniqueTeamRefs = Array.from(new Set(teamRefs));
    
    uniqueTeamRefs.forEach(ref => {
      fetch(ref)
        .then(r => {
          if (!r.ok) throw new Error(`Error fetching team data from ${ref}`);
          return r.json();
        })
        .then(data => {
          const name = data.displayName || data.name || "Unknown";
          setTeamDetails(prev => ({ ...prev, [ref]: { name } }));
        })
        .catch(err => {
          console.error("Error fetching team data", err);
          setTeamDetails(prev => ({ ...prev, [ref]: { name: "Unknown" } }));
        });
    });
  }, [leagueLeadersData]);

  // Get distinct teams for filtering
  const distinctTeams = React.useMemo(() => {
    const teamSet = new Set();
    if (leagueLeadersData && leagueLeadersData.categories) {
      leagueLeadersData.categories.forEach(category => {
        category.leaders.forEach(leader => {
          const teamRef = leader.team?.$ref || "";
          let teamName = "";
          if (teamRef) {
            teamName = teamDetails[teamRef]
              ? teamDetails[teamRef].name
              : teamRef.split('/').pop().split('?')[0];
            teamSet.add(teamName);
          }
        });
      });
    }
    return Array.from(teamSet).sort();
  }, [leagueLeadersData, teamDetails]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle sort direction change
  const handleSortDirectionChange = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Filter and sort players based on current category
  const getFilteredAndSortedPlayers = () => {
    if (!leagueLeadersData || !leagueLeadersData.categories) return [];
    
    const category = leagueLeadersData.categories[selectedTab];
    if (!category || !category.leaders) return [];

    let filteredLeaders = category.leaders;

    // Apply team filter
    if (filterTeam) {
      filteredLeaders = filteredLeaders.filter(leader => {
        const teamRef = leader.team?.$ref || "";
        if (!teamRef) return false;
        const teamName = teamDetails[teamRef]?.name || "";
        return teamName === filterTeam;
      });
    }

    // Apply position filter
    if (filterPosition) {
      filteredLeaders = filteredLeaders.filter(leader => {
        const athleteRef = leader.athlete?.$ref || "";
        const athlete = athleteDetails[athleteRef];
        return athlete?.position === filterPosition;
      });
    }

    // Apply search filter
    if (searchQuery) {
      filteredLeaders = filteredLeaders.filter(leader => {
        const athleteRef = leader.athlete?.$ref || "";
        const athleteName = athleteDetails[athleteRef]?.name || "";
        return athleteName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort leaders
    filteredLeaders.sort((a, b) => {
      const valueA = parseFloat(a.value) || 0;
      const valueB = parseFloat(b.value) || 0;
      return sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
    });

    return filteredLeaders;
  };

  // Save stats to database
  const saveStatsToDatabase = async (stats) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const statsData = {
        year,
        stats,
        source: 'ESPN',
        lastUpdated: new Date().toISOString()
      };
      await addPlayerStats(statsData);
      setLocalStats(stats);
    } catch (error) {
      console.error('Error saving stats:', error);
      setSaveError('Failed to save stats to database');
    } finally {
      setIsSaving(false);
    }
  };

  // Load stats from database
  const loadStatsFromDatabase = async () => {
    try {
      const stats = await getPlayerStats(null, year);
      if (stats) {
        setLocalStats(stats.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Import all stats to database
  const importAllStats = async () => {
    if (!leagueLeadersData || !leagueLeadersData.categories) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      const statsArray = leagueLeadersData.categories.map(category => ({
        year,
        category: category.name,
        leaders: category.leaders.map(leader => ({
          athleteId: leader.athlete?.id,
          athleteName: athleteDetails[leader.athlete?.$ref]?.name || 'Unknown',
          teamId: leader.team?.id,
          teamName: teamDetails[leader.team?.$ref]?.name || 'Unknown',
          value: leader.value,
          displayValue: leader.displayValue
        }))
      }));
      
      await importPlayerStats(statsArray);
      setLocalStats(statsArray);
    } catch (error) {
      console.error('Error importing stats:', error);
      setSaveError('Failed to import stats to database');
    } finally {
      setIsSaving(false);
    }
  };

  // Render filter controls
  const renderFilters = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={handleYearChange}
            >
              {availableYears.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Team</InputLabel>
            <Select
              value={filterTeam}
              label="Team"
              onChange={(e) => setFilterTeam(e.target.value)}
            >
              <MenuItem value="">All Teams</MenuItem>
              {distinctTeams.map((team) => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              value={filterPosition}
              label="Position"
              onChange={(e) => setFilterPosition(e.target.value)}
            >
              <MenuItem value="">All Positions</MenuItem>
              <MenuItem value="QB">QB</MenuItem>
              <MenuItem value="RB">RB</MenuItem>
              <MenuItem value="WR">WR</MenuItem>
              <MenuItem value="TE">TE</MenuItem>
              <MenuItem value="K">K</MenuItem>
              <MenuItem value="DST">DST</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Search Players"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveError}
        </Alert>
      )}
    </Box>
  );

  // Render stats table
  const renderStatsTable = () => {
    if (!leagueLeadersData || !leagueLeadersData.categories) {
      return <Typography>No league leader data available.</Typography>;
    }

    const category = leagueLeadersData.categories[selectedTab];
    if (!category) return null;

    const filteredLeaders = getFilteredAndSortedPlayers();
    const categoryColor = getCategoryColor(category.name);

    return (
      <Box sx={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}>
        <TableContainer component={Paper} elevation={0} sx={{ 
          backgroundColor: 'transparent',
          border: 'none'
        }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: alpha(categoryColor, 0.2),
                borderBottom: `2px solid ${alpha(categoryColor, 0.3)}`
              }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>RANK</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>PLAYER</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>TEAM</TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: 'white',
                    '&:hover': { backgroundColor: alpha(categoryColor, 0.3) }
                  }}
                  onClick={handleSortDirectionChange}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCategoryUnit(category.name)}
                    {sortDirection === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaders.map((leader, leaderIndex) => {
                const athleteRef = leader.athlete?.$ref || "";
                const teamRef = leader.team?.$ref || "";
                
                const athleteName = athleteRef && athleteDetails[athleteRef]
                  ? athleteDetails[athleteRef].name
                  : "Loading...";
                
                const teamName = teamRef && teamDetails[teamRef]
                  ? teamDetails[teamRef].name
                  : "Loading...";
                  
                const teamColor = getTeamColor(teamName);
                  
                return (
                  <TableRow 
                    key={leaderIndex}
                    sx={{ 
                      backgroundColor: leaderIndex % 2 === 0 ? 'transparent' : alpha(categoryColor, 0.05),
                      '&:hover': {
                        backgroundColor: alpha(categoryColor, 0.1),
                        transition: 'background-color 0.2s',
                      },
                      transition: 'background-color 0.2s',
                      borderBottom: leaderIndex < filteredLeaders.length - 1 ? `1px solid ${alpha(categoryColor, 0.1)}` : 'none'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>{leaderIndex + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>{athleteName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={teamName} 
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(teamColor, 0.2),
                          color: 'white',
                          borderColor: alpha(teamColor, 0.5),
                          fontWeight: 'bold',
                          border: '1px solid'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>{leader.displayValue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render loading skeleton
  const renderLoadingState = () => (
    <Box sx={{ mt: 3 }}>
      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 1, mb: 2 }} />
    </Box>
  );

  // Main render
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
            NFL STATS EXPLORER
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View league leader statistics across NFL seasons from 2010-2024
          </Typography>
          <Divider sx={{ 
            mb: 4,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            height: '1px'
          }} />
        </Box>

        {renderFilters()}
        
        {loading ? (
          renderLoadingState()
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              backgroundColor: 'rgba(211, 47, 47, 0.1)', 
              border: '1px solid rgba(211, 47, 47, 0.2)',
              color: '#f87171'
            }}
          >
            Error loading stats: {error.message}
          </Alert>
        ) : (
          <Box>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  minWidth: 120,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {leagueLeadersData?.categories.map((category, index) => (
                <Tab
                  key={index}
                  label={formatCategoryName(category.name)}
                  sx={{
                    borderLeft: `4px solid ${getCategoryColor(category.name)}`,
                    pl: 2,
                    '& .MuiTab-wrapper': {
                      whiteSpace: 'normal',
                      textAlign: 'left'
                    }
                  }}
                />
              ))}
            </Tabs>
            {renderStatsTable()}
          </Box>
        )}
      </div>
    </Fade>
  );
}

export default PlayerStats;
