const { Note } = require("@material-ui/icons");
const { v4: uuidv4 } = require("uuid");

describe("payment.", () => {
  it("user can make aoaymen.", () => {
    //login

    cy.visit("/");
    cy.findByRole("textbox", {
      name: /username/i,
    }).type("johndoe");
    cy.findByLabelText(/password/i).type("s3cret");
    cy.findByRole("checkbox", {
      name: /remember me/i,
    }).check();

    cy.findByRole("button", {
      name: /sign in/i,
    }).click();

    //check account balance
    let oldBalance;
    cy.get('[data-test="sidenav-user-balance"]').then(($balance) => (oldBalance = $balance.text()));
    //click on new button
    cy.findByText(/new/i).click();
    //search for user

    cy.findByRole("textbox").type("devon becker");
    cy.findByText(/devon becker/i).click();
    //add amount and nore and click pay

    const paymentAmount = "5.00";
    const note = uuidv4();
    cy.findByPlaceholderText(/amount/i).type(paymentAmount);
    cy.findByPlaceholderText(/add a note/i).type(note);
    cy.findByRole("button", {
      name: /pay/i,
    }).click();

    //return to transactions
    cy.findByText(/return to transactions/i).click();

    //go to personal payments
    cy.findByText(/mine/i).click();
    //  click on payment - in this case: one note - go into view can be used, but we will force to click
    cy.findByText(note).click({ force: true });

    // verify if payment was made

    cy.findByText(`-$${paymentAmount}`).should("be.visible");
    cy.findByText(note).should("be.visible");
    // verify if payment amount was deducated
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
      const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
      expect(convertedOldBalance - convertedNewBalance).to.equal(parseFloat(paymentAmount));
    });
  });
});
