import { AdminGuard } from './../guards/admin.guard';
import { User } from './../users/user.entity';
import { AuthGuard } from './../guards/auth.guard';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApproveReportDto, CreateReportDto, ReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() dto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id', ParseIntPipe) reportId: number,
    @Body() dto: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(reportId, dto.approve);
  }
}
