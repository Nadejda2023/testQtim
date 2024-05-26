import { Test, TestingModule } from '@nestjs/testing';
import { ArticklesService } from './artickles.service';

describe('ArticklesService', () => {
  let service: ArticklesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticklesService],
    }).compile();

    service = module.get<ArticklesService>(ArticklesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
