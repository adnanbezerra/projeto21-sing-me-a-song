beforeEach(async () => {
    await cy.request('POST', 'http://localhost:5000/recommendations/reset', {});
});

describe("get top recommendations", () => {
    it("get empty top pages", () => {
        cy.visit("http://localhost:3000/random");

        cy.get("[data-test-id='content']").children().should('have.text', "No recommendations yet! Create your own :)");
    })

    it("get top page not empty", () => {
        cy.visit("http://localhost:3000");
        cy.get("#name").type("Bach - Concerto de Brandemburgo nº 3");
        cy.get("#link").type("https://youtu.be/pdsyNwUoON0");
        cy.get("#button").click();

        cy.visit("http://localhost:3000/random");
        cy.get("[data-test-id='content']").children().should('have.text', "Bach - Concerto de Brandemburgo nº 30");
        // o 0 depois do 3 vem do número de upvotes, que deve ser 0
    })
})