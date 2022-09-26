beforeEach(async () => {
    await cy.request('POST', 'http://localhost:5000/recommendations/reset', {});
});

describe("up and down voting tests", () => {
    it("test down vote", () => {
        cy.visit("http://localhost:3000");
        cy.get("#name").type("Bach - Concerto de Brandemburgo nº 3");
        cy.get("#link").type("https://youtu.be/pdsyNwUoON0");
        cy.get("#button").click();

        cy.get("[data-test-id='downvote']").click();

        cy.get("[data-test-id='content']").children().should('have.text', "Bach - Concerto de Brandemburgo nº 3-1");
        // o número -1 após o 3 indica que há um downvote e que a requisição funcionou
    })

    it("test up vote", () => {
        cy.visit("http://localhost:3000");
        cy.get("#name").type("Bach - Concerto de Brandemburgo nº 3");
        cy.get("#link").type("https://youtu.be/pdsyNwUoON0");
        cy.get("#button").click();

        cy.get("[data-test-id='upvote']").click();

        cy.get("[data-test-id='content']").children().should('have.text', "Bach - Concerto de Brandemburgo nº 31");
        // o número 1 após o 3 indica que há um upvote e que a requisição funcionou
    })
})