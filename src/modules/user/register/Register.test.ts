import { gCall } from "../../../test-utils/gCall";
import { TestDataSource } from "../../../data-source-test";
import { faker } from "@faker-js/faker";
import { User } from "../../../entity/User";
import { redis } from "../../../redis";

beforeAll(async () => {
  await TestDataSource.initialize();
});

afterAll(async () => {
  redis.disconnect();
  await TestDataSource.destroy();
});

const registerMutation = `
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    firstName
    lastName
    email
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(12),
    };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        input: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);
  });
});
