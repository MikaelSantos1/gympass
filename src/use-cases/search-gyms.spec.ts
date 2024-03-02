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
import { FetchUserCheckInHistoryUseCase } from "./fetch-user-check-ins-history";
import { SearchGymsUseCase } from "./search-gyms";
import { GymsRepository } from "@/repositories/gyms-repository";

let gymsRepository: GymsRepository;

let sut: SearchGymsUseCase;
describe("Seach gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to fetch check in history", async () => {
    await gymsRepository.create({
      title: "js gym",
      description: null,
      phone: null,
      longitude: -46.6884197,
      latitude: -23.7677457,
    });
    await gymsRepository.create({
      title: "ts gym",
      description: null,
      phone: null,
      longitude: -46.6884197,
      latitude: -23.7677457,
    });
    const { gyms } = await sut.execute({
      query: "js",
      page: 1,
    });
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "js gym",
      }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `js gym ${i}`,
        description: null,
        phone: null,
        longitude: -46.6884197,
        latitude: -23.7677457,
      });
    }

    const { gyms } = await sut.execute({
      query: "js",
      page: 2,
    });
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "js gym 21",
      }),
      expect.objectContaining({
        title: "js gym 22",
      }),
    ]);
  });
});
