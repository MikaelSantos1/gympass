import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";
interface FecthNearbyGymsUseCaseParams {
  userLatitude: number;
  userLongitude: number;
}
interface FecthNearbyGymsUseCaseResponse {
  gyms: Gym[];
}
export class FecthNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FecthNearbyGymsUseCaseParams): Promise<FecthNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
