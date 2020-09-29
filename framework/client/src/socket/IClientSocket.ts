export interface IClientSocket {
  connect(
    serverPath: string,
    options: {
      onDisconnect: () => void;
      onMessage: (messages: ServerToClientMessage[]) => void;
      onOpen: () => void;
    }
  ): void;

  disconnect(): void;

  isConnected(): boolean;

  sendMessage(message: ClientToServerMessage): void;
}
