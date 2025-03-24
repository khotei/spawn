import { dbClient } from "@spawn/data-manager"
import type { RequireAtLeastOne } from "type-fest"

type CreateUserDto = {
  email: string
  emailVerified?: Date | null | string
  id?: string
  image?: null | string
  name?: null | string
  password?: null | string
}

type GetUserDto = {
  id: string
}

type DeleteUserDto = {
  id: string
}

type FindUniqueUserDto = RequireAtLeastOne<{
  email?: string
  id?: string
}>

type UpdateUserDto = {
  email?: null | string
  emailVerified?: Date | null | string
  id: string
  image?: null | string
  name?: null | string
  password?: null | string
}

export const createUser = (createUserDto: CreateUserDto) =>
  dbClient.user.create({ data: createUserDto })

export const getUser = (getUserDto: GetUserDto) =>
  dbClient.user.findFirstOrThrow({
    where: getUserDto,
  })

export const deleteUser = (deleteUserDto: DeleteUserDto) =>
  dbClient.user.delete({ where: deleteUserDto })

export const findUniqueUser = (
  findUniqueUserDto: FindUniqueUserDto
) => dbClient.user.findUnique({ where: findUniqueUserDto })

export const updateUser = ({
  id,
  ...restDto
}: UpdateUserDto) =>
  dbClient.user.update({
    data: {
      ...restDto,
      email: restDto.email ?? undefined,
    },
    where: { id },
  })
