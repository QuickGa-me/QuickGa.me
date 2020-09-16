import {Config} from '@serverCommon/config/config';

async function main() {
  console.log('start', Config.mongoDbName);
}

main()
  .catch((e) => console.error(e))
  .then((e) => process.exit());
