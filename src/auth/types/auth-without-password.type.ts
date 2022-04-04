import { Auth } from '@prisma/client';

export type AuthWithoutPassword = Omit<Auth, 'password'>;
