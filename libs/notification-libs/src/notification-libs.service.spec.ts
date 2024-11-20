import { Test, TestingModule } from "@nestjs/testing";
import { NotificationLibsService } from "./notification-libs.service";

describe("NotificationLibsService", () => {
  let service: NotificationLibsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationLibsService],
    }).compile();

    service = module.get<NotificationLibsService>(NotificationLibsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
