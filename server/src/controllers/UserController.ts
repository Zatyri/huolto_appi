import { Prisma } from "@prisma/client";
import { createNewUser, getUserByIdentityProviderId } from "../database/userActions";
import { GoogleUser } from "../passport";
import { v4 as uuidv4 } from 'uuid';

export type UserData = {
  firstName: string,
  lastName: string,
  email: string,
  profilePictureUrl?: string
}

export type IdentityProvider = {
  id: string,
  provider: string
}

export async function isUserRegistered(identityProvider: GoogleUser){
  const identityProviderId = identityProvider._json.sub;
  const user = await getUserByIdentityProviderId(identityProviderId.toString());
  return user ? true : false;
}

export async function getUserByidentityProviderData(identityProvider: GoogleUser){
  const identityProviderId = identityProvider._json.sub;
  const user = await getUserByIdentityProviderId(identityProviderId.toString());
  if(user){

  }
}

export async function addNewUser(identityProvider: GoogleUser, userData: UserData){
  const userAccountInput: Prisma.UserAccountCreateInput = {
    id: uuidv4(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profilePictureUrl: identityProvider._json.picture
  }
  const identityProviderInput: IdentityProvider = {
    id: identityProvider._json.sub,
    provider: "google"
  }
  const addedUser = await createNewUser(userAccountInput, identityProviderInput)
  return addedUser ? true : false
}