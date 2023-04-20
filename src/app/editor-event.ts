export enum EditorEventType {
  replacement,
  insertion,
  retrieval,
};

export interface EditorEvent {
  type: EditorEventType;

  value?: string;
  toBeReplaced?: string;
}
