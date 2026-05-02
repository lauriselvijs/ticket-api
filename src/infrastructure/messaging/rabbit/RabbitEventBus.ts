import { IntegrationEvent } from "../../../application/events/IntegrationEvent.ts";
import { EventBus } from "../../../application/ports/EventBus.ts";
import { publishToRabbit } from "../rabbit/rabbit.publisher.ts";

export class RabbitEventBus implements EventBus {
  async publish(event: IntegrationEvent): Promise<void> {
    await publishToRabbit(event.eventType, event, {
      messageId: event.id,
    });
  }
}
