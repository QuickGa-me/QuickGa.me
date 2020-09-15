import ECS from 'aws-sdk/clients/ecs';

async function main() {
  console.log('starting1');
  const ecs = new ECS({region: 'us-west-2'});
  console.log('starting2');
  for (let i = 0; i < 10; i++) {
      console.log(i)
    const result = await ecs
      .runTask({
        cluster: 'arn:aws:ecs:us-west-2:114394156384:cluster/qg-gs-cluster',
        count: 10,
        launchType: 'FARGATE',
        taskDefinition: 'qg-gs:2',
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [
              'subnet-05c7308a3b6cdb68d',
              'subnet-0c4ef501b6cbbb550',
              'subnet-0e63966ebc917bade',
              'subnet-0e63966ebc917bade',
            ],
            securityGroups: ['sg-0cb453bc8f62d40ab'],
            assignPublicIp: 'ENABLED',
          },
        },
      })
      .promise();
  }
}

main()
  .then(() => {})
  .catch(async (ex: Error) => {
    console.error(ex);
  });
