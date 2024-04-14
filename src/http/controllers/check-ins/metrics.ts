import { makeFetchCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const fetchCheckInsHistoryUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await fetchCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
