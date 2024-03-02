import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";
interface CreateGymUseCaseParams {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}
interface CreateGymUseCaseResponse {
  gym: Gym;
}
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymUseCaseParams): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    });

    return {
      gym,
    };
  }
}
