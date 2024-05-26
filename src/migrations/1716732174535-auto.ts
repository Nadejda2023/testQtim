import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1716732174535 implements MigrationInterface {
  name = 'Auto1716732174535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "city" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
  }
}
