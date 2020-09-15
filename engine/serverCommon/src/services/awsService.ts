import {Config} from '../config/config';
import {SES, config, Lambda} from 'aws-sdk';

config.region = 'us-west-2';
const lambda = new Lambda(process.env.IS_OFFLINE ? {endpoint: 'http://0.0.0.0:3002', region: 'us-west-2'} : {});

export class AwsService {
  static async sendDebugEmail(subject: string, message: string) {
    if (Config.isOffline) {
      console.error('sal@dested.com', Config.env + ' - ' + subject, message);
      return;
    }
    await AwsService.sendEmail('sal@dested.com', Config.env + ' - ' + subject, message);
  }
  static sendEmail(emailAddress: string, subject: string, message: string) {
    const ses = new SES({region: 'us-west-2'});
    const promise = ses
      .sendEmail({
        Destination: {
          ToAddresses: [emailAddress],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: message,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },

        Source: `"QuickGa.me" <connect@doubledatesapp.com>`,
        ReplyToAddresses: ['connect@doubledatesapp.com'],
      })
      .promise();
    return promise;
  }

  static async invokeLambda(name: string) {
    return await lambda.invoke({FunctionName: name, InvocationType: 'Event'}).promise();
  }
}
