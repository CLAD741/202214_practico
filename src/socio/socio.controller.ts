import { Controller, UseInterceptors,Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { SocioService } from './socio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';

@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
  constructor(private readonly socioService:SocioService){}

@Get()
async findAll(){
  return await this.socioService.findAll();
}

@Get(':socioId')
async findOne(@Param('socioId')socioId: string){
  return await this.socioService.findOne(socioId);
}

@Post()
async create(@Body() socioDto:SocioDto){
  const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
  return await this.socioService.create(socio);
}

@Put(':socioId')
async update(@Param('socioId')socioId: string, @Body()socioDto: SocioDto){
  const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
  return await this.socioService.update(socioId, socio);
}
@Delete(':socioId')
@HttpCode(204)
async delete(@Param('socioId')socioId: string){
  return await this.socioService.delete(socioId);
}
}
