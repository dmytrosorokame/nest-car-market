import { Report } from './../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
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

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
