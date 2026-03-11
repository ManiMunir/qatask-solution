import { execSync } from 'child_process';

export default async function globalTeardown() {
  if (process.env.SKIP_DOCKER_TEARDOWN === 'true') {
    console.log('\n🐳 Leaving Docker containers running (they were started manually).');
    return;
  }

  console.log('\n--- Tearing down Docker Environment ---');
  try {
    execSync('docker compose down', { stdio: 'inherit' });
    console.log('✅ Docker containers successfully stopped and removed.');
  } catch (error) {
    console.error('⚠️ Failed to stop Docker containers automatically.', error);
  }
}