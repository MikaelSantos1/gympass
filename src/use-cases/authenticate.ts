import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { InvalidErrorCredentials } from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";

interface AutheticateUseCaseRequest {
  email: string;
  password: string;
}

interface AutheticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    email,
    password,
  }: AutheticateUseCaseRequest): Promise<AutheticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidErrorCredentials();
    }
    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidErrorCredentials();
    }
    return { user };
  }
}
