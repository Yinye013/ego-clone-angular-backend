import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1756832200000 implements MigrationInterface {
    name = 'AddUserFields1756832200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns only if they don't exist
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profileImage" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mobilePhone" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "branch" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "superUser" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "systemRole" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "address" text`);
        
        // Update existing records to have default values for superUser if null
        await queryRunner.query(`UPDATE "users" SET "superUser" = false WHERE "superUser" IS NULL`);
        
        // Make superUser NOT NULL after setting defaults
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "superUser" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "systemRole"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "superUser"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "branch"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "status"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "mobilePhone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "fullName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "profileImage"`);
    }
}