import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1692269400000 implements MigrationInterface {
  name = "InitialMigration1692269400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE,
                "email" character varying NOT NULL CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE,
                "password" character varying NOT NULL,
                "requireOTP" boolean NOT NULL DEFAULT false,
                "role" character varying NOT NULL DEFAULT 'user',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

    // Enable uuid extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
