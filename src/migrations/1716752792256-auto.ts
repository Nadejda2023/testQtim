import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716752792256 implements MigrationInterface {
    name = 'Auto1716752792256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artickle" DROP CONSTRAINT "FK_dacb52c6b6f2851df553d956336"`);
        await queryRunner.query(`ALTER TABLE "artickle" DROP COLUMN "authorUserId"`);
        await queryRunner.query(`ALTER TABLE "artickle" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD "authorId" integer`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD CONSTRAINT "FK_c7c1b4ec9adf25f1f59a70f1167" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artickle" DROP CONSTRAINT "FK_c7c1b4ec9adf25f1f59a70f1167"`);
        await queryRunner.query(`ALTER TABLE "artickle" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD "authorUserId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD CONSTRAINT "FK_dacb52c6b6f2851df553d956336" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
