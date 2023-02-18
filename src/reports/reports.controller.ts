import { User } from './../users/user.entity';
import { AuthGuard } from './../guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() dto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(dto, user);
  }
}
