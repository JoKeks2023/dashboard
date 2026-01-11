#!/usr/bin/env node
import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('\n🚀 GitHub Release Creator\n');

  // Prüfe ob Git Repository
  try {
    exec('git status');
  } catch {
    console.error('❌ Kein Git Repository gefunden');
    process.exit(1);
  }

  // Prüfe ob uncommitted changes
  const status = exec('git status --porcelain');
  if (status) {
    console.error('❌ Es gibt uncommitted changes. Bitte erst committen.');
    process.exit(1);
  }

  // Hole aktuelle Version
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const currentVersion = packageJson.version;

  console.log(`Aktuelle Version: ${currentVersion}\n`);

  // Frage nach neuer Version
  const newVersion = await ask('Neue Version (z.B. 0.2.0): ');
  
  if (!newVersion.match(/^\d+\.\d+\.\d+$/)) {
    console.error('❌ Ungültiges Versionsformat. Verwende: X.Y.Z');
    process.exit(1);
  }

  // Frage nach Release-Typ
  console.log('\nRelease-Typ:');
  console.log('1. Patch (Bug-Fixes)');
  console.log('2. Minor (New Features)');
  console.log('3. Major (Breaking Changes)');
  const releaseType = await ask('Wähle (1-3): ');

  const releaseTypes = { '1': 'patch', '2': 'minor', '3': 'major' };
  const type = releaseTypes[releaseType] || 'minor';

  rl.close();

  console.log('\n📝 Erstelle Release...\n');

  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ package.json aktualisiert');

  // Git commit
  exec('git add package.json');
  exec(`git commit -m "chore: bump version to ${newVersion}"`);
  console.log('✅ Version committed');

  // Git tag
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`✅ Tag v${newVersion} erstellt`);

  console.log('\n🎉 Release vorbereitet!\n');
  console.log('Nächste Schritte:');
  console.log(`  git push origin main`);
  console.log(`  git push origin v${newVersion}`);
  console.log('\nGitHub Actions wird automatisch:');
  console.log('  - Docker Images bauen');
  console.log('  - Zu GitHub Container Registry pushen');
  console.log('  - GitHub Release erstellen');
}

main().catch(console.error);
