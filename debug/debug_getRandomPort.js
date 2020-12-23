// debug file for Server._getAvailablePort

const net = require('net');
let chances = 0;
const getRandomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024);

function isAvailable(port) {
  if (!port) port = getRandomPort();
  if (port < 1024 || port > 65535) port = getRandomPort();
  if (chances > 10) return Promise.reject(new Error('Chances exceeded to 10, not trying again.'));

  return new Promise((resolve, reject) => {
    chances++;

    const timeout = setTimeout(() => reject(new Error(`Port '${port}' is taken, but not resolving`)), 15000).unref();
    const socket = net.createConnection(port, () => {
      clearTimeout(timeout);
      socket.end();

      reject(new Error(`Port '${port}' is taken, try again.`));
    });

    socket.once('error', (error) => {
      if (error.message.includes('connect ECONNREFUSED')) return resolve(port);

      clearTimeout(timeout);
      return reject(error);
    });
  });
}

function tryAgain() {
  isAvailable(6969).then(onSuccess).catch(onError);
}

const onSuccess = (port) => {
  console.log(`port '${port}' is available`);
  process.exit(0);
};

const onError = (error) => {
  if (error.message.includes('taken')) {
    console.log('port \'3621\' was taken, trying again...');
    return tryAgain();
  }

  console.error(error);
  process.exit(1);
};

isAvailable(3621)
  .then(onSuccess)
  .catch(onError);
