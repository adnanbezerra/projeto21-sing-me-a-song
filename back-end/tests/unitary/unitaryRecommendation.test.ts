import { prisma } from "../../src/database";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
import { completeMockRecommendation, createMockRecommendation, createValidRecommendation } from "../factory/recommendationFactory";

beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
})

describe("recommendationService unitary tests", () => {
    it("valid usage of insertion service", async () => {
        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "create")
            .mockImplementationOnce((): any => { });

        const newRecommendation = createMockRecommendation();

        await recommendationService.insert(newRecommendation);

        expect(recommendationRepository.create).toBeCalled();
    })

    it("invalid usage of insertion service, repeated recommendation name", async () => {
        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementationOnce((): any => {
                return completeMockRecommendation()
            });
        jest.spyOn(recommendationRepository, "create")
            .mockImplementationOnce((): any => { });

        const newRecommendation = createMockRecommendation();

        const request = recommendationService.insert(newRecommendation);

        expect(recommendationRepository.create).not.toBeCalled();
        expect(request).rejects.toEqual(conflictError("Recommendations names must be unique"));
    })

    it("valid upvote usage", async () => {
        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => {
                return completeMockRecommendation()
            });
        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => { }
            );

        const request = await recommendationService.upvote(1);

        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("upvote usage with invalid id", async () => {
        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => { });

        const request = recommendationService.upvote(1);

        expect(recommendationRepository.updateScore).not.toBeCalled();
        expect(request).rejects.toEqual(notFoundError());
    })

    it("valid downvote usage", async () => {
        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => {
                return completeMockRecommendation()
            });
        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => {
                return completeMockRecommendation()
            });

        const request = await recommendationService.downvote(1);

        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("downvote usage with invalid id", async () => {
        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => {
                return {
                    ...completeMockRecommendation(),
                    score: -1
                }
            });

        const request = recommendationService.downvote(1);

        expect(recommendationRepository.updateScore).not.toBeCalled();
        expect(request).rejects.toEqual(notFoundError());
    })

    it("valid downvote usage but the recommendation is deleted", async () => {
        jest.spyOn(recommendationRepository, "find")
            .mockImplementationOnce((): any => {
                return {
                    ...completeMockRecommendation(),
                    score: -5
                }
            });
        jest.spyOn(recommendationRepository, "updateScore")
            .mockImplementationOnce((): any => {
                return {
                    ...completeMockRecommendation(),
                    score: -6
                }
            });
        jest.spyOn(recommendationRepository, "remove")
            .mockImplementationOnce((): any => { });

        const request = await recommendationService.downvote(1);

        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled;
    })

    it("valid get random", async () => {
        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => {
                return [{
                    ...completeMockRecommendation()
                },
                {
                    ...createValidRecommendation(),
                    id: 2,
                    score: 3
                }]
            });

        const request = await recommendationService.getRandom();

        expect(request).toBeInstanceOf(Object);
    })

    it("invalid get random", async () => {
        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => { return [] })
            .mockImplementationOnce((): any => { return [] });

        try {
            const request = await recommendationService.getRandom();
        } catch (error) {
            expect(error).toEqual(notFoundError());
        }
    })

    it("valid get recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => [{
                ...completeMockRecommendation()
            }]);

        const request = await recommendationService.get();

        expect(request).toBeInstanceOf(Array);
        expect(request).toEqual([completeMockRecommendation()]);
    })

    it("empty get recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => []);

        const request = await recommendationService.get();

        expect(request).toBeInstanceOf(Array);
        expect(request).toEqual([]);
    })

    it("valid get top recommendations", async () => {
        jest.spyOn(recommendationRepository, "getAmountByScore")
            .mockImplementationOnce((): any => {
                return [{
                    ...completeMockRecommendation()
                },
                {
                    ...createValidRecommendation(),
                    id: 2,
                    score: 3
                }]
            });

        const request = await recommendationService.getTop(2);

        expect(request).toBeInstanceOf(Array);
    })

    it("empty get top recommendations", async () => {
        jest.spyOn(recommendationRepository, "getAmountByScore")
            .mockImplementationOnce((): any => { });

        const request = await recommendationService.getTop(2);

        expect(request).toBeUndefined();
    })
})