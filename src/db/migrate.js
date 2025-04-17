const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function runMigrations() {
    try {
        // Create migrations table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Get list of migration files
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // Get executed migrations
        const { rows: executedMigrations } = await pool.query(
            'SELECT name FROM migrations'
        );
        const executedMigrationNames = new Set(executedMigrations.map(row => row.name));

        // Run pending migrations
        for (const file of migrationFiles) {
            if (!executedMigrationNames.has(file)) {
                console.log(`Running migration: ${file}`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                await pool.query('BEGIN');
                try {
                    await pool.query(sql);
                    await pool.query(
                        'INSERT INTO migrations (name) VALUES ($1)',
                        [file]
                    );
                    await pool.query('COMMIT');
                    console.log(`Successfully executed migration: ${file}`);
                } catch (error) {
                    await pool.query('ROLLBACK');
                    throw error;
                }
            }
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigrations(); 