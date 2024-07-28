import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the package.json file
const packageJsonPath = path.join(__dirname, '../package.json');

// Import the ES6 module dynamically
async function updateVersion() {
  try {
    // Dynamically import your ES6 module
    const modulePath = path.join(__dirname, '../src/quikchat.js');
    const { default: quikchat } = await import(modulePath);

    // Create an instance of the class and get the version
    //const quikChatInstance = new quikchat();
    const version = quikchat.version().version; //static method

    // Read the existing package.json file
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    // Update the version
    packageJson.version = version;

    // Write the updated package.json file back to disk
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

    console.log(`Updated package.json to version ${version}`);
  } catch (error) {
    console.error('Error updating version:', error);
  }
}

updateVersion();
