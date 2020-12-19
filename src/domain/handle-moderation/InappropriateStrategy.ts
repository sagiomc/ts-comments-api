export interface InappropriateStrategy {
  isInappropriate(text: string): Promise<boolean>;
}
