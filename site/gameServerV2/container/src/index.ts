import {ServerSocket} from './serverSocket';
import {ServerUtils} from './serverUtils';

async function main() {
  await ServerUtils.updateLoadBalancer('abc123');

  const serverSocket = new ServerSocket();
  serverSocket.start({onJoin: () => {}, onLeave: () => {}, onMessage: () => {}});
  console.log('setup');
}

main()
  .then(() => {})
  .catch(async (ex: Error) => {
    console.error(ex);
  });
