beforeEach(async () => {
    await cy.request('POST', 'http://localhost:5000/recommendations/reset', {});
});

describe("create new recommendation testing", () => {
    it("it should succesfully create a new recommendation", () => {
        cy.visit("http://localhost:3000");

        cy.get("#name").type("Bach - Concerto de Brandemburgo nº 3");
        cy.get("#link").type("https://youtu.be/pdsyNwUoON0");

        cy.intercept("POST", "/recommendations").as("postRecommendation");

        cy.get("#button").click();

        cy.wait('@postRecommendation').should((response) => {
            const { statusCode } = response.response;

            expect(statusCode).to.eq(201);
        })
    })

    it("it should fail because of wrong data", () => {
        cy.visit("http://localhost:3000");

        cy.get("#name").type("nomeee");
        cy.get("#link").type(" ");

        cy.intercept("POST", "/recommendations").as("postRecommendation");

        cy.get("#button").click();

        cy.wait('@postRecommendation').should((response) => {
            const { statusCode } = response.response;

            expect(statusCode).to.eq(422);
        })
    })

    it("it should fail because of repeated data", () => {
        cy.visit("http://localhost:3000");

        cy.get("#name").type("Deux Arabesques");
        cy.get("#link").type("https://youtu.be/9Fle2CP8gR0");
        cy.get("#button").click();

        cy.get("#name").type("Deux Arabesques");
        cy.get("#link").type("https://youtu.be/9Fle2CP8gR0");
        
        cy.intercept("POST", "/recommendations").as("postRecommendation");

        cy.get("#button").click();

        cy.wait('@postRecommendation').should((response) => {
            const { statusCode } = response.response;

            expect(statusCode).to.eq(409);
        })
    })
})