export interface IntegrationEvent {
  id: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: object;
  occurredAt: Date;
}
