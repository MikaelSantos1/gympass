import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const prismaUsersReposistory = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(prismaUsersReposistory);
  return registerUseCase;
}
