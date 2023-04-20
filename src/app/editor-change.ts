export enum ChangeType {
  replacement,
  insertion,
};

export interface Change {
  value: string;
  type: ChangeType;

  toBeReplaced?: string;
}
