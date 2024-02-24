import { Checkin, Gym, Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymRepository implements GymsRepository {
  public items: Gym[] = [];
  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
}
