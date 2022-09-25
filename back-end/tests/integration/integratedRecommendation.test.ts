import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { createInvalidRecommendation, createMockRecommendation, createValidRecommendation } from "../factory/recommendationFactory";

const server = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`
})

describe("recommendation route integration tests", () => {
    it("post valid recommendation", async () => {
        const newRecommendation = createValidRecommendation();

        const request = await server.post("/recommendations").send(newRecommendation);

        expect(request.status).toEqual(201);
    });

    it("post invalid recommendation", async () => {
        const newRecommendation = createInvalidRecommendation();

        const request = await server.post("/recommendations").send(newRecommendation);

        expect(request.status).toEqual(422);
    })

    it("post repeated recommendation", async () => {
        const newRecommendation = createMockRecommendation();
        await server.post("/recommendations").send(newRecommendation);

        const request = await server.post("/recommendations").send(newRecommendation);

        expect(request.status).toEqual(409);
    })

    it("get recommendation with valid response", async () => {
        const newRecommendation = createValidRecommendation();
        await server.post("/recommendations").send(newRecommendation);

        const request = await server.get("/recommendations");

        expect(request.status).toEqual(200);
        expect(request.body).toBeInstanceOf(Array);
    })

    it("get recommendation with empty response", async () => {
        const request = await server.get("/recommendations");

        expect(request.status).toEqual(200);
        expect(request.body).toBeInstanceOf(Array);
        expect(request.body.length).toEqual(0);
    })

    it("valid upvote", async () => {
        await server.post("/recommendations").send(createMockRecommendation());

        const request = await server.post("/recommendations/1/upvote");

        expect(request.status).toEqual(200);
    })

    it("invalid upvote", async () => {
        const request = await server.post("/recommendations/1/upvote");

        expect(request.status).toEqual(404);
    })

    it("valid downvote", async () => {
        await server.post("/recommendations").send(createMockRecommendation());

        const request = await server.post("/recommendations/1/downvote");

        expect(request.status).toEqual(200);
    })

    it("invalid downvote", async () => {
        const request = await server.post("/recommendations/1/downvote");

        expect(request.status).toEqual(404);
    })

    it("downvote until it's banished from the existance", async () => {
        jest.spyOn(recommendationRepository, "remove");

        await server.post("/recommendations").send(createMockRecommendation());

        for (let index = 0; index < 6; index++) {
            await server.post("/recommendations/1/downvote");
        }

        expect(recommendationRepository.remove).toBeCalled();
    })

    it("valid downvote", async () => {
        await server.post("/recommendations").send(createMockRecommendation());

        const request = await server.post("/recommendations/1/downvote");

        expect(request.status).toEqual(200);
    })

    it("invalid downvote", async () => {
        const request = await server.post("/recommendations/1/downvote");

        expect(request.status).toEqual(404);
    })

    it("valid get by id", async () => {
        await server.post("/recommendations").send(createMockRecommendation());

        const request = await server.get("/recommendations/1");

        expect(request.status).toEqual(200);
        expect(request.body).toBeInstanceOf(Object);
    })

    it("invalid get by id", async () => {
        const request = await server.post("/recommendations/1");

        expect(request.status).toEqual(404);
    })

    it("get random recommendation with only one single recommendation on the database", async () => {
        await server.post("/recommendations").send(createMockRecommendation());
        const expectedResponse = { ...createMockRecommendation(), id: 1, score: 0 }

        const request = await server.get("/recommendations/random");

        expect(request.status).toEqual(200);
        expect(request.body).toEqual(expectedResponse);
    })

    it("get random recommendation with no recommendations on the database", async () => {
        const request = await server.get("/recommendations/random");

        expect(request.status).toEqual(404);
    })

    it("get top with one recommendation", async () => {
        await server.post("/recommendations").send(createMockRecommendation());
        const expectedResponse = [{ ...createMockRecommendation(), id: 1, score: 0 }];

        const request = await server.get("/recommendations/top/1");

        expect(request.status).toEqual(200);
        expect(request.body).toEqual(expectedResponse);
    })

    it("get top with no recommendation", async () => {
        const request = await server.get("/recommendations/top/1");

        expect(request.status).toEqual(200);
        expect(request.body).toEqual([]);
    })

    it("get random item with score graater than 10", async () => {
        jest.spyOn(recommendationRepository, "remove");
        await server.post("/recommendations").send(createMockRecommendation());
        for (let index = 0; index < 10; index++) {
            await server.post("/recommendations/1/upvote");
        }
        const expectedResponse = { ...createMockRecommendation(), id: 1, score: 10 }

        const request = await server.get("/recommendations/random")

        expect(request.status).toEqual(200);
        expect(request.body).toEqual(expectedResponse);        
    })
})

afterAll(async () => {
    await prisma.$disconnect();
})