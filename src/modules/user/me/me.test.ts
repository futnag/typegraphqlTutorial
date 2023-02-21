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

const meQuery = `
{
  me {
    id
    firstName
    lastName
    email
  }
}
`;

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      id: 2,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(12),
    }).save();
    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });
    console.log(response);
  });
});
