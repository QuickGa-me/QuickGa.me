import {EnvKeys, EnvKeysTypes} from './envKeys';
import {SSM} from 'aws-sdk';
import {Parameter} from 'aws-sdk/clients/ssm';
import * as envConfig from '../../../api/env-config.json';
import {chunkArray} from '@common/utils';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

export class SecureConfig {
  static getKey(key: EnvKeysTypes): string {
    return (process.env['-' + key] || process.env[key]) as string;
  }
  static async setup() {
    try {
      if (process.env.IS_OFFLINE) {
        return;
      }
      if (process.env.$$READY) {
        return;
      }
      console.log('setting up kms', process.env.ENV);
      const ssm = new SSM({region: envConfig.region});

      const kmsKeyDescription = envConfig.kmsKeyDescription;

      const keys = EnvKeys.map((k) => `/${kmsKeyDescription}-${process.env.ENV}/${k}`);

      const keyResults: Parameter[] = [];
      for (const chunkOf10Keys of chunkArray(keys, 10)) {
        // console.log(chunkOf10Keys);
        const result = await ssm
          .getParameters({
            Names: chunkOf10Keys,
            WithDecryption: true,
          })
          .promise();
        if (result.Parameters) {
          keyResults.push(...result.Parameters);
        }
      }

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = keyResults.find((p) => p.Name === key)?.Value;
        if (!value) {
          console.log('KEY NOT FOUND', key);
        } else {
          process.env[EnvKeys[i]] = value;
        }
      }
      process.env.$$READY = 'TRUE';
      console.log('done kms');
    } catch (ex) {
      console.error('ENVIRONMENT VARIABLE FAILURE', ex);
    }
  }
}
