const fs = require('fs');
const path = require('path');
const { pool } = require('./index');
const bcrypt = require('bcrypt');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting database seeding...');

    // 1. Read Schema
    const schemaPath = path.join(__dirname, '../../../CLAUDE/02_SCHEMA_POSTGRESQL.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await client.query(schemaSql);
    console.log('Schema executed successfully.');

    // 2. Read Seed Data
    const seedPath = path.join(__dirname, '../../../CLAUDE/03_DADOS_EXEMPLO.sql');
    let seedSql = fs.readFileSync(seedPath, 'utf8');

    // 3. Process Password Hashes
    const defaultPassword = 'Bridge@2025';
    const saltRounds = 12;
    const hash = await bcrypt.hash(defaultPassword, saltRounds);
    
    console.log('Hashing passwords...');
    // Replace dummy hashes with real bcrypt hash
    seedSql = seedSql.replace(/\$2b\$12\$dummyhash_[a-z0-9]+/g, hash);

    console.log('Executing seed data...');
    await client.query(seedSql);
    console.log('Seed data executed successfully.');

    console.log('Database seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();
