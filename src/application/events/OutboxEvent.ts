import { AggregateType } from "../enums/AggregateType.ts";
import { OutboxStatus } from "../enums/OutboxStatus.ts";

export default class OutboxEvent {
  constructor(
    public readonly id: string,
    public readonly aggregateId: string,
    public readonly aggregateType: AggregateType,
    public readonly eventType: string,
    public readonly payload: Record<string, unknown>,
    public readonly occurredAt: Date,
    public readonly status: OutboxStatus = OutboxStatus.PENDING,
    public readonly publishedAt: Date | null = null,
    public readonly errorMessage: string | null = null,
    public readonly retryCount: number = 0,
  ) {}
}
