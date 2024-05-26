import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1716733765357 implements MigrationInterface {
    name = 'Auto1716733765357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying NOT NULL`);
    }

}
