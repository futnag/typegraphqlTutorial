import { BaseEntity } from "typeorm/repository/BaseEntity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  // @Field()
  // name: string;

  // @FieldResolver()
  // name(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }

  @Column()
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;
}
