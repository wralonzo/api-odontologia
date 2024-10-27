import app from './app/app.js';

const PORT = process.env.PORT || 8080;

function listenAsync(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, (error) => {
      if (error) {
        return reject(error);
      }
      resolve(server);
    });
  });
}

async function init() {
  try {
    await listenAsync(PORT);
    console.log(`Initialization successful, server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error occurred during initialization:', error);
  }
}

init().catch(error => {
  console.error('Unexpected error during initialization:', error);
});