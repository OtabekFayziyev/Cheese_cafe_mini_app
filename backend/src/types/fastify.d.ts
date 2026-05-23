import '@fastify/jwt';

// @fastify/jwt v8 uchun to'g'ri type augmentation
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; role: string };
    user: { userId: string; role: string };
  }
}

declare module 'fastify' {
  i