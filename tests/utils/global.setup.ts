import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('\n--- Verifying Docker Environment ---');

  // 1. Check if Docker is installed
  try {
    execSync('docker --version', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('🛑 Docker is not installed or not found in your system PATH.', { cause: error });
  }

  // 2. Check if the Docker Daemon is actively running
  try {
    execSync('docker info', { stdio: 'ignore' });
  } catch (error) {

    throw new Error('🛑 Docker daemon is not running. Please open Docker Desktop / start the daemon.', { cause: error });
  }

  // 3. Check if the application is ALREADY running (Local Dev Mode)
  try {
    const response = await fetch('http://localhost:4101/health');
    if (response.ok) {
      console.log('🐳 App is already running. Skipping Docker startup.');
      process.env.SKIP_DOCKER_TEARDOWN = 'true';
      return;
    }
  } catch {
    // Fetch failed, app might not be running. Proceed with Docker startup.
  }

  // 4. Start Docker Compose in detached mode
  console.log('🐳 Starting Docker containers...');
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
    process.env.SKIP_DOCKER_TEARDOWN = 'false';
  } catch (error) {
    throw new Error('🛑 Failed to start Docker containers. Check your docker-compose.yml file.', { cause: error });
  }

  // 5. Poll the health endpoint until the app is fully ready
  console.log('⏳ Waiting for application to become healthy...');
  const maxRetries = 60;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch('http://localhost:4101/health');
      if (res.ok) {
        console.log('✅ Application is healthy and ready!');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return;
      }
    } catch {
      // Endpoint not up yet, ignore and wait
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('🛑 Application failed to become healthy within 60 seconds.');
}