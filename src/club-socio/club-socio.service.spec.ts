import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubSocioService } from './club-socio.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socioList = [];
    for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await socioRepository.save({
        usuario: faker.name.firstName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.birthdate(),
        clubs: []
      });
      socioList.push(socio);
    }

    club =  await clubRepository.save({
      nombre: faker.name.firstName(),
      fechaFundacion: faker.date.birthdate(),
      imagenUrl: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: []
    });
  
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
