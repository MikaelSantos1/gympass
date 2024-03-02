import { compare } from "bcryptjs";
import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { CreateGymUseCase } from "./create-gym";

describe("Create gym Use Case", () => {
  it("should be able to create a gym", async () => {
    const gymsRepository = new InMemoryGymRepository();
    const sut = new CreateGymUseCase(gymsRepository);

    const { gym } = await sut.execute({
      title: "JS gym",
      description: null,
      phone: null,
      longitude: -46.6884197,
      latitude: -23.7677457,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
