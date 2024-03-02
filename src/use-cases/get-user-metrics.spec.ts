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
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepository: InMemoryCheckInRepository;

let sut: GetUserMetricsUseCase;
describe("Get users metrics Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it("should be able to get check ins count from metrics", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-id",
    });
    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-id",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id",
    });
    expect(checkInsCount).toEqual(2);
  });
});
