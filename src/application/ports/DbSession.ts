export interface DbSession {
  startTransaction(): void;
  commitTransaction(): Promise<void>;
  abortTransaction(): Promise<void>;
  endSession(): void;
}
