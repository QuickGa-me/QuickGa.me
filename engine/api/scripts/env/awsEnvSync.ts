import {exec} from 'child_process';
import fs from 'fs';
import yargs from 'yargs';

/*
 * This script is used to read the your .env.X file and sync it with aws SSM
 * It requires the aws cli to be installed
 * as well as a valid aws access token existing on your machine.
 * It will write values to SSM encrypted with the key specified in the env-config.json file.
 * These values can then be used in the API (see secureConfig.ts)
 * */

async function run() {
  const env = yargs.argv._[0];

  const configStr = fs.readFileSync('./env-config.json', {encoding: 'utf8'});
  const configBody: {
    keyDefinitionOutput: string;
    kmsKeyDescription: string;
    kmsKeyId?: string;
    region: string;
  } = JSON.parse(configStr);

  if (yargs.argv._[0] === 'create-key') {
    await cExec(`aws kms create-key --description ${configBody.kmsKeyDescription} --region ${configBody.region}`);
    console.log('Copy the KeyId above into your env-config.json file as kmsKeyId');
    return;
  }
  const envFile = fs.readFileSync(`./.env.${env}`, {encoding: 'utf8'});

  if (!env || !envFile) {
    throw new Error('Environment not found');
  }

  const envFileContents: {[key: string]: string} = require('dotenv').parse(envFile);

  if (configBody.keyDefinitionOutput) {
    fs.writeFileSync(
      configBody.keyDefinitionOutput,
      `// tslint:disable
export const EnvKeys=[
${Object.keys(envFileContents)
  .filter((a) => !a.startsWith('-'))
  .map((k) => `'${k}'`)
  .join(',\r\n')}];
export type EnvKeysTypes=
${Object.keys(envFileContents)
  .map((k) => `'${k.replace(/^-/, '')}'`)
  .join(' |\r\n')}`,
      {
        encoding: 'utf8',
      }
    );
    console.log('Wrote Key Definition File.');
  }
  if (yargs.argv._[1] !== 'preview') {
    if (!configBody.kmsKeyId) {
      console.log(
        'You are missing your kmsKeyId from env-config.json. Please run aws-env-deploy create-key to create a new one.'
      );
      return;
    }
    for (const key of Object.keys(envFileContents)) {
      if (key.startsWith('-')) continue;
      console.log(`writing key /${configBody.kmsKeyDescription}-${env}/${key} to aws`);
      const command = `aws ssm put-parameter --name /${configBody.kmsKeyDescription}-${env}/${key} --value="${envFileContents[key]}" --type SecureString --key-id "${configBody.kmsKeyId}" --region ${configBody.region} --overwrite`;
      await cExec(command);
    }
    return;
  }

  return;
}
async function cExec(command: string) {
  return new Promise((res, rej) => {
    const process = exec(command);

    process.stdout.on('data', (data) => {
      console.log('stdout: ' + data.toString());
    });

    process.stderr.on('data', (data) => {
      console.log('stderr: ' + data.toString());
      rej();
    });

    process.on('exit', (code) => {
      console.log('child process exited with code ' + code?.toString());
      res();
    });
  });
}

run()
  .then((a) => console.log('done'))
  .catch((e) => console.error(e));
