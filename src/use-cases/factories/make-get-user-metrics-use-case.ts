import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";
import { GetUserProfileUseCase } from "../get-user-profile";
import { GetUserMetricsUseCase } from "../get-user-metrics";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-resitory";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);
  return useCase;
}
