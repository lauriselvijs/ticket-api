import type { EventBus } from "../ports/EventBus.ts";
import { OutboxRepository } from "../ports/OutboxRepository.ts";

const MAX_RETRIES = 5;

function getRetryDelayMs(retryCount: number): number {
  const delays = [5000, 30000, 120000, 600000];
  return delays[Math.min(retryCount - 1, delays.length - 1)];
}

export default class PublishOutboxEventsUseCase {
  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<void> {
    const events = await this.outboxRepository.findPending(100);

    for (const event of events) {
      try {
        await this.eventBus.publish(event);
        await this.outboxRepository.markAsPublished(event.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const nextRetryCount = event.retryCount + 1;

        if (nextRetryCount >= MAX_RETRIES) {
          await this.outboxRepository.markAsFailed(event.id, message);
          continue;
        }

        const delayMs = getRetryDelayMs(nextRetryCount);
        const nextRetryAt = new Date(Date.now() + delayMs);

        await this.outboxRepository.scheduleRetry(
          event.id,
          message,
          nextRetryAt,
        );
      }
    }
  }
}
