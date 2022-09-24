import { faker } from "@faker-js/faker"

export function createValidRecommendation() {
    return {
        name: faker.name.fullName(),
        youtubeLink: "https://youtu.be/PyMz0w2UC9s"
    }
}

export function createInvalidRecommendation() {
    return {
        name: "",
        youtubeLink: ""
    }
}

export function createMockRecommendation() {
    return {
        name: "Air on the G String",
        youtubeLink: "https://youtu.be/PyMz0w2UC9s"
    }
}

export function completeMockRecommendation() {
    return {
        ...createMockRecommendation(),
        id: 1,
        score: 0
    }
}