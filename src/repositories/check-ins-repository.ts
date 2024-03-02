import { Prisma, Checkin } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>;
  countByUserId(userId: string): Promise<number>;
  findById(id: string): Promise<Checkin | null>;
  save(checkIn: Checkin): Promise<Checkin | null>;
}
