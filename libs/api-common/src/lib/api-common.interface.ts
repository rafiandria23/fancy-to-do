import { FastifyRequest } from 'fastify';
import { Transaction } from 'sequelize';

export interface ApiRequest extends FastifyRequest {
  transaction: Transaction;
  auth: {
    user_id: string;
  };
}
