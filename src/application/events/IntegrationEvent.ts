export interface IntegrationEvent {
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: object;
  occurredAt: Date;
}
