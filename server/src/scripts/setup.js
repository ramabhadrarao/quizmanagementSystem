// server/src/scripts/setup.js
import fs from 'fs/promises';
import path from 'path';

const createDirectories = async () => {
  const dirs = [
    'src/components/Admin',
    'src/components/Quiz',
    'server/src/services',
    'server/src/scripts',
    'logs'
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.log(`Directory ${dir} already exists`);
    }
  }
};

// Run setup
createDirectories().catch(console.error);