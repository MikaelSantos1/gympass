import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";
interface SearchGymsUseCaseParams {
  query: string;
  page: number;
}
interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}
export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseParams): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
