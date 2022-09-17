import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubSocioService {

  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>
  ){}

  async addMembersToClub(clubId: string, socioId:string):Promise<ClubEntity>{
    const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});

    if (!club)
    throw new BusinessLogicException("El club con el id dado no fue encontrado", BusinessError.NOT_FOUND);

    const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ['clubs']})
    if (!socio){
      throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }
    club.socios = [...club.socios, socio];
    return await this.clubRepository.save(club);
    }

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]>{
    const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});

    if (!club)
      throw new BusinessLogicException("El club con el id dado no fue encontrado", BusinessError.NOT_FOUND);

    return club.socios;
  }


  async findMemberFromClub(clubId:string, socioId: string){
    const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});

    if (!club){
      throw new BusinessLogicException("El club con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}})
    if (!socio){
      throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    const clubSocio: SocioEntity = club.socios.find(socioBD => socioBD.id === socio.id);
    if(!clubSocio){
      throw new BusinessLogicException("El socio no pertenece al club dado", BusinessError.NOT_FOUND);
    }

    return clubSocio;
  }
  
  async updateMembersFromClub(clubId: string, socios: SocioEntity[]){
    const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});

    if (!club){
      throw new BusinessLogicException("El club con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    for(let i=0; i< socios.length; i++){
      const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}})
      if(!socio){
        throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
      }
    }
    club.socios = socios;
    return await this.clubRepository.save(club);
  }
  
  async deleteMemberFromClub(clubId: string, socioId: string){
    const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ['socios']});

    if (!club){
      throw new BusinessLogicException("El club con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ['clubs']})
    if (!socio){
      throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    }

    const clubSocio: SocioEntity = club.socios.find(socioBD => socioBD.id === socio.id);
    if(!clubSocio){
      throw new BusinessLogicException("El socio no pertenece al club dado", BusinessError.NOT_FOUND);
    }
    club.socios = club.socios.filter(e => e.id !== socioId);
    await this.clubRepository.save(club);
  }


}
