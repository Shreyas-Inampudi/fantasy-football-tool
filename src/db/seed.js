const { pool } = require('./db');

const teams = [
    { name: 'Arizona Cardinals', short_name: 'ARI', wins: 4, losses: 13, points_for: 330, points_against: 455 },
    { name: 'Atlanta Falcons', short_name: 'ATL', wins: 7, losses: 10, points_for: 321, points_against: 373 },
    { name: 'Baltimore Ravens', short_name: 'BAL', wins: 13, losses: 4, points_for: 371, points_against: 307 },
    { name: 'Buffalo Bills', short_name: 'BUF', wins: 11, losses: 6, points_for: 451, points_against: 311 },
    { name: 'Carolina Panthers', short_name: 'CAR', wins: 2, losses: 15, points_for: 236, points_against: 416 },
    { name: 'Chicago Bears', short_name: 'CHI', wins: 7, losses: 10, points_for: 360, points_against: 379 },
    { name: 'Cincinnati Bengals', short_name: 'CIN', wins: 9, losses: 8, points_for: 366, points_against: 384 },
    { name: 'Cleveland Browns', short_name: 'CLE', wins: 11, losses: 6, points_for: 396, points_against: 362 },
    { name: 'Dallas Cowboys', short_name: 'DAL', wins: 12, losses: 5, points_for: 509, points_against: 315 },
    { name: 'Denver Broncos', short_name: 'DEN', wins: 8, losses: 9, points_for: 357, points_against: 413 },
    { name: 'Detroit Lions', short_name: 'DET', wins: 12, losses: 5, points_for: 461, points_against: 395 },
    { name: 'Green Bay Packers', short_name: 'GB', wins: 9, losses: 8, points_for: 383, points_against: 350 },
    { name: 'Houston Texans', short_name: 'HOU', wins: 10, losses: 7, points_for: 377, points_against: 353 },
    { name: 'Indianapolis Colts', short_name: 'IND', wins: 9, losses: 8, points_for: 396, points_against: 415 },
    { name: 'Jacksonville Jaguars', short_name: 'JAX', wins: 9, losses: 8, points_for: 377, points_against: 371 },
    { name: 'Kansas City Chiefs', short_name: 'KC', wins: 11, losses: 6, points_for: 371, points_against: 294 },
    { name: 'Las Vegas Raiders', short_name: 'LV', wins: 8, losses: 9, points_for: 331, points_against: 337 },
    { name: 'Los Angeles Chargers', short_name: 'LAC', wins: 5, losses: 12, points_for: 346, points_against: 398 },
    { name: 'Los Angeles Rams', short_name: 'LAR', wins: 10, losses: 7, points_for: 404, points_against: 377 },
    { name: 'Miami Dolphins', short_name: 'MIA', wins: 11, losses: 6, points_for: 496, points_against: 391 },
    { name: 'Minnesota Vikings', short_name: 'MIN', wins: 7, losses: 10, points_for: 344, points_against: 362 },
    { name: 'New England Patriots', short_name: 'NE', wins: 4, losses: 13, points_for: 236, points_against: 366 },
    { name: 'New Orleans Saints', short_name: 'NO', wins: 9, losses: 8, points_for: 402, points_against: 327 },
    { name: 'New York Giants', short_name: 'NYG', wins: 6, losses: 11, points_for: 266, points_against: 407 },
    { name: 'New York Jets', short_name: 'NYJ', wins: 7, losses: 10, points_for: 268, points_against: 355 },
    { name: 'Philadelphia Eagles', short_name: 'PHI', wins: 11, losses: 6, points_for: 433, points_against: 384 },
    { name: 'Pittsburgh Steelers', short_name: 'PIT', wins: 10, losses: 7, points_for: 304, points_against: 324 },
    { name: 'San Francisco 49ers', short_name: 'SF', wins: 12, losses: 5, points_for: 491, points_against: 298 },
    { name: 'Seattle Seahawks', short_name: 'SEA', wins: 9, losses: 8, points_for: 364, points_against: 402 },
    { name: 'Tampa Bay Buccaneers', short_name: 'TB', wins: 9, losses: 8, points_for: 348, points_against: 325 },
    { name: 'Tennessee Titans', short_name: 'TEN', wins: 6, losses: 11, points_for: 305, points_against: 367 },
    { name: 'Washington Commanders', short_name: 'WAS', wins: 4, losses: 13, points_for: 329, points_against: 518 }
];

const samplePlayers = [
    // Arizona Cardinals
    { name: 'Kyler Murray', position: 'QB', price: 7.0, team: 'Arizona Cardinals', jersey_number: 1, height: '5-10', weight: 207, age: 26 },
    { name: 'James Conner', position: 'RB', price: 5.5, team: 'Arizona Cardinals', jersey_number: 6, height: '6-1', weight: 233, age: 28 },
    { name: 'Marquise Brown', position: 'WR', price: 5.0, team: 'Arizona Cardinals', jersey_number: 2, height: '5-9', weight: 180, age: 26 },
    { name: 'DeAndre Hopkins', position: 'WR', price: 6.0, team: 'Arizona Cardinals', jersey_number: 10, height: '6-1', weight: 212, age: 31 },
    { name: 'Zach Ertz', position: 'TE', price: 4.5, team: 'Arizona Cardinals', jersey_number: 86, height: '6-5', weight: 250, age: 33 },
    { name: 'Matt Prater', position: 'K', price: 3.5, team: 'Arizona Cardinals', jersey_number: 5, height: '5-10', weight: 195, age: 39 },
    { name: 'Arizona Cardinals D/ST', position: 'DST', price: 3.0, team: 'Arizona Cardinals', jersey_number: 0, height: 'N/A', weight: 0, age: 0 },
    
    // Atlanta Falcons
    { name: 'Desmond Ridder', position: 'QB', price: 4.5, team: 'Atlanta Falcons' },
    { name: 'Bijan Robinson', position: 'RB', price: 6.5, team: 'Atlanta Falcons' },
    { name: 'Tyler Allgeier', position: 'RB', price: 4.5, team: 'Atlanta Falcons' },
    { name: 'Drake London', position: 'WR', price: 5.0, team: 'Atlanta Falcons' },
    { name: 'Kyle Pitts', position: 'TE', price: 5.0, team: 'Atlanta Falcons' },
    { name: 'Younghoe Koo', position: 'K', price: 3.5, team: 'Atlanta Falcons' },
    { name: 'Atlanta Falcons D/ST', position: 'DST', price: 3.0, team: 'Atlanta Falcons' },
    
    // Baltimore Ravens
    { name: 'Lamar Jackson', position: 'QB', price: 7.5, team: 'Baltimore Ravens' },
    { name: 'J.K. Dobbins', position: 'RB', price: 5.0, team: 'Baltimore Ravens' },
    { name: 'Gus Edwards', position: 'RB', price: 4.0, team: 'Baltimore Ravens' },
    { name: 'Mark Andrews', position: 'TE', price: 5.5, team: 'Baltimore Ravens' },
    { name: 'Odell Beckham Jr.', position: 'WR', price: 4.5, team: 'Baltimore Ravens' },
    { name: 'Justin Tucker', position: 'K', price: 4.0, team: 'Baltimore Ravens' },
    { name: 'Baltimore Ravens D/ST', position: 'DST', price: 3.5, team: 'Baltimore Ravens' },
    
    // Buffalo Bills
    { name: 'Josh Allen', position: 'QB', price: 8.0, team: 'Buffalo Bills' },
    { name: 'James Cook', position: 'RB', price: 5.0, team: 'Buffalo Bills' },
    { name: 'Stefon Diggs', position: 'WR', price: 6.0, team: 'Buffalo Bills' },
    { name: 'Gabe Davis', position: 'WR', price: 4.5, team: 'Buffalo Bills' },
    { name: 'Dalton Kincaid', position: 'TE', price: 4.0, team: 'Buffalo Bills' },
    { name: 'Tyler Bass', position: 'K', price: 3.5, team: 'Buffalo Bills' },
    { name: 'Buffalo Bills D/ST', position: 'DST', price: 4.0, team: 'Buffalo Bills' },
    
    // Carolina Panthers
    { name: 'Bryce Young', position: 'QB', price: 4.5, team: 'Carolina Panthers' },
    { name: 'Miles Sanders', position: 'RB', price: 4.5, team: 'Carolina Panthers' },
    { name: 'Chuba Hubbard', position: 'RB', price: 3.5, team: 'Carolina Panthers' },
    { name: 'Adam Thielen', position: 'WR', price: 4.0, team: 'Carolina Panthers' },
    { name: 'DJ Chark', position: 'WR', price: 3.5, team: 'Carolina Panthers' },
    { name: 'Hayden Hurst', position: 'TE', price: 3.5, team: 'Carolina Panthers' },
    { name: 'Eddy Pineiro', position: 'K', price: 3.0, team: 'Carolina Panthers' },
    { name: 'Carolina Panthers D/ST', position: 'DST', price: 3.0, team: 'Carolina Panthers' },
    
    // Chicago Bears
    { name: 'Justin Fields', position: 'QB', price: 5.5, team: 'Chicago Bears' },
    { name: 'Khalil Herbert', position: 'RB', price: 4.0, team: 'Chicago Bears' },
    { name: 'D\'Onta Foreman', position: 'RB', price: 3.5, team: 'Chicago Bears' },
    { name: 'DJ Moore', position: 'WR', price: 5.0, team: 'Chicago Bears' },
    { name: 'Cole Kmet', position: 'TE', price: 3.5, team: 'Chicago Bears' },
    { name: 'Cairo Santos', position: 'K', price: 3.0, team: 'Chicago Bears' },
    { name: 'Chicago Bears D/ST', position: 'DST', price: 3.0, team: 'Chicago Bears' },
    
    // Cincinnati Bengals
    { name: 'Joe Burrow', position: 'QB', price: 7.5, team: 'Cincinnati Bengals' },
    { name: 'Joe Mixon', position: 'RB', price: 5.0, team: 'Cincinnati Bengals' },
    { name: 'Ja\'Marr Chase', position: 'WR', price: 6.5, team: 'Cincinnati Bengals' },
    { name: 'Tee Higgins', position: 'WR', price: 5.5, team: 'Cincinnati Bengals' },
    { name: 'Tyler Boyd', position: 'WR', price: 4.0, team: 'Cincinnati Bengals' },
    { name: 'Irv Smith Jr.', position: 'TE', price: 3.5, team: 'Cincinnati Bengals' },
    { name: 'Evan McPherson', position: 'K', price: 3.5, team: 'Cincinnati Bengals' },
    { name: 'Cincinnati Bengals D/ST', position: 'DST', price: 3.5, team: 'Cincinnati Bengals' },
    
    // Cleveland Browns
    { name: 'Deshaun Watson', position: 'QB', price: 5.5, team: 'Cleveland Browns' },
    { name: 'Nick Chubb', position: 'RB', price: 6.0, team: 'Cleveland Browns' },
    { name: 'Jerome Ford', position: 'RB', price: 3.5, team: 'Cleveland Browns' },
    { name: 'Amari Cooper', position: 'WR', price: 5.0, team: 'Cleveland Browns' },
    { name: 'Donovan Peoples-Jones', position: 'WR', price: 3.5, team: 'Cleveland Browns' },
    { name: 'David Njoku', position: 'TE', price: 3.5, team: 'Cleveland Browns' },
    { name: 'Dustin Hopkins', position: 'K', price: 3.0, team: 'Cleveland Browns' },
    { name: 'Cleveland Browns D/ST', position: 'DST', price: 3.5, team: 'Cleveland Browns' },
    
    // Dallas Cowboys
    { name: 'Dak Prescott', position: 'QB', price: 6.5, team: 'Dallas Cowboys' },
    { name: 'Tony Pollard', position: 'RB', price: 5.5, team: 'Dallas Cowboys' },
    { name: 'CeeDee Lamb', position: 'WR', price: 6.0, team: 'Dallas Cowboys' },
    { name: 'Brandin Cooks', position: 'WR', price: 4.0, team: 'Dallas Cowboys' },
    { name: 'Jake Ferguson', position: 'TE', price: 3.5, team: 'Dallas Cowboys' },
    { name: 'Brandon Aubrey', position: 'K', price: 3.0, team: 'Dallas Cowboys' },
    { name: 'Dallas Cowboys D/ST', position: 'DST', price: 3.5, team: 'Dallas Cowboys' },
    
    // Denver Broncos
    { name: 'Russell Wilson', position: 'QB', price: 5.5, team: 'Denver Broncos' },
    { name: 'Javonte Williams', position: 'RB', price: 4.5, team: 'Denver Broncos' },
    { name: 'Samaje Perine', position: 'RB', price: 3.5, team: 'Denver Broncos' },
    { name: 'Courtland Sutton', position: 'WR', price: 4.0, team: 'Denver Broncos' },
    { name: 'Jerry Jeudy', position: 'WR', price: 4.0, team: 'Denver Broncos' },
    { name: 'Greg Dulcich', position: 'TE', price: 3.0, team: 'Denver Broncos' },
    { name: 'Wil Lutz', position: 'K', price: 3.0, team: 'Denver Broncos' },
    { name: 'Denver Broncos D/ST', position: 'DST', price: 3.0, team: 'Denver Broncos' },
    
    // Detroit Lions
    { name: 'Jared Goff', position: 'QB', price: 5.5, team: 'Detroit Lions' },
    { name: 'David Montgomery', position: 'RB', price: 5.0, team: 'Detroit Lions' },
    { name: 'Jahmyr Gibbs', position: 'RB', price: 5.0, team: 'Detroit Lions' },
    { name: 'Amon-Ra St. Brown', position: 'WR', price: 5.5, team: 'Detroit Lions' },
    { name: 'Sam LaPorta', position: 'TE', price: 4.0, team: 'Detroit Lions' },
    { name: 'Riley Patterson', position: 'K', price: 3.0, team: 'Detroit Lions' },
    { name: 'Detroit Lions D/ST', position: 'DST', price: 3.0, team: 'Detroit Lions' },
    
    // Green Bay Packers
    { name: 'Jordan Love', position: 'QB', price: 4.5, team: 'Green Bay Packers' },
    { name: 'Aaron Jones', position: 'RB', price: 4.5, team: 'Green Bay Packers' },
    { name: 'AJ Dillon', position: 'RB', price: 3.5, team: 'Green Bay Packers' },
    { name: 'Christian Watson', position: 'WR', price: 4.5, team: 'Green Bay Packers' },
    { name: 'Romeo Doubs', position: 'WR', price: 3.5, team: 'Green Bay Packers' },
    { name: 'Luke Musgrave', position: 'TE', price: 3.0, team: 'Green Bay Packers' },
    { name: 'Anders Carlson', position: 'K', price: 3.0, team: 'Green Bay Packers' },
    { name: 'Green Bay Packers D/ST', position: 'DST', price: 3.0, team: 'Green Bay Packers' },
    
    // Houston Texans
    { name: 'C.J. Stroud', position: 'QB', price: 4.5, team: 'Houston Texans' },
    { name: 'Dameon Pierce', position: 'RB', price: 4.0, team: 'Houston Texans' },
    { name: 'Devin Singletary', position: 'RB', price: 3.5, team: 'Houston Texans' },
    { name: 'Nico Collins', position: 'WR', price: 4.0, team: 'Houston Texans' },
    { name: 'Tank Dell', position: 'WR', price: 3.5, team: 'Houston Texans' },
    { name: 'Dalton Schultz', position: 'TE', price: 3.5, team: 'Houston Texans' },
    { name: 'Ka\'imi Fairbairn', position: 'K', price: 3.0, team: 'Houston Texans' },
    { name: 'Houston Texans D/ST', position: 'DST', price: 3.0, team: 'Houston Texans' },
    
    // Indianapolis Colts
    { name: 'Anthony Richardson', position: 'QB', price: 4.5, team: 'Indianapolis Colts' },
    { name: 'Jonathan Taylor', position: 'RB', price: 5.5, team: 'Indianapolis Colts' },
    { name: 'Zack Moss', position: 'RB', price: 3.5, team: 'Indianapolis Colts' },
    { name: 'Michael Pittman Jr.', position: 'WR', price: 4.5, team: 'Indianapolis Colts' },
    { name: 'Josh Downs', position: 'WR', price: 3.5, team: 'Indianapolis Colts' },
    { name: 'Jelani Woods', position: 'TE', price: 3.0, team: 'Indianapolis Colts' },
    { name: 'Matt Gay', position: 'K', price: 3.0, team: 'Indianapolis Colts' },
    { name: 'Indianapolis Colts D/ST', position: 'DST', price: 3.0, team: 'Indianapolis Colts' },
    
    // Jacksonville Jaguars
    { name: 'Trevor Lawrence', position: 'QB', price: 6.0, team: 'Jacksonville Jaguars' },
    { name: 'Travis Etienne Jr.', position: 'RB', price: 5.0, team: 'Jacksonville Jaguars' },
    { name: 'Calvin Ridley', position: 'WR', price: 5.0, team: 'Jacksonville Jaguars' },
    { name: 'Christian Kirk', position: 'WR', price: 4.5, team: 'Jacksonville Jaguars' },
    { name: 'Evan Engram', position: 'TE', price: 4.0, team: 'Jacksonville Jaguars' },
    { name: 'Brandon McManus', position: 'K', price: 3.0, team: 'Jacksonville Jaguars' },
    { name: 'Jacksonville Jaguars D/ST', position: 'DST', price: 3.0, team: 'Jacksonville Jaguars' },
    
    // Kansas City Chiefs
    { name: 'Patrick Mahomes', position: 'QB', price: 8.5, team: 'Kansas City Chiefs' },
    { name: 'Isiah Pacheco', position: 'RB', price: 4.5, team: 'Kansas City Chiefs' },
    { name: 'Travis Kelce', position: 'TE', price: 6.5, team: 'Kansas City Chiefs' },
    { name: 'Rashee Rice', position: 'WR', price: 4.0, team: 'Kansas City Chiefs' },
    { name: 'Kadarius Toney', position: 'WR', price: 3.5, team: 'Kansas City Chiefs' },
    { name: 'Harrison Butker', position: 'K', price: 4.0, team: 'Kansas City Chiefs' },
    { name: 'Kansas City Chiefs D/ST', position: 'DST', price: 3.5, team: 'Kansas City Chiefs' },
    
    // Las Vegas Raiders
    { name: 'Jimmy Garoppolo', position: 'QB', price: 4.5, team: 'Las Vegas Raiders' },
    { name: 'Josh Jacobs', position: 'RB', price: 5.5, team: 'Las Vegas Raiders' },
    { name: 'Davante Adams', position: 'WR', price: 6.5, team: 'Las Vegas Raiders' },
    { name: 'Jakobi Meyers', position: 'WR', price: 3.5, team: 'Las Vegas Raiders' },
    { name: 'Michael Mayer', position: 'TE', price: 3.0, team: 'Las Vegas Raiders' },
    { name: 'Daniel Carlson', position: 'K', price: 3.5, team: 'Las Vegas Raiders' },
    { name: 'Las Vegas Raiders D/ST', position: 'DST', price: 3.0, team: 'Las Vegas Raiders' },
    
    // Los Angeles Chargers
    { name: 'Justin Herbert', position: 'QB', price: 7.0, team: 'Los Angeles Chargers' },
    { name: 'Austin Ekeler', position: 'RB', price: 6.5, team: 'Los Angeles Chargers' },
    { name: 'Keenan Allen', position: 'WR', price: 5.5, team: 'Los Angeles Chargers' },
    { name: 'Mike Williams', position: 'WR', price: 4.5, team: 'Los Angeles Chargers' },
    { name: 'Gerald Everett', position: 'TE', price: 3.5, team: 'Los Angeles Chargers' },
    { name: 'Cameron Dicker', position: 'K', price: 3.0, team: 'Los Angeles Chargers' },
    { name: 'Los Angeles Chargers D/ST', position: 'DST', price: 3.0, team: 'Los Angeles Chargers' },
    
    // Los Angeles Rams
    { name: 'Matthew Stafford', position: 'QB', price: 5.5, team: 'Los Angeles Rams' },
    { name: 'Kyren Williams', position: 'RB', price: 4.5, team: 'Los Angeles Rams' },
    { name: 'Cooper Kupp', position: 'WR', price: 6.0, team: 'Los Angeles Rams' },
    { name: 'Puka Nacua', position: 'WR', price: 4.5, team: 'Los Angeles Rams' },
    { name: 'Tyler Higbee', position: 'TE', price: 3.5, team: 'Los Angeles Rams' },
    { name: 'Brett Maher', position: 'K', price: 3.0, team: 'Los Angeles Rams' },
    { name: 'Los Angeles Rams D/ST', position: 'DST', price: 3.0, team: 'Los Angeles Rams' },
    
    // Miami Dolphins
    { name: 'Tua Tagovailoa', position: 'QB', price: 6.0, team: 'Miami Dolphins' },
    { name: 'Raheem Mostert', position: 'RB', price: 4.5, team: 'Miami Dolphins' },
    { name: 'De\'Von Achane', position: 'RB', price: 4.0, team: 'Miami Dolphins' },
    { name: 'Tyreek Hill', position: 'WR', price: 7.0, team: 'Miami Dolphins' },
    { name: 'Jaylen Waddle', position: 'WR', price: 5.5, team: 'Miami Dolphins' },
    { name: 'Durham Smythe', position: 'TE', price: 3.0, team: 'Miami Dolphins' },
    { name: 'Jason Sanders', position: 'K', price: 3.0, team: 'Miami Dolphins' },
    { name: 'Miami Dolphins D/ST', position: 'DST', price: 3.0, team: 'Miami Dolphins' },
    
    // Minnesota Vikings
    { name: 'Kirk Cousins', position: 'QB', price: 5.5, team: 'Minnesota Vikings' },
    { name: 'Alexander Mattison', position: 'RB', price: 4.0, team: 'Minnesota Vikings' },
    { name: 'Justin Jefferson', position: 'WR', price: 7.0, team: 'Minnesota Vikings' },
    { name: 'Jordan Addison', position: 'WR', price: 4.0, team: 'Minnesota Vikings' },
    { name: 'T.J. Hockenson', position: 'TE', price: 5.0, team: 'Minnesota Vikings' },
    { name: 'Greg Joseph', position: 'K', price: 3.0, team: 'Minnesota Vikings' },
    { name: 'Minnesota Vikings D/ST', position: 'DST', price: 3.0, team: 'Minnesota Vikings' },
    
    // New England Patriots
    { name: 'Mac Jones', position: 'QB', price: 4.0, team: 'New England Patriots' },
    { name: 'Rhamondre Stevenson', position: 'RB', price: 4.5, team: 'New England Patriots' },
    { name: 'Ezekiel Elliott', position: 'RB', price: 3.5, team: 'New England Patriots' },
    { name: 'DeVante Parker', position: 'WR', price: 3.5, team: 'New England Patriots' },
    { name: 'Kendrick Bourne', position: 'WR', price: 3.0, team: 'New England Patriots' },
    { name: 'Hunter Henry', position: 'TE', price: 3.5, team: 'New England Patriots' },
    { name: 'Chad Ryland', position: 'K', price: 3.0, team: 'New England Patriots' },
    { name: 'New England Patriots D/ST', position: 'DST', price: 3.5, team: 'New England Patriots' },
    
    // New Orleans Saints
    { name: 'Derek Carr', position: 'QB', price: 4.5, team: 'New Orleans Saints' },
    { name: 'Alvin Kamara', position: 'RB', price: 5.0, team: 'New Orleans Saints' },
    { name: 'Jamaal Williams', position: 'RB', price: 3.5, team: 'New Orleans Saints' },
    { name: 'Chris Olave', position: 'WR', price: 4.5, team: 'New Orleans Saints' },
    { name: 'Michael Thomas', position: 'WR', price: 4.0, team: 'New Orleans Saints' },
    { name: 'Juwan Johnson', position: 'TE', price: 3.0, team: 'New Orleans Saints' },
    { name: 'Blake Grupe', position: 'K', price: 3.0, team: 'New Orleans Saints' },
    { name: 'New Orleans Saints D/ST', position: 'DST', price: 3.5, team: 'New Orleans Saints' },
    
    // New York Giants
    { name: 'Daniel Jones', position: 'QB', price: 4.0, team: 'New York Giants' },
    { name: 'Saquon Barkley', position: 'RB', price: 6.0, team: 'New York Giants' },
    { name: 'Darren Waller', position: 'TE', price: 4.5, team: 'New York Giants' },
    { name: 'Darius Slayton', position: 'WR', price: 3.5, team: 'New York Giants' },
    { name: 'Wan\'Dale Robinson', position: 'WR', price: 3.0, team: 'New York Giants' },
    { name: 'Graham Gano', position: 'K', price: 3.0, team: 'New York Giants' },
    { name: 'New York Giants D/ST', position: 'DST', price: 3.0, team: 'New York Giants' },
    
    // New York Jets
    { name: 'Aaron Rodgers', position: 'QB', price: 6.0, team: 'New York Jets' },
    { name: 'Breece Hall', position: 'RB', price: 5.0, team: 'New York Jets' },
    { name: 'Dalvin Cook', position: 'RB', price: 3.5, team: 'New York Jets' },
    { name: 'Garrett Wilson', position: 'WR', price: 5.0, team: 'New York Jets' },
    { name: 'Allen Lazard', position: 'WR', price: 3.5, team: 'New York Jets' },
    { name: 'Tyler Conklin', position: 'TE', price: 3.0, team: 'New York Jets' },
    { name: 'Greg Zuerlein', position: 'K', price: 3.0, team: 'New York Jets' },
    { name: 'New York Jets D/ST', position: 'DST', price: 3.5, team: 'New York Jets' },
    
    // Philadelphia Eagles
    { name: 'Jalen Hurts', position: 'QB', price: 7.5, team: 'Philadelphia Eagles' },
    { name: 'D\'Andre Swift', position: 'RB', price: 4.5, team: 'Philadelphia Eagles' },
    { name: 'A.J. Brown', position: 'WR', price: 6.0, team: 'Philadelphia Eagles' },
    { name: 'DeVonta Smith', position: 'WR', price: 5.0, team: 'Philadelphia Eagles' },
    { name: 'Dallas Goedert', position: 'TE', price: 4.5, team: 'Philadelphia Eagles' },
    { name: 'Jake Elliott', position: 'K', price: 3.0, team: 'Philadelphia Eagles' },
    { name: 'Philadelphia Eagles D/ST', position: 'DST', price: 3.5, team: 'Philadelphia Eagles' },
    
    // Pittsburgh Steelers
    { name: 'Kenny Pickett', position: 'QB', price: 4.0, team: 'Pittsburgh Steelers' },
    { name: 'Najee Harris', position: 'RB', price: 4.5, team: 'Pittsburgh Steelers' },
    { name: 'Jaylen Warren', position: 'RB', price: 3.5, team: 'Pittsburgh Steelers' },
    { name: 'Diontae Johnson', position: 'WR', price: 4.0, team: 'Pittsburgh Steelers' },
    { name: 'George Pickens', position: 'WR', price: 3.5, team: 'Pittsburgh Steelers' },
    { name: 'Pat Freiermuth', position: 'TE', price: 3.5, team: 'Pittsburgh Steelers' },
    { name: 'Chris Boswell', position: 'K', price: 3.0, team: 'Pittsburgh Steelers' },
    { name: 'Pittsburgh Steelers D/ST', position: 'DST', price: 3.5, team: 'Pittsburgh Steelers' },
    
    // San Francisco 49ers
    { name: 'Brock Purdy', position: 'QB', price: 5.0, team: 'San Francisco 49ers' },
    { name: 'Christian McCaffrey', position: 'RB', price: 7.0, team: 'San Francisco 49ers' },
    { name: 'Deebo Samuel', position: 'WR', price: 5.5, team: 'San Francisco 49ers' },
    { name: 'Brandon Aiyuk', position: 'WR', price: 4.5, team: 'San Francisco 49ers' },
    { name: 'George Kittle', position: 'TE', price: 5.5, team: 'San Francisco 49ers' },
    { name: 'Jake Moody', position: 'K', price: 3.0, team: 'San Francisco 49ers' },
    { name: 'San Francisco 49ers D/ST', position: 'DST', price: 4.0, team: 'San Francisco 49ers' },
    
    // Seattle Seahawks
    { name: 'Geno Smith', position: 'QB', price: 4.5, team: 'Seattle Seahawks' },
    { name: 'Kenneth Walker III', position: 'RB', price: 4.5, team: 'Seattle Seahawks' },
    { name: 'DK Metcalf', position: 'WR', price: 5.0, team: 'Seattle Seahawks' },
    { name: 'Tyler Lockett', position: 'WR', price: 4.0, team: 'Seattle Seahawks' },
    { name: 'Noah Fant', position: 'TE', price: 3.0, team: 'Seattle Seahawks' },
    { name: 'Jason Myers', position: 'K', price: 3.0, team: 'Seattle Seahawks' },
    { name: 'Seattle Seahawks D/ST', position: 'DST', price: 3.0, team: 'Seattle Seahawks' },
    
    // Tampa Bay Buccaneers
    { name: 'Baker Mayfield', position: 'QB', price: 4.0, team: 'Tampa Bay Buccaneers' },
    { name: 'Rachaad White', position: 'RB', price: 4.0, team: 'Tampa Bay Buccaneers' },
    { name: 'Mike Evans', position: 'WR', price: 4.5, team: 'Tampa Bay Buccaneers' },
    { name: 'Chris Godwin', position: 'WR', price: 4.0, team: 'Tampa Bay Buccaneers' },
    { name: 'Cade Otton', position: 'TE', price: 3.0, team: 'Tampa Bay Buccaneers' },
    { name: 'Chase McLaughlin', position: 'K', price: 3.0, team: 'Tampa Bay Buccaneers' },
    { name: 'Tampa Bay Buccaneers D/ST', position: 'DST', price: 3.0, team: 'Tampa Bay Buccaneers' },
    
    // Tennessee Titans
    { name: 'Will Levis', position: 'QB', price: 3.5, team: 'Tennessee Titans' },
    { name: 'Derrick Henry', position: 'RB', price: 6.0, team: 'Tennessee Titans' },
    { name: 'DeAndre Hopkins', position: 'WR', price: 5.0, team: 'Tennessee Titans' },
    { name: 'Treylon Burks', position: 'WR', price: 3.5, team: 'Tennessee Titans' },
    { name: 'Chigoziem Okonkwo', position: 'TE', price: 3.0, team: 'Tennessee Titans' },
    { name: 'Nick Folk', position: 'K', price: 3.0, team: 'Tennessee Titans' },
    { name: 'Tennessee Titans D/ST', position: 'DST', price: 3.0, team: 'Tennessee Titans' },
    
    // Washington Commanders
    { name: 'Sam Howell', position: 'QB', price: 3.5, team: 'Washington Commanders' },
    { name: 'Brian Robinson Jr.', position: 'RB', price: 4.0, team: 'Washington Commanders' },
    { name: 'Antonio Gibson', position: 'RB', price: 3.5, team: 'Washington Commanders' },
    { name: 'Terry McLaurin', position: 'WR', price: 4.5, team: 'Washington Commanders' },
    { name: 'Curtis Samuel', position: 'WR', price: 3.5, team: 'Washington Commanders' },
    { name: 'Logan Thomas', position: 'TE', price: 3.0, team: 'Washington Commanders' },
    { name: 'Joey Slye', position: 'K', price: 3.0, team: 'Washington Commanders' },
    { name: 'Washington Commanders D/ST', position: 'DST', price: 3.0, team: 'Washington Commanders' }
];

// Sample player stats data
const samplePlayerStats = [
    // Kyler Murray stats
    { player_name: 'Kyler Murray', team: 'Arizona Cardinals', game_date: '2023-09-10', opponent: 'Washington Commanders', is_home: true, 
      passing_yards: 316, passing_tds: 2, passing_ints: 1, rushing_yards: 46, rushing_tds: 0 },
    { player_name: 'Kyler Murray', team: 'Arizona Cardinals', game_date: '2023-09-17', opponent: 'New York Giants', is_home: false, 
      passing_yards: 277, passing_tds: 1, passing_ints: 0, rushing_yards: 28, rushing_tds: 1 },
    { player_name: 'Kyler Murray', team: 'Arizona Cardinals', game_date: '2023-09-24', opponent: 'Dallas Cowboys', is_home: true, 
      passing_yards: 249, passing_tds: 0, passing_ints: 1, rushing_yards: 31, rushing_tds: 0 },
    
    // James Conner stats
    { player_name: 'James Conner', team: 'Arizona Cardinals', game_date: '2023-09-10', opponent: 'Washington Commanders', is_home: true, 
      rushing_yards: 62, rushing_tds: 0, receptions: 2, receiving_yards: 12, receiving_tds: 0 },
    { player_name: 'James Conner', team: 'Arizona Cardinals', game_date: '2023-09-17', opponent: 'New York Giants', is_home: false, 
      rushing_yards: 106, rushing_tds: 1, receptions: 1, receiving_yards: 5, receiving_tds: 0 },
    { player_name: 'James Conner', team: 'Arizona Cardinals', game_date: '2023-09-24', opponent: 'Dallas Cowboys', is_home: true, 
      rushing_yards: 98, rushing_tds: 1, receptions: 3, receiving_yards: 18, receiving_tds: 0 },
    
    // Patrick Mahomes stats
    { player_name: 'Patrick Mahomes', team: 'Kansas City Chiefs', game_date: '2023-09-07', opponent: 'Detroit Lions', is_home: true, 
      passing_yards: 226, passing_tds: 2, passing_ints: 0, rushing_yards: 45, rushing_tds: 0 },
    { player_name: 'Patrick Mahomes', team: 'Kansas City Chiefs', game_date: '2023-09-17', opponent: 'Jacksonville Jaguars', is_home: false, 
      passing_yards: 305, passing_tds: 2, passing_ints: 0, rushing_yards: 30, rushing_tds: 0 },
    { player_name: 'Patrick Mahomes', team: 'Kansas City Chiefs', game_date: '2023-09-24', opponent: 'Chicago Bears', is_home: true, 
      passing_yards: 272, passing_tds: 3, passing_ints: 0, rushing_yards: 28, rushing_tds: 0 },
    
    // Travis Kelce stats
    { player_name: 'Travis Kelce', team: 'Kansas City Chiefs', game_date: '2023-09-07', opponent: 'Detroit Lions', is_home: true, 
      receptions: 6, receiving_yards: 60, receiving_tds: 0 },
    { player_name: 'Travis Kelce', team: 'Kansas City Chiefs', game_date: '2023-09-17', opponent: 'Jacksonville Jaguars', is_home: false, 
      receptions: 9, receiving_yards: 69, receiving_tds: 1 },
    { player_name: 'Travis Kelce', team: 'Kansas City Chiefs', game_date: '2023-09-24', opponent: 'Chicago Bears', is_home: true, 
      receptions: 7, receiving_yards: 69, receiving_tds: 1 },
    
    // Josh Allen stats
    { player_name: 'Josh Allen', team: 'Buffalo Bills', game_date: '2023-09-11', opponent: 'New York Jets', is_home: false, 
      passing_yards: 236, passing_tds: 1, passing_ints: 3, rushing_yards: -2, rushing_tds: 0 },
    { player_name: 'Josh Allen', team: 'Buffalo Bills', game_date: '2023-09-17', opponent: 'Las Vegas Raiders', is_home: true, 
      passing_yards: 274, passing_tds: 3, passing_ints: 0, rushing_yards: 7, rushing_tds: 0 },
    { player_name: 'Josh Allen', team: 'Buffalo Bills', game_date: '2023-09-24', opponent: 'Washington Commanders', is_home: true, 
      passing_yards: 218, passing_tds: 1, passing_ints: 0, rushing_yards: 46, rushing_tds: 1 },
    
    // Stefon Diggs stats
    { player_name: 'Stefon Diggs', team: 'Buffalo Bills', game_date: '2023-09-11', opponent: 'New York Jets', is_home: false, 
      receptions: 10, receiving_yards: 102, receiving_tds: 1 },
    { player_name: 'Stefon Diggs', team: 'Buffalo Bills', game_date: '2023-09-17', opponent: 'Las Vegas Raiders', is_home: true, 
      receptions: 8, receiving_yards: 66, receiving_tds: 0 },
    { player_name: 'Stefon Diggs', team: 'Buffalo Bills', game_date: '2023-09-24', opponent: 'Washington Commanders', is_home: true, 
      receptions: 8, receiving_yards: 111, receiving_tds: 0 },
    
    // Christian McCaffrey stats
    { player_name: 'Christian McCaffrey', team: 'San Francisco 49ers', game_date: '2023-09-10', opponent: 'Pittsburgh Steelers', is_home: true, 
      rushing_yards: 152, rushing_tds: 1, receptions: 3, receiving_yards: 17, receiving_tds: 0 },
    { player_name: 'Christian McCaffrey', team: 'San Francisco 49ers', game_date: '2023-09-17', opponent: 'Los Angeles Rams', is_home: false, 
      rushing_yards: 116, rushing_tds: 1, receptions: 5, receiving_yards: 19, receiving_tds: 0 },
    { player_name: 'Christian McCaffrey', team: 'San Francisco 49ers', game_date: '2023-09-21', opponent: 'New York Giants', is_home: true, 
      rushing_yards: 85, rushing_tds: 1, receptions: 3, receiving_yards: 34, receiving_tds: 0 },
    
    // Justin Jefferson stats
    { player_name: 'Justin Jefferson', team: 'Minnesota Vikings', game_date: '2023-09-10', opponent: 'Tampa Bay Buccaneers', is_home: true, 
      receptions: 6, receiving_yards: 66, receiving_tds: 0 },
    { player_name: 'Justin Jefferson', team: 'Minnesota Vikings', game_date: '2023-09-17', opponent: 'Philadelphia Eagles', is_home: false, 
      receptions: 11, receiving_yards: 159, receiving_tds: 0 },
    { player_name: 'Justin Jefferson', team: 'Minnesota Vikings', game_date: '2023-09-24', opponent: 'Los Angeles Chargers', is_home: true, 
      receptions: 7, receiving_yards: 149, receiving_tds: 1 },
    
    // Jalen Hurts stats
    { player_name: 'Jalen Hurts', team: 'Philadelphia Eagles', game_date: '2023-09-10', opponent: 'New England Patriots', is_home: true, 
      passing_yards: 170, passing_tds: 1, passing_ints: 0, rushing_yards: 37, rushing_tds: 0 },
    { player_name: 'Jalen Hurts', team: 'Philadelphia Eagles', game_date: '2023-09-17', opponent: 'Minnesota Vikings', is_home: true, 
      passing_yards: 193, passing_tds: 1, passing_ints: 0, rushing_yards: 35, rushing_tds: 1 },
    { player_name: 'Jalen Hurts', team: 'Philadelphia Eagles', game_date: '2023-09-25', opponent: 'Tampa Bay Buccaneers', is_home: false, 
      passing_yards: 277, passing_tds: 2, passing_ints: 0, rushing_yards: 28, rushing_tds: 0 },
    
    // A.J. Brown stats
    { player_name: 'A.J. Brown', team: 'Philadelphia Eagles', game_date: '2023-09-10', opponent: 'New England Patriots', is_home: true, 
      receptions: 7, receiving_yards: 79, receiving_tds: 0 },
    { player_name: 'A.J. Brown', team: 'Philadelphia Eagles', game_date: '2023-09-17', opponent: 'Minnesota Vikings', is_home: true, 
      receptions: 4, receiving_yards: 29, receiving_tds: 0 },
    { player_name: 'A.J. Brown', team: 'Philadelphia Eagles', game_date: '2023-09-25', opponent: 'Tampa Bay Buccaneers', is_home: false, 
      receptions: 9, receiving_yards: 131, receiving_tds: 0 }
];

async function seedDatabase() {
    try {
        await pool.query('BEGIN');

        // Insert teams
        for (const team of teams) {
            await pool.query(
                'INSERT INTO teams (name, short_name, wins, losses, points_for, points_against) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO UPDATE SET short_name = $2, wins = $3, losses = $4, points_for = $5, points_against = $6',
                [team.name, team.short_name, team.wins, team.losses, team.points_for, team.points_against]
            );
        }

        // Get team IDs
        const { rows: teamRows } = await pool.query('SELECT id, name FROM teams');
        const teamMap = new Map(teamRows.map(row => [row.name, row.id]));

        // Insert sample players
        for (const player of samplePlayers) {
            const teamId = teamMap.get(player.team);
            await pool.query(
                'INSERT INTO players (name, position, team_id, price, jersey_number, height, weight, age) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (name, team_id) DO UPDATE SET position = $2, price = $4, jersey_number = $5, height = $6, weight = $7, age = $8',
                [player.name, player.position, teamId, player.price, player.jersey_number, player.height, player.weight, player.age]
            );
        }

        // Get player IDs
        const { rows: playerRows } = await pool.query('SELECT id, name, team_id FROM players');
        const playerMap = new Map();
        playerRows.forEach(row => {
            const teamName = teams.find(t => t.id === row.team_id)?.name;
            if (teamName) {
                playerMap.set(`${row.name}-${teamName}`, row.id);
            }
        });

        // Insert player stats
        for (const stat of samplePlayerStats) {
            const playerId = playerMap.get(`${stat.player_name}-${stat.team}`);
            const opponentId = teamMap.get(stat.opponent);
            
            if (playerId && opponentId) {
                await pool.query(
                    `INSERT INTO player_stats (
                        player_id, game_date, opponent_id, is_home, 
                        passing_yards, passing_tds, passing_ints, 
                        rushing_yards, rushing_tds, 
                        receiving_yards, receiving_tds, receptions, 
                        fumbles, fumbles_lost, 
                        tackles, sacks, 
                        interceptions, interceptions_tds, 
                        fumbles_recovered, fumbles_recovered_tds, 
                        safeties, 
                        field_goals_made, field_goals_attempted, 
                        extra_points_made, extra_points_attempted
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
                    ) ON CONFLICT (player_id, game_date) DO NOTHING`,
                    [
                        playerId, stat.game_date, opponentId, stat.is_home,
                        stat.passing_yards || 0, stat.passing_tds || 0, stat.passing_ints || 0,
                        stat.rushing_yards || 0, stat.rushing_tds || 0,
                        stat.receiving_yards || 0, stat.receiving_tds || 0, stat.receptions || 0,
                        stat.fumbles || 0, stat.fumbles_lost || 0,
                        stat.tackles || 0, stat.sacks || 0,
                        stat.interceptions || 0, stat.interceptions_tds || 0,
                        stat.fumbles_recovered || 0, stat.fumbles_recovered_tds || 0,
                        stat.safeties || 0,
                        stat.field_goals_made || 0, stat.field_goals_attempted || 0,
                        stat.extra_points_made || 0, stat.extra_points_attempted || 0
                    ]
                );
            }
        }

        await pool.query('COMMIT');
        console.log('Database seeded successfully with NFL teams, players, and stats');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seedDatabase(); 