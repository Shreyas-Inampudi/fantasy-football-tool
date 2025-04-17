const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function setupDatabase() {
    try {
        console.log('Seeding database...');
        await execAsync('node src/db/seed.js');
        
        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();