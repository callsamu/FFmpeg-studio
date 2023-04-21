export enum MessageType {
  Load,
  Info,
}

export interface Message {
  content: string;
  type: MessageType;
}
