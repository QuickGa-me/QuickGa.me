export const Todo = 1;
/*import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import {SecurityGroup, Vpc} from '@aws-cdk/aws-ec2';
import {Repository} from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import {Fn} from '@aws-cdk/core';
import {Role} from '@aws-cdk/aws-iam';*/
/*
class GameServerECS extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /!*
    const vpc = Vpc.fromLookup(this, id + 'VPC', {vpcName: 'quickgame-vpc'});
    const cluster = new ecs.Cluster(this, id + 'Ec2Cluster', {
      vpc,
    });

    const autoScalingGroup = cluster.addCapacity(id + 'DefaultAutoScalingGroup', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      maxCapacity: 1,
      minCapacity: 1,
    });

    autoScalingGroup.addSecurityGroup(
      SecurityGroup.fromSecurityGroupId(
        this,
        id + 'SecurityGroup',
        Fn.importValue('BOUNCEBLOCKPARTYSTORAGESECURITYGROUP')
      )
    );

    // create a task definition with CloudWatch Logs
    const logging = new ecs.AwsLogDriver({streamPrefix: id});

    const taskDef = new ecs.Ec2TaskDefinition(this, id + 'MyTaskDefinition', {
      taskRole: Role.fromRoleArn(this, id + 'Role', Fn.importValue('BOUNCEBLOCKPARTYROLE')),
    });
    taskDef.addContainer(id + 'AppContainer', {
      image: ecs.ContainerImage.fromEcrRepository(
        Repository.fromRepositoryName(this, 'bounceblockparty-chatbot', 'bounceblockparty-chatbot')
      ),
      memoryLimitMiB: 512,
      logging,
      environment: {
        REDIS_HOST: Fn.importValue('BOUNCEBLOCKPARTYREDISHOST'),
      },
    });

    // Instantiate ECS Service with just cluster and image
    new ecs.Ec2Service(this, id + 'Ec2Service', {
      cluster,
      taskDefinition: taskDef,
      minHealthyPercent: 0,
      maxHealthyPercent: 100,
      desiredCount: 1,
    });*!/
  }
}

const app = new cdk.App();
new GameServerECS(app, 'QuickGame-GameServer', {
  env: {region: 'us-west-2', account: '114394156384'},
});
app.synth();*/

/*
create vpc
create redis
create alb
  create listnere
no target groups
create cluster
 * */
