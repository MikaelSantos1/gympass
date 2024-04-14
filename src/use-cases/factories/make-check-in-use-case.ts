import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";
import { GetUserProfileUseCase } from "../get-user-profile";
import { CheckInUseCase } from "../check-in";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-resitory";

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);
  return useCase;
}
