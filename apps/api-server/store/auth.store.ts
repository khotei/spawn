import { dbClient } from "@spawn/data-manager"

type CreateSessionDto = {
  expires: Date | string
  sessionToken: string
  userId: string
}

type CreateVerificationTokenDto = {
  expires: Date | string
  identifier: string
  token: string
}

type GetSessionDto = {
  sessionToken: string
}

type DeleteSessionDto = {
  sessionToken: string
}

type FindAccountDto = {
  provider: string
  providerAccountId: string
}

type FindUniqueAccountDto = {
  provider: string
  providerAccountId: string
}

type DeleteAccountDto = {
  provider: string
  providerAccountId: string
}

type CreateAccountDto = {
  accessToken?: null | string
  expiresAt?: Date | null | string
  id?: string
  idToken?: null | string
  provider: string
  providerAccountId: string
  refreshToken?: null | string
  scope?: null | string
  sessionState?: null | string
  tokenType?: null | string
  type: string
  userId: string
}

type UpdateSessionDto = {
  expires?: Date | null | string
  sessionToken: string
  userId?: null | string
}

type FindUniqueSessionDto = {
  sessionToken: string
}

type FindUniqueVerificationTokenDto = {
  identifier: string
  token: string
}

type DeleteVerificationTokenDto = {
  identifier: string
  token: string
}

export const createSession = (
  createSessionDto: CreateSessionDto
) =>
  dbClient.session.create({
    data: createSessionDto,
    include: { user: true },
  })

export const createVerificationToken = (
  createVerificationTokenDto: CreateVerificationTokenDto
) =>
  dbClient.verificationToken.create({
    data: createVerificationTokenDto,
  })

export const getSession = (
  deleteSessionDto: GetSessionDto
) =>
  dbClient.session.findFirstOrThrow({
    include: { user: true },
    where: deleteSessionDto,
  })

export const deleteSession = (
  deleteSessionDto: DeleteSessionDto
) =>
  dbClient.session.delete({
    where: deleteSessionDto,
  })

export const findAccount = (
  findAccountDto: FindAccountDto
) =>
  dbClient.account.findFirst({
    include: { user: true },
    where: findAccountDto,
  })

export const createAccount = (
  createAccountDto: CreateAccountDto
) =>
  dbClient.account.create({
    data: createAccountDto,
    include: { user: true },
  })

export const deleteAccount = (
  deleteAccountDto: DeleteAccountDto
) =>
  dbClient.account.delete({
    where: {
      provider_providerAccountId: deleteAccountDto,
    },
  })

export const updateSession = ({
  expires,
  sessionToken,
  userId,
}: UpdateSessionDto) =>
  dbClient.session.update({
    data: {
      expires: expires ?? undefined,
      userId: userId ?? undefined,
    },
    include: { user: true },
    where: { sessionToken },
  })

export const findUniqueSession = (
  findUniqueSessionDto: FindUniqueSessionDto
) =>
  dbClient.session.findUnique({
    include: { user: true },
    where: findUniqueSessionDto,
  })

export const findUniqueAccount = (
  findUniqueAccountDto: FindUniqueAccountDto
) =>
  dbClient.account.findUnique({
    include: { user: true },
    where: {
      provider_providerAccountId: findUniqueAccountDto,
    },
  })

export const findUniqueVerificationToken = (
  findUniqueTokenDto: FindUniqueVerificationTokenDto
) =>
  dbClient.verificationToken.findUnique({
    where: {
      identifier_token: findUniqueTokenDto,
    },
  })

export const deleteVerificationToken = (
  deleteVerificationTokenDto: DeleteVerificationTokenDto
) =>
  dbClient.verificationToken.delete({
    where: { identifier_token: deleteVerificationTokenDto },
  })
