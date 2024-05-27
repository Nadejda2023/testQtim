import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716808417767 implements MigrationInterface {
    name = 'Auto1716808417767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artickle" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD "createdAt" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artickle" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "artickle" ADD "createdAt" TIMESTAMP NOT NULL`);
    }

}
