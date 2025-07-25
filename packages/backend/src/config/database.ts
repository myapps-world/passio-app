import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'passio_db',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

let pool: mysql.Pool;

export async function connectDatabase(): Promise<void> {
  try {
    pool = mysql.createPool(config);
    
    // Test the connection
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export function getDatabase(): mysql.Pool {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
}
