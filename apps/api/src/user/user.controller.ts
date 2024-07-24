import {
  Controller,
  UseInterceptors,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transaction as SequelizeTransaction } from 'sequelize';

import {
  ApiRequest,
  RawSuccessTimestampDto,
  ReadAllMetadataDto,
  ApiCommonService,
} from '@libs/api-common';
import { DocsTag } from '@libs/api-docs';
import { Transaction, TransactionInterceptor } from '@libs/api-db';
import { Auth } from '@libs/api-auth';

import {
  UserDto,
  ReadUserByIdParamDto,
  ReadAllUsersQueryDto,
  UpdateUserBodyDto,
} from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('/users')
@UseInterceptors(TransactionInterceptor)
@ApiTags(DocsTag.USER)
@ApiBearerAuth()
@ApiExtraModels(RawSuccessTimestampDto, ReadAllMetadataDto, UserDto)
export class UserController {
  constructor(
    private readonly apiCommonService: ApiCommonService,
    private readonly userService: UserService
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            metadata: {
              $ref: getSchemaPath(ReadAllMetadataDto),
            },
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(UserDto),
              },
            },
          },
          required: ['metadata', 'data'],
        },
      ],
    },
  })
  public readAll(
    @Query() queries: ReadAllUsersQueryDto,
    @Transaction() transaction?: SequelizeTransaction
  ) {
    return this.userService.readAll(queries, {
      transaction,
    });
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(UserDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async me(
    @Auth() auth: ApiRequest['auth'],
    @Transaction() transaction?: SequelizeTransaction
  ) {
    const existingUser = await this.userService.readById(auth.user_id, {
      transaction,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.apiCommonService.successTimestamp<undefined, UserDto>({
      data: existingUser,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(RawSuccessTimestampDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async readById(
    @Param() params: ReadUserByIdParamDto,
    @Transaction() transaction?: SequelizeTransaction
  ) {
    const existingUser = await this.userService.readById(params.id, {
      transaction,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.apiCommonService.successTimestamp<undefined, UserDto>({
      data: existingUser,
    });
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public update(
    @Auth() auth: ApiRequest['auth'],
    @Body() payload: UpdateUserBodyDto,
    @Transaction() transaction?: SequelizeTransaction
  ) {
    return this.userService.update(auth.user_id, payload, { transaction });
  }
}
