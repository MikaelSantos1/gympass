import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { InvalidErrorCredentials } from "./errors/invalid-credentials-error";
import { Checkin } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxNumberOfCheckIns } from "./errors/max-number-off-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: Checkin;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}
  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) {
      throw new ResourceNotFoundError();
    }
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );
    const MAX_DISTANCE_IN_KILLOMETERS = 0.1;
    console.log("distance", distance);
    if (distance > MAX_DISTANCE_IN_KILLOMETERS) {
      throw new MaxDistanceError();
    }
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );
    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckIns();
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });
    return { checkIn };
  }
}
