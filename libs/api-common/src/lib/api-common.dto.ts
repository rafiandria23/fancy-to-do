import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Dayjs } from 'dayjs';

import {
  RADIX,
  PaginationPage,
  PaginationSize,
  SortDirection,
} from './api-common.constant';

export class SuccessTimestampDto<MD = undefined, D = undefined> {
  @ApiProperty()
  public readonly success: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  public readonly timestamp: Dayjs;

  @ApiProperty()
  public readonly metadata: MD = undefined;

  @ApiProperty()
  public readonly data: D = undefined;
}

export class RawSuccessTimestampDto extends PickType(SuccessTimestampDto, [
  'success',
  'timestamp',
] as const) {}

export class ReadAllMetadataDto {
  @ApiProperty()
  public readonly total: number;
}

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    minimum: PaginationPage.MIN,
    default: PaginationPage.MIN,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Min(PaginationPage.MIN)
  @IsNumber()
  @IsOptional()
  public readonly page?: number = PaginationPage.MIN;

  @ApiProperty({
    required: false,
    minimum: PaginationSize.MIN,
    maximum: PaginationSize.MAX,
    default: PaginationSize.DEFAULT,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(PaginationSize.MAX)
  @Min(PaginationSize.MIN)
  @IsNumber()
  @IsOptional()
  public readonly page_size?: number = PaginationSize.DEFAULT;
}

export class SortQueryDto {
  @ApiProperty({
    required: false,
    enum: SortDirection,
  })
  @IsEnum(SortDirection)
  @IsString()
  @IsOptional()
  public readonly sort?: SortDirection = SortDirection.ASC;
}
