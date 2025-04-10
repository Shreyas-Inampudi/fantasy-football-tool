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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Card,
  Chip,
  Divider,
  Fade,
  Grid,
  Skeleton,
  alpha
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  FilterAlt as FilterIcon,
  BarChart as StatsIcon,
  CalendarMonth as YearIcon
} from '@mui/icons-material';

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
    // First handle camelCase (e.g. passingTouchdowns → Passing Touchdowns)
    const spacedName = name.replace(/([A-Z])/g, ' $1').trim();
    
    // Then capitalize first letter of each word
    return spacedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // For complex category names, extract the exact metric
  if (/[A-Z]/.test(categoryName)) {
    return formatCategoryName(categoryName);
  }
  
  // Fallback to predefined categories if not in camelCase or specific format
  const unitMap = {
    "passing": "Passing Yards",
    "rushing": "Rushing Yards", 
    "receiving": "Receiving Yards",
    "scoring": "Points",
    "defense": "Tackles",
    "kicking": "Field Goals",
    "returns": "Return Yards",
    "completions": "Completions",
    "attempts": "Attempts",
    "touchdowns": "Touchdowns",
    "interceptions": "Interceptions",
    "sacks": "Sacks",
    "fumbles": "Fumbles",
    "punts": "Punts",
    "punting": "Punting Yards",
    "yards": "Yards",
    "average": "Average"
  };
  
  // Check if category name includes any of the keys
  for (const [key, unit] of Object.entries(unitMap)) {
    if (categoryName.toLowerCase().includes(key)) {
      return unit;
    }
  }
  
  return categoryName; // Just return the category name if no match
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

  // API URL
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${SEASONTYPE}/leaders?lang=en&region=us`;

  // Year selection handler
  const handleYearChange = (event) => {
    setYear(event.target.value);
    setLeagueLeadersData(null);
    setAthleteDetails({});
    setTeamDetails({});
    setFilterTeam("");
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

  // Render filter controls
  const renderFilters = () => (
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FilterIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" fontWeight="600">Filter Options</Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="year-select-label">Season Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={year}
              onChange={handleYearChange}
              label="Season Year"
              startAdornment={<YearIcon sx={{ mr: 1, color: 'primary.main' }} />}
            >
              {availableYears.map(y => (
                <MenuItem key={y} value={y}>
                  {y} Season
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="team-filter-label">Team</InputLabel>
            <Select
              labelId="team-filter-label"
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              label="Team"
            >
              <MenuItem value="">
                <em>All Teams</em>
              </MenuItem>
              {distinctTeams.map(teamName => (
                <MenuItem 
                  key={teamName} 
                  value={teamName}
                  sx={{ 
                    borderLeft: `4px solid ${getTeamColor(teamName)}`,
                    pl: 2
                  }}
                >
                  {teamName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );

  // Render league leaders data
  const renderLeagueLeaders = () => {
    if (!leagueLeadersData || !leagueLeadersData.categories) {
      return <Typography>No league leader data available.</Typography>;
    }

    return (
      <Box sx={{ mt: 2 }}>
        {leagueLeadersData.categories.map((category, index) => {
          // Skip categories with no leaders
          if (!category.leaders || category.leaders.length === 0) {
            return null;
          }

          const categoryColor = getCategoryColor(category.name);
          
          // Filter leaders by selected team if a filter is applied
          const filteredLeaders = filterTeam
            ? category.leaders.filter(leader => {
                const teamRef = leader.team?.$ref || "";
                if (!teamRef) return false;
                const teamName = teamDetails[teamRef]
                  ? teamDetails[teamRef].name
                  : "";
                return teamName === filterTeam;
              })
            : category.leaders;

          // If no leaders match the team filter, skip this category
          if (filteredLeaders.length === 0) {
            return null;
          }

          return (
            <Accordion 
              key={index} 
              defaultExpanded={index === 0}
              sx={{ 
                my: 2, 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                backgroundImage: `linear-gradient(${alpha(categoryColor, 0.05)}, transparent)`,
                borderRadius: '8px !important',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&:before': {
                  display: 'none',
                },
                boxShadow: 'none',
                '&.Mui-expanded': {
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  borderLeft: `4px solid ${categoryColor}`,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StatsIcon sx={{ color: categoryColor }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Chip 
                    label={`${filteredLeaders.length} Leaders`} 
                    size="small"
                    sx={{ 
                      backgroundColor: alpha(categoryColor, 0.2),
                      color: 'white',
                      ml: 1,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} elevation={0} sx={{ 
                  backgroundColor: 'transparent',
                  border: 'none'
                }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(categoryColor, 0.2) }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Team</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{getCategoryUnit(category.name)}</TableCell>
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
                            }}
                          >
                            <TableCell>{leaderIndex + 1}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{athleteName}</TableCell>
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
                            <TableCell sx={{ fontWeight: 'bold' }}>{leader.displayValue}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
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
            NFL Stats Explorer
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View league leader statistics across NFL seasons from 2010-2024
          </Typography>
          <Divider sx={{ mb: 4 }} />
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
          renderLeagueLeaders()
        )}
      </div>
    </Fade>
  );
}

export default PlayerStats;
