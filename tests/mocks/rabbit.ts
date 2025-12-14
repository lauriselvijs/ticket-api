import { mock } from "node:test";

const publishToRabbitMock = mock.fn();

await mock.module("../../src/config/rabbit.ts", {
  namedExports: {
    publishToRabbit: publishToRabbitMock,
  },
});

export { publishToRabbitMock };
