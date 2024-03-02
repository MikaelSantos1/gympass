import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInRepository;

let sut: ValidateCheckInUseCase;
describe("Validate check in Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to validate check in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-id",
      user_id: "user-id",
    });
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });
    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.itens[0].validated_at).toEqual(expect.any(Date));
  });
  it("should not be able to validate as inexistent check in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to validate the check-in after 20 minuter after the creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-id",
      user_id: "user-id",
    });
    const twentyOneMinutesInMilliseconds = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
