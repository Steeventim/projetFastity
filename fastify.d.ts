// fastify.d.ts
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      DB_HOST: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      JWT_SECRET: string;
      PORT: number;
    };
  }
}
