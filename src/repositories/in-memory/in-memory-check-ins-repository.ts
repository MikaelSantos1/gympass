import { Checkin, Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public itens: Checkin[] = [];
  async findManyByUserId(userId: string, page: number) {
    return this.itens
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };
    this.itens.push(checkIn);
    return checkIn;
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.itens.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });
    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }
  async countByUserId(userId: string): Promise<number> {
    return this.itens.filter((item) => item.user_id === userId).length;
  }
  async findById(id: string) {
    const checkIn = this.itens.find((item) => item.id === id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }
  async save(checkIn: Checkin) {
    const checkInIndex = this.itens.findIndex((item) => item.id === checkIn.id);
    if (checkInIndex >= 0) {
      this.itens[checkInIndex] = checkIn;
    }
    return checkIn;
  }
}
