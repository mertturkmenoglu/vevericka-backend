import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Pagination } from './PaginatedResult';
import { PaginationOrder } from './PaginationOrder';

export class PaginationQuery {
  @ApiPropertyOptional({ enum: PaginationOrder, default: PaginationOrder.DESC, name: 'order' })
  @IsEnum(PaginationOrder)
  @IsOptional()
  @Expose({ name: 'order' })
  private readonly _order?: PaginationOrder = PaginationOrder.DESC;

  @ApiPropertyOptional({
    name: 'page',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @Expose({ name: 'page' })
  private readonly _page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    name: 'pageSize',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Expose({ name: 'pageSize' })
  private readonly _pageSize?: number = 10;

  get page(): number {
    return this._page || 1;
  }

  get pageSize(): number {
    return this._pageSize || 10;
  }

  get order(): PaginationOrder {
    return this._order || PaginationOrder.DESC;
  }

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }

  getPaginationMeta(totalRecords: number): Pagination {
    const totalPages = Math.ceil(totalRecords / this.pageSize);
    return {
      currentPage: this.page,
      pageSize: this.pageSize,
      totalPages,
      totalRecords: totalRecords,
      order: this.order,
      hasPrevPage: this.page > 1,
      hasNextPage: this.page < totalPages,
    };
  }
}
