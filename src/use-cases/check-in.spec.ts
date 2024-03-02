import { compare, hash } from "bcryptjs";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { RegisterUseCase } from "./register";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidErrorCredentials } from "./errors/invalid-credentials-error";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckIns } from "./errors/max-number-off-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckInUseCase;
describe(" Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository();
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-id",
      title: "Academia js",
      description: "",
      phone: "",
      longitude: new Decimal(-46.6884197),
      latitude: new Decimal(-23.7677457),
    });
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -23.7677457,
      userLongitude: -46.6884197,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not  be able to check in on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -23.7677457,
      userLongitude: -46.6884197,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: -23.7677457,
        userLongitude: -46.6884197,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckIns);
  });

  it("should  be able to check twice but on different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0));
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -23.7677457,
      userLongitude: -46.6884197,
    });
    vi.setSystemTime(new Date(2022, 0, 21, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: -23.7677457,
      userLongitude: -46.6884197,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.items.push({
      id: "gym-2",
      title: "Academia js",
      description: "",
      phone: "",
      longitude: new Decimal(-23.7654867),
      latitude: new Decimal(-46.6882265),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-2",
        userId: "user-id",
        userLatitude: -23.7677457,
        userLongitude: -46.6884197,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
