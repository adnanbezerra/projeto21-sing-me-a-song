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

        cy.wait("@postRecommendation");

        cy.get("@postRecommendation").should((response) => {
            expect(response.status).to.eq(201);
        })
    })
})