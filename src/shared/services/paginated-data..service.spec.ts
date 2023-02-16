import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedDataService } from './paginated-data.service';

describe('PaginatedData', () => {
  let provider: PaginatedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginatedDataService],
    }).compile();

    provider = module.get<PaginatedDataService>(PaginatedDataService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
