import { Prisma } from '@prisma/client';
import getDatabaseClient from './databaseClient';
import { IdentityProvider } from '../controllers/UserController';


const dbClient = getDatabaseClient();

export async function createNewUser(userAccount: Prisma.UserAccountCreateInput, identityProvider: IdentityProvider) {
  return await dbClient.userAccount.create({
    data: {
      ...userAccount,
      identityProvider: {
        create: [{id: identityProvider.id, provider: identityProvider.provider}]
      }
    }
  });
}

export async function getUserByIdentityProviderId(identityProviderId: string) {
  const user = await dbClient.identityProvider.findUnique({
    where: {
      id: identityProviderId,
    },
    include: {
      userAccount: true,
    },
  });
  if (!user) return undefined;

  return user.userAccount;
}
