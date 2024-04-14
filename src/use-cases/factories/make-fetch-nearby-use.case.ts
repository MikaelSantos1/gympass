import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";
import { GetUserProfileUseCase } from "../get-user-profile";
import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-resitory";
import { ValidateCheckInUseCase } from "../validate-check-in";
import { FecthNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeFetchNearbyUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FecthNearbyGymsUseCase(gymsRepository);
  return useCase;
}
