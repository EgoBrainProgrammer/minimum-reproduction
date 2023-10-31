import { Test, TestingModule } from '@nestjs/testing';
import { EntityhistoryService } from './entityhistory.service';

describe('EntityhistoryService', () => {
  let service: EntityhistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityhistoryService],
    }).compile();

    service = module.get<EntityhistoryService>(EntityhistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
