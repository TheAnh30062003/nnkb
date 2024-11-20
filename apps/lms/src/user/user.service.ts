import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import { snakeCase } from "change-case-object";
import { GetUsersDto } from "./dto/get-users.dto";
import { compareSync } from "bcryptjs";
import generator from "generate-password";
import dayjs from "dayjs";
import { UserStatus } from "./user.types";
import { GeneratePasswordDto } from "./dto/generate-password.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  checkUserIsExpired = (user: User) =>
    user.status === UserStatus.PENDING &&
    dayjs().isAfter(dayjs(user.expiredAt));

  async createUser(data: CreateUserDto): Promise<any> {
    const randomPin = this.generateRandomPin();
    const hashedPassword = await bcrypt.hash(randomPin, 10);

    try {
      await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          status: UserStatus.PENDING,
          expiredAt: dayjs().add(7, "day").format(),
        },
      });
      return {
        email: data.email,
        password: randomPin,
      };
    } catch (error) {
      if (error.meta?.target?.includes("email")) {
        throw new ConflictException("Email already exists");
      }
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(
    id: number
  ): Promise<Omit<User, "password" | "createdAt" | "modifiedAt">> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          dob: true,
          role: true,
          status: true,
          createdBy: true,
          isDeleted: true,
          modifiedBy: true,
          expiredAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      }
      console.error("Error retrieving user:", error);
      throw new error();
    }
  }

  async getUsers(getUsersDto: GetUsersDto): Promise<{
    users: Omit<
      User,
      "password" | "createdAt" | "modifiedAt" | "status" | "isDeleted"
    >[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  }> {
    const {
      pageNumber = 1,
      pageSize = 10,
      role,
      sortOrder,
      sortBy,
      keyword,
    } = getUsersDto;
    const where: any = keyword
      ? {
          isDeleted: false,
          OR: [
            {
              lastName: {
                contains: keyword,
                mode: "insensitive", // Optional: makes the search case-insensitive
              },
            },
            {
              firstName: {
                contains: keyword,
                mode: "insensitive", // Optional: makes the search case-insensitive
              },
            },
            {
              email: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
          ...(role && { role }),
        }
      : role
        ? { role }
        : undefined;
    const orderBy =
      sortOrder && sortBy
        ? { [sortBy]: sortOrder }
        : { email: sortOrder || "desc" };
    // Get total count of users matching the criteria
    const totalCount = await this.prisma.user.count({ where });
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);
    // Fetch users with pagination and sorting
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        dob: true,
        role: true,
        status: true,
        createdBy: true,
        isDeleted: true,
        modifiedBy: true,
        expiredAt: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: [orderBy],
    });
    if (users.length > 0) {
      return {
        users,
        totalCount,
        totalPages,
        pageNumber,
        pageSize,
      };
    } else {
      throw new BadRequestException("No users found");
    }
  }

  async updateUser(
    id: number,
    data: UpdateUserDto
  ): Promise<Omit<User, "password">> {
    const updateUserInput = snakeCase(data);

    try {
      const { password, ...updatedUser } = await this.prisma.user.update({
        where: { id: id },
        data: {
          ...updateUserInput,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025 is the error code for a record not found
        if (error.code === "P2025") {
          throw new NotFoundException(`User is not found`);
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException("Invalid input data");
      }
      throw error;
    }
  }

  async deleteUser(
    id: number,
    removerEmail: string
  ): Promise<{ message: string }> {
    try {
      await this.prisma.user.update({
        where: { id, isDeleted: false },
        data: {
          isDeleted: true,
        },
      });
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findOneByKeyValue(key: string, value: any) {
    const user = await this.prisma.user.findFirst({
      where: { [key]: value },
    });
    if (!user || user.isDeleted) {
      throw new NotFoundException("userIsNotFound");
    }
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  private generateRandomPin(): string {
    const pin = generator.generate({
      length: 8,
      numbers: true,
    });
    return pin;
  }

  async generatePassword({ email }: GeneratePasswordDto) {
    const user = await this.findOneByKeyValue("email", email);
    if (this.checkUserIsExpired(user)) {
      const randomPin = this.generateRandomPin();
      const password = await bcrypt.hash(randomPin, 10);
      await this.prisma.user.update({
        where: { email },
        data: { password, expiredAt: dayjs().add(7, "day").format() },
      });
      return {
        password: randomPin,
      };
    } else {
      throw new NotAcceptableException("userIsNotExpired");
    }
  }

  updateUserRefreshOtp = async (refreshOtp, userId: number) => {
    await this.prisma.token.upsert({
      where: { userId },
      update: {
        refreshOtp,
      },
      create: {
        refreshOtp,
        userId,
      },
    });
  };
}
