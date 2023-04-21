export enum EditorEventType {
  replacement,
  insertion,
  retrieval,
  undo,
};

export interface EditorEvent {
  type: EditorEventType;

  value?: string;
  toBeReplaced?: string;
}
