const { parseNumber } = require("../../utils/numberHelper");

describe("One Piece Character API Validation", () => {
  const url = "https://api.api-onepiece.com/v2/characters/en";
  let apiResponse;

  before(() => {
    cy.request({
      url: url,
      failOnStatusCode: false,
    }).then((response) => {
      apiResponse = response;
    });
  });

  it("Rule 1: Passes if the status code is 200", () => {
    expect(apiResponse.status).to.eq(200);
  });

  it("Rule 2: Each ID must be unique", () => {
    const ids = apiResponse.body.map((char) => char.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).to.eq(ids.length);
  });

  it('Rule 3: The fruit name "Gum-Gum Fruit" must be exclusive to "Monkey D. Luffy"', () => {
    apiResponse.body.forEach((char) => {
      if (char.fruit && char.fruit.name === "Gum-Gum Fruit") {
        // Normalize name match to handle punctuation variations
        expect(char.name).to.match(/Monkey D\.? ?Luffy/i);
      }
    });
  });

  it('Rule 4: The "total_prime" value must match the sum of the "bounty" values for characters with the same crew ID', () => {
    const crews = {};

    apiResponse.body.forEach((char) => {
      if (char.crew && char.crew.id) {
        const crewId = char.crew.id;
        if (!crews[crewId]) {
          crews[crewId] = {
            name: char.crew.name,
            totalPrime: parseNumber(char.crew.total_prime),
            bountySum: 0,
          };
        }
        crews[crewId].bountySum += parseNumber(char.bounty);
      }
    });

    Object.keys(crews).forEach((crewId) => {
      const crew = crews[crewId];
      expect(
        crew.bountySum,
        `Crew "${crew.name}" (ID ${crewId}) sum of bounties (${crew.bountySum}) does not balance with total_prime (${crew.totalPrime})`,
      ).to.eq(crew.totalPrime);
    });
  });
});

