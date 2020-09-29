const screenSize = {width: 1950, height: 900};

export class GameDebug {
  static clientServerView = false;
  static collisions = false;
  static noTimeout = false;
  static throttleClient = false;
}

export class GameConstants {
  static binaryTransport = true;
  static capOnServerSpectators = 200;
  static capOnServerUsers = 200;
  static gameStepRate = 60;

  static lastActionTimeout = 120_000 * (GameDebug.noTimeout ? 100_000_000 : 1);
  static lastPingTimeout = 30_000 * (GameDebug.noTimeout ? 100_000_000 : 1);
  static noMessageDuration = 3_000 * (GameDebug.noTimeout ? 100_000_000 : 1);
  static pingInterval = 3_000 * (GameDebug.noTimeout ? 100_000_000 : 100_000_000);
  static serverTickRate = 1000 / 60;
  static totalSpectatorDuration = 30_000;
}
