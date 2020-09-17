import fetch from 'node-fetch';
import ELBv2 from 'aws-sdk/clients/elbv2';
import ECS from 'aws-sdk/clients/ecs';

export class ServerUtils {
  static clusterId?: string;
  static taskId?: string;
  static newTargetGroupArn?: string;
  static ruleArn?: string;
  static async updateLoadBalancer(gameId: string) {
    const vpcId = 'vpc-09e8a4d726daf1209';
    const listenerArn =
      'arn:aws:elasticloadbalancing:us-west-2:114394156384:listener/app/qg-game/2309e2e098572b66/ca4d3d681fc75617';

    const ec2MagicalPath1 = 'http://169.254.170.2/v2/metadata';
    const response1 = await fetch(ec2MagicalPath1);
    const json: MagicResult = await response1.json();
    this.clusterId = json.Cluster;
    this.taskId = json.TaskARN;
    const ipAddress = json.Containers.find((c) => c.KnownStatus === 'RUNNING')!.Networks[0].IPv4Addresses[0] as string;
    console.log(ipAddress);
    const elbv2 = new ELBv2({region: 'us-west-2'});
    const newTargetGroup = await elbv2
      .createTargetGroup({
        HealthCheckEnabled: true,
        HealthCheckIntervalSeconds: 30,
        HealthCheckPath: '/',
        HealthCheckPort: '80',
        HealthCheckProtocol: 'HTTP',
        HealthCheckTimeoutSeconds: 5,
        HealthyThresholdCount: 5,
        UnhealthyThresholdCount: 2,
        Name: 'qg-gs-' + gameId,
        Port: 80,
        Protocol: 'HTTP',
        VpcId: vpcId,
        TargetType: 'ip',
      })
      .promise();
    this.newTargetGroupArn = newTargetGroup.TargetGroups!.find(
      (a) => a.TargetGroupName === 'qg-gs-' + gameId
    )!.TargetGroupArn!;

    await elbv2
      .registerTargets({
        TargetGroupArn: this.newTargetGroupArn,
        Targets: [{Id: ipAddress, Port: 80}],
      })
      .promise();
    console.log('registered new target to instance');

    const rules = await elbv2.describeRules({ListenerArn: listenerArn}).promise();
    console.log('got listener rules');

    const rulesResult = await elbv2
      .createRule({
        ListenerArn: listenerArn,
        Priority: rules.Rules!.length,
        Conditions: [
          {
            Field: 'path-pattern',
            Values: ['/' + gameId],
          },
        ],
        Actions: [
          {
            Type: 'forward',
            TargetGroupArn: this.newTargetGroupArn,
            Order: 1,
            ForwardConfig: {
              TargetGroups: [
                {
                  TargetGroupArn: this.newTargetGroupArn,
                  Weight: 1,
                },
              ],
              TargetGroupStickinessConfig: {
                Enabled: false,
              },
            },
          },
        ],
      })
      .promise();
    const rule = rulesResult.Rules!.find((r) => r.Conditions!.find((c) => c.Values!.some((v) => v === '/' + gameId)))!;
    this.ruleArn = rule.RuleArn;
    console.log('done');
    return gameId;
  }

  static async stop() {
    try {
      const ecs = new ECS({region: 'us-west-2'});
      console.log('stopping1');
      const elbv2 = new ELBv2({region: 'us-west-2'});
      console.log('deleting rule');
      await elbv2.deleteRule({RuleArn: this.ruleArn!}).promise();
      console.log('deleting target group');
      await elbv2.deleteTargetGroup({TargetGroupArn: this.newTargetGroupArn!}).promise();
      console.log(`deleting target group: ${this.newTargetGroupArn}`);

      await ecs.stopTask({task: this.taskId!, cluster: this.clusterId!, reason: 'all done'}).promise();
      console.log('stopping2');
    } catch (ex) {
      console.error(ex);
    }
  }
}

interface MagicResult {
  Cluster: string;
  TaskARN: string;
  Family: string;
  Revision: string;
  DesiredStatus: string;
  KnownStatus: string;
  Containers: Container[];
  Limits: Limits;
  PullStartedAt: string;
  PullStoppedAt: string;
}

interface Container {
  DockerId: string;
  Name: string;
  DockerName: string;
  Image: string;
  ImageID: string;
  Labels: Labels;
  DesiredStatus: string;
  KnownStatus: string;
  Limits: Limits;
  CreatedAt: string;
  StartedAt: string;
  Type: string;
  Networks: Network[];
}

interface Network {
  NetworkMode: string;
  IPv4Addresses: string[];
}

interface Limits {
  CPU: number;
  Memory: number;
}

interface Labels {
  'com.amazonaws.ecs.cluster': string;
  'com.amazonaws.ecs.container-name': string;
  'com.amazonaws.ecs.task-arn': string;
  'com.amazonaws.ecs.task-definition-family': string;
  'com.amazonaws.ecs.task-definition-version': string;
}
