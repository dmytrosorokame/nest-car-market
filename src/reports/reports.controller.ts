import { Body, Controller, Post } from '@nestjs/common';
import { CreateReportDto } from './dtos';

@Controller('reports')
export class ReportsController {
  @Post()
  createReport(@Body() dto: CreateReportDto) {}
}
