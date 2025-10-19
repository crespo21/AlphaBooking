#!/usr/bin/env node

/**
 * Database Setup Script for AlphaBooking
 * 
 * This script helps set up the database schema and sample data.
 * Run this after setting up your Supabase project.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 AlphaBooking Database Setup');
console.log('==============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your Supabase credentials:');
  console.log('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your_anon_key_here\n');
  process.exit(1);
}

// Read the schema file
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.log('❌ schema.sql file not found!');
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('✅ Found .env.local file');
console.log('✅ Found schema.sql file');
console.log('\n📋 Next steps:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy and paste the following schema:');
console.log('\n' + '='.repeat(50));
console.log(schema);
console.log('='.repeat(50));
console.log('\n4. Click "Run" to execute the schema');
console.log('5. Start your development server: npm run dev');
console.log('\n🎉 Your database will be ready!');
