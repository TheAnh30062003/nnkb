import { Module } from "@nestjs/common";
import { NotificationLibsService } from "./notification-libs.service";
import { SlackModule } from "./slack/slack.module";

@Module({
  providers: [NotificationLibsService],
  exports: [NotificationLibsService],
  imports: [SlackModule],
})
export class NotificationLibsModule {}
