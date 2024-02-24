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

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckInUseCase;
describe(" Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository();
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);
    await gymsRepository.items.push({
      id: "gym-id",
      title: "Academia js",
      description: "",
      phone: "",
      longitude: new Decimal(0),
      latitude: new Decimal(0),
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
      userLatitude: 0,
      userLongitude: 0,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not  be able to check in on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id",
        userId: "user-id",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should  be able to check twice but on different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0));
    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });
    vi.setSystemTime(new Date(2022, 0, 21, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
