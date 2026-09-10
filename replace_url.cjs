const fs = require('fs');
const path = require('path');

const directory = '/Users/hemanthkancharla/Documents/zewotech/helpinghands/helpinghands-main/src';
const search = 'http://localhost:5000';
const replacement = 'https://helpinghandsbe.vercel.app';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(search)) {
        content = content.replace(new RegExp(search, 'g'), replacement);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(directory);
