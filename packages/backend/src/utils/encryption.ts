import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export interface EncryptedData {
  encrypted: string;
  salt: string;
}

export function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

export function deriveKey(password: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
}

export function encrypt(data: string, masterKey: string): EncryptedData {
  try {
    const salt = generateSalt();
    const key = deriveKey(masterKey, salt);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from(salt, 'hex'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    const result = iv.toString('hex') + encrypted + authTag.toString('hex');
    
    return {
      encrypted: result,
      salt: salt
    };
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
}

export function decrypt(encryptedData: string, salt: string, masterKey: string): string {
  try {
    const key = deriveKey(masterKey, salt);
    
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(encryptedData.slice(-TAG_LENGTH * 2), 'hex');
    const encrypted = encryptedData.slice(IV_LENGTH * 2, -TAG_LENGTH * 2);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from(salt, 'hex'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

export function createOneTimeToken(): { token: string; hash: string } {
  const token = generateSecureToken(32);
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

export function verifyOneTimeToken(token: string, hash: string): boolean {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return tokenHash === hash;
}
