#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 LearnSnap Setup');
console.log('==================');
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setup() {
  // Check if .env already exists
  if (fs.existsSync('.env')) {
    console.log('✅ .env file already exists');
    
    rl.question('Do you want to update it? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        createEnvFile();
      } else {
        console.log('👍 Setup complete! Run "npm start" to launch LearnSnap');
        rl.close();
      }
    });
  } else {
    createEnvFile();
  }
}

function createEnvFile() {
  console.log('');
  console.log('📝 Setting up your environment file...');
  console.log('');
  console.log('To use LearnSnap, you need a Google AI API key (it\'s free!)');
  console.log('');
  console.log('Get your API key:');
  console.log('1. Visit: https://makersuite.google.com/app/apikey');
  console.log('2. Sign in with your Google account');
  console.log('3. Click "Create API key"');
  console.log('4. Copy your API key');
  console.log('');

  rl.question('Enter your Google AI API key: ', (apiKey) => {
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ API key is required. Please run setup again.');
      rl.close();
      return;
    }

    rl.question('Enter port number (default: 3000): ', (port) => {
      const portNumber = port || '3000';
      
      const envContent = `# LearnSnap Environment Configuration

# Google AI API Key (Required)
GEMINI_API_KEY=${apiKey.trim()}

# Server Configuration
PORT=${portNumber}
NODE_ENV=development

# Optional: Custom configuration
# MAX_FILE_SIZE=104857600
# MAX_CONTENT_LENGTH=5242880
`;

      fs.writeFileSync('.env', envContent);
      
      console.log('');
      console.log('✅ Environment file created successfully!');
      console.log('');
      console.log('🚀 You can now start LearnSnap with:');
      console.log('   npm start');
      console.log('');
      console.log('📖 Then open http://localhost:' + portNumber + ' in your browser');
      console.log('');
      
      rl.close();
    });
  });
}

setup(); 