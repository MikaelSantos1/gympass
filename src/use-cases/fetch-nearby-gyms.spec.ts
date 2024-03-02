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
import { FecthNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: GymsRepository;

let sut: FecthNearbyGymsUseCase;
describe("Fetch nearby gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository();
    sut = new FecthNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch check in history", async () => {
    await gymsRepository.create({
      title: "near gym",
      description: null,
      phone: null,
      latitude: -23.7677457,
      longitude: -46.6884197,
    });
    await gymsRepository.create({
      title: "far gym",
      description: null,
      phone: null,
      longitude: -46.5307934,
      latitude: 23.461642,
    });
    const { gyms } = await sut.execute({
      userLatitude: -23.7677457,
      userLongitude: -46.6884197,
    });
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "near gym",
      }),
    ]);
  });
});
