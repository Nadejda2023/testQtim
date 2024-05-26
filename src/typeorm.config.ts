import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_H,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_U,
  password: process.env.POSTGRES_PAS,
  database: process.env.POSTGRES_DB,
  entities: ['*/**/*.entity.ts'],
  //entities: [User, Artickle],
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
