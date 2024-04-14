import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";
import { GetUserProfileUseCase } from "../get-user-profile";
import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-resitory";

export function makeFetchCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInHistoryUseCase(checkInsRepository);
  return useCase;
}
