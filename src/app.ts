import fastify from "fastify";
import { ZodError, z } from "zod";
import { prisma } from "./lib/prisma";
import { register } from "./http/controllers/users/register";
import { usersRoutes } from "./http/controllers/users/routes";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(usersRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "productin") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
