import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
  const prismaUsersReposistory = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersReposistory);
  return authenticateUseCase;
}
