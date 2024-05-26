import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716752484471 implements MigrationInterface {
    name = 'Auto1716752484471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artickle" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "authorUserId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_5d0e5bc48f2c62156a5a2bfb4cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authorUserId"`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD CONSTRAINT "FK_dacb52c6b6f2851df553d956336" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artickle" DROP CONSTRAINT "FK_dacb52c6b6f2851df553d956336"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authorUserId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "artickle"`);
    }

}
