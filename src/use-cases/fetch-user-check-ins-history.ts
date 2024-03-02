import { Checkin } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInHistoryUseCaseResponse {
  checkIns: Checkin[];
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}
  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );
    if (!checkIns) {
      throw new ResourceNotFoundError();
    }

    return { checkIns };
  }
}
