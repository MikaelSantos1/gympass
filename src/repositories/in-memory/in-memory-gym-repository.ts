import { Checkin, Gym, Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymsRepository {
  public items: Gym[] = [];
  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
    };
    this.items.push(gym);
    return gym;
  }
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }
  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }
}
