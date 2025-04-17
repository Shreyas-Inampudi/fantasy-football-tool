const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: process.env.REACT_APP_DB_USER,
  host: process.env.REACT_APP_DB_HOST,
  database: process.env.REACT_APP_DB_NAME,
  password: process.env.REACT_APP_DB_PASSWORD,
  port: process.env.REACT_APP_DB_PORT,
  ssl: process.env.REACT_APP_DB_SSL === 'true'
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Read and execute migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await client.query(migrationSQL);
    console.log('Database schema initialized successfully');
    
    // Add some initial data if needed
    // await seedInitialData(client);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to seed initial data (commented out for now)
/*
async function seedInitialData(client) {
  // Add initial teams
  const teams = [
    { name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL', conference: 'NFC', division: 'East' },
    { name: 'Eagles', city: 'Philadelphia', abbreviation: 'PHI', conference: 'NFC', division: 'East' },
    // Add more teams as needed
  ];
  
  for (const team of teams) {
    await client.query(
      'INSERT INTO teams (name, city, abbreviation, conference, division) VALUES ($1, $2, $3, $4, $5)',
      [team.name, team.city, team.abbreviation, team.conference, team.division]
    );
  }
}
*/

// Export the initialization function
module.exports = {
  initializeDatabase
}; 