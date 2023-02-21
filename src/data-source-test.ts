import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import { User } from "./entity/User";
export const TestDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "typegraphqlexampletest",
  synchronize: true,
  logging: true,
  entities: [User, Product],
  migrations: [],
  subscribers: [],
});
