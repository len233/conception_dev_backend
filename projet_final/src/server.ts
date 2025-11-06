import App from './app';

async function main(): Promise<void> {
  try {
    const app = new App();
    await app.listen();
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.exit(1);
  });
}

export default main;
