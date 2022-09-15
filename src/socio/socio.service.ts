import { Injectable } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>
  ){}

  async findAll(): Promise<SocioEntity[]>{
    return await this.socioRepository.find({relations: ['clubs']})
  }

  async findOne(id: string): Promise<SocioEntity>{
    const socioDB: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ['clubs']})
    if(!socioDB){
      throw new BusinessLogicException('Socio con el id dado no fue encontrado',BusinessError.NOT_FOUND );
    }
    return socioDB;
  }
  
  async create(socio: SocioEntity): Promise<SocioEntity>{
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity>{
    const socioDB: SocioEntity = await this.socioRepository.findOne({where:{id}});
    if(!socioDB){
      throw new BusinessLogicException('Socio con el id dado no fue encontrado',BusinessError.NOT_FOUND)
    }
    return await this.socioRepository.save({...socioDB, ...socio});
  }

  async delete(id: string ){
    const socioDB: SocioEntity = await this.socioRepository.findOne({where:{id}});
    if(!socioDB){
      throw new BusinessLogicException('Socio con el id dado no fue encontrado',BusinessError.NOT_FOUND)
    }

    await this.socioRepository.remove(socioDB);
  }
  
}
