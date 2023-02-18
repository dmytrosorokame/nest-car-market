import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(dto: CreateReportDto) {
    const report = await this.repo.create(dto);

    return this.repo.save(report);
  }
}
