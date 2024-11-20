import { Injectable, OnApplicationShutdown } from "@nestjs/common";

@Injectable()
class StorageService implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.log(signal);
  }
}
