// Deployment script to copy only dist folder contents
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination paths
const source = path.join(__dirname, '..', 'dist');
const destination = path.join(__dirname, 'deployment');

// Copy dist folder contents to deployment folder
fs.copy(source, destination)
  .then(() => {
    console.log('Frontend files copied successfully for deployment!');
    console.log('Only the contents of the dist folder will be deployed.');
    console.log('Deployment folder location:', destination);
  })
  .catch(err => {
    console.error('Error copying files:', err);
  });