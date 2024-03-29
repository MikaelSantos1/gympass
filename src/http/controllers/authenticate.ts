import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidErrorCredentials } from "@/use-cases/errors/invalid-credentials-error";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { RegisterUseCase } from "@/use-cases/register";

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const registerUseCase = makeAuthenticateUseCase();

    await registerUseCase.execute({
      email,

      password,
    });
  } catch (err) {
    if (err instanceof InvalidErrorCredentials) {
      return reply.status(400).send({ message: err.message });
    }

    throw err; // TODO: fix me
  }

  return reply.status(200).send();
}
