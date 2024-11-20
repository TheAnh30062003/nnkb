import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { GeneratePasswordDto } from "./dto/generate-password.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../role/roles.decorator";
import { StatusRoles } from "../role/status.decorator";
import { UserRoles, UserStatus } from "./user.types";

@ApiBearerAuth("JWT-auth")
@ApiTags("Users")
@Controller("users")
@StatusRoles(UserStatus.ACTIVE)
export class UserController {
  authService: any;
  prisma: any;
  constructor(private readonly userService: UserService) {}

  @Post("")
  @Roles(UserRoles.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Get("")
  getUsers(@Query() getUsersDto: GetUsersDto): Promise<{
    users: Omit<
      User,
      "password" | "createdAt" | "modifiedAt" | "status" | "isDeleted"
    >[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.userService.getUsers(getUsersDto);
  }

  @Get(":id")
  getUserById(
    @Param("id", new ParseIntPipe()) id: number
  ): Promise<Omit<User, "password" | "createdAt" | "modifiedAt">> {
    return this.userService.getUserById(id);
  }

  @Put(":id")
  updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Omit<User, "password">> {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(":id")
  deleteUser(
    @Req() req,
    @Param("id") id: number
  ): Promise<{ message: string }> {
    const removerEmail = req.user.email;
    return this.userService.deleteUser(+id, removerEmail);
  }

  @Roles(UserRoles.ADMIN)
  @Post("generate-password")
  generatePassword(@Body() generatePasswordDto: GeneratePasswordDto) {
    return this.userService.generatePassword(generatePasswordDto);
  }
}
