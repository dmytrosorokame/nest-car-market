import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude() we can use this, but maybe we want to exclude only in some scenario.
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('inserted user with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated user with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed user with id ', this.id);
  }
}
