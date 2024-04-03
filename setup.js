// setup.js
import crypto from 'crypto';
import fs from 'fs';
import { path } from 'path';

export const sessionSecret = crypto.randomBytes(64).toString('hex')

const setupFile = path.join(process.cwd(), '.setup.complete');

if (fs.existsSync(setupFile)) {
  console.info('setup.js has already run, exiting.');
  process.exit(0);
}

const filepath = '.env'
const secret = `SESSION_SECRET=${sessionSecret}\n`

fs.writeFileSync(filepath, secret, { flag: 'a' })
fs.appendFileSync(filepath, '\n')

if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
  fs.copyFileSync(envExamplePath, path.join(process.cwd(), '.env'));
}

const setupComplete = new Date().toISOString();

fs.writeFileSync(setupFile, setupComplete, { flag: 'w' });

console.info('setup.js has run successfully. SESSION_SECRET is saved in .env files.');
console.info('Please make sure to exclude both .env from version control.');