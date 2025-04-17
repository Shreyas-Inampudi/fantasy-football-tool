-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(3) NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    points_for INTEGER DEFAULT 0,
    points_against INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(2) NOT NULL,
    team_id INTEGER REFERENCES teams(id),
    price DECIMAL(10,2) NOT NULL,
    jersey_number INTEGER,
    height VARCHAR(10),
    weight INTEGER,
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    game_date DATE NOT NULL,
    opponent_id INTEGER REFERENCES teams(id),
    is_home BOOLEAN NOT NULL,
    passing_yards INTEGER DEFAULT 0,
    passing_tds INTEGER DEFAULT 0,
    passing_ints INTEGER DEFAULT 0,
    rushing_yards INTEGER DEFAULT 0,
    rushing_tds INTEGER DEFAULT 0,
    receiving_yards INTEGER DEFAULT 0,
    receiving_tds INTEGER DEFAULT 0,
    receptions INTEGER DEFAULT 0,
    fumbles INTEGER DEFAULT 0,
    fumbles_lost INTEGER DEFAULT 0,
    tackles INTEGER DEFAULT 0,
    sacks INTEGER DEFAULT 0,
    interceptions INTEGER DEFAULT 0,
    interceptions_tds INTEGER DEFAULT 0,
    fumbles_recovered INTEGER DEFAULT 0,
    fumbles_recovered_tds INTEGER DEFAULT 0,
    safeties INTEGER DEFAULT 0,
    field_goals_made INTEGER DEFAULT 0,
    field_goals_attempted INTEGER DEFAULT 0,
    extra_points_made INTEGER DEFAULT 0,
    extra_points_attempted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_teams table
CREATE TABLE IF NOT EXISTS user_teams (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_team_players table
CREATE TABLE IF NOT EXISTS user_team_players (
    id SERIAL PRIMARY KEY,
    user_team_id INTEGER REFERENCES user_teams(id),
    player_id INTEGER REFERENCES players(id),
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    game_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_game_date ON player_stats(game_date);
CREATE INDEX IF NOT EXISTS idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_team_players_user_team_id ON user_team_players(user_team_id);
CREATE INDEX IF NOT EXISTS idx_user_team_players_player_id ON user_team_players(player_id);
CREATE INDEX IF NOT EXISTS idx_games_season_week ON games(season, week);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_updated_at
    BEFORE UPDATE ON player_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_teams_updated_at
    BEFORE UPDATE ON user_teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_team_players_updated_at
    BEFORE UPDATE ON user_team_players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 