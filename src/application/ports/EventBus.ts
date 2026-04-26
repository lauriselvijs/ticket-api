import { IntegrationEvent } from "../events/IntegrationEvent.ts";

export interface EventBus {
  publish(event: IntegrationEvent): Promise<void>;
}
