import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { Short } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginatedResults } from 'src/types/PaginatedResult';
import { PaginationQuery } from 'src/types/PaginationQuery';
import { CreateShortDto } from './dto/create-short.dto';
import { ShortService } from './short.service';
import { SingleShort } from './types/single-short.type';

@ApiTags('short')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'short',
})
export class ShortController {
  constructor(private readonly shortService: ShortService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getShortById(@Param('id', ParseIntPipe) id: number): Promise<SingleShort> {
    const { data, exception } = await this.shortService.getShortById(id);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @HttpCode(201)
  async createShort(@Body() dto: CreateShortDto): Promise<SingleShort> {
    const { data, exception } = await this.shortService.createShort(dto);

    if (!data) {
      throw exception;
    }

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteShortById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const { data, exception } = await this.shortService.deleteShortById(id);

    if (!data) {
      throw exception;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:username/shorts')
  async getShortsByUsername(
    @Param('username') username: string,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<PaginatedResults<Omit<Short, 'user'>[]>> {
    const [shorts, totalRecords] = await this.shortService.getShortsByUsername(
      username,
      paginationQuery,
    );

    if (!shorts) {
      throw new NotFoundException(`Shorts not found: ${username}`);
    }

    return {
      data: shorts,
      pagination: paginationQuery.getPaginationMeta(totalRecords),
    };
  }
}
