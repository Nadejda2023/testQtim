import { Test, TestingModule } from '@nestjs/testing';
import { ArticklesController } from './artickles.controller';

describe('ArticklesController', () => {
  let controller: ArticklesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticklesController],
    }).compile();

    controller = module.get<ArticklesController>(ArticklesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
