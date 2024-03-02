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

let checkInRepository: InMemoryCheckInRepository;

let sut: FetchUserCheckInHistoryUseCase;
describe(" Fetch check in history Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch check in history", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-id",
    });
    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-id",
    });
    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 1,
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-01",
      }),
      expect.objectContaining({
        gym_id: "gym-02",
      }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-id",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 2,
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-21",
      }),
      expect.objectContaining({
        gym_id: "gym-22",
      }),
    ]);
  });
});
