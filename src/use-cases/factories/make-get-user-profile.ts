import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { GetUserProfileUseCase } from "../get-user-profile";

export function makeGetUserProfileUseCase() {
  const prismaUsersReposistory = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(prismaUsersReposistory);
  return useCase;
}
