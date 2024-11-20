import { Controller, Get, Logger, Put, Query } from "@nestjs/common";
import { S3ProviderService } from "../service/s3-provider.service";
import { S3ObjectDto } from "../model/dto/s3-object.dto";
import { lastValueFrom, of } from "rxjs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "@cubone/security/authentication/decorators/public.decorator";
import { AuthUser } from "@cubone/security/authentication/decorators/auth-user.decorator";
import { CtxUser } from "@cubone/security/model/ctx-user";
import { HasAnyAuthorities } from "@cubone/security/authorization/api-access/has-any-authorities.decorator";

@ApiTags("S3 Storage")
@Controller("s3")
export class S3ObjectController {
  private readonly logger = new Logger(S3ObjectController.name);

  constructor(private readonly s3StorageService: S3ProviderService) {}

  @Public()
  @Get(["/"])
  async index(): Promise<any> {
    return lastValueFrom(of("Hello S3 Storage"));
  }

  @Put("/object")
  uploadFile(@Query("key") key: string): S3ObjectDto {
    // TODO: redirect to s3 put url
    return new S3ObjectDto(key);
  }

  @Get("/object")
  @HasAnyAuthorities("bo-resource-server/all-access", "bo-resource-server/test")
  @ApiResponse({ type: S3ObjectDto })
  async findByKey(
    @AuthUser() authUser: CtxUser,
    @Query("key") key: string,
  ): Promise<S3ObjectDto> {
    this.logger.debug(`Context User Id: ${authUser.id}`);
    return lastValueFrom(this.s3StorageService.findByKey(key));
  }
}
