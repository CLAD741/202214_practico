import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i =0; i < 5; i++){
      const club: ClubEntity =  await repository.save({
        nombre: faker.name.firstName(),
        fechaFundacion: faker.date.birthdate(),
        imagenUrl: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence(),
        socios: []
      });
      clubList.push(club);
    }

  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne should return a club by id', async () => {
    const clubDB: ClubEntity =clubList[0];
    const club: ClubEntity = await service.findOne(clubDB.id);
    expect(club).not.toBeNull();
    expect(club.descripcion).toEqual(clubDB.descripcion);
    expect(club.fechaFundacion).toEqual(clubDB.fechaFundacion);
    expect(club.nombre).toEqual(clubDB.nombre);
    expect(club.imagenUrl).toEqual(clubDB.imagenUrl);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(()=> service.findOne('0')).rejects.toHaveProperty('message','el club con el id dado no fue encontrado');
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      imagenUrl: faker.image.imageUrl(),
      fechaFundacion: faker.date.birthdate(),
      socios: []
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const clubDB: ClubEntity = await repository.findOne({where: {id: newClub.id}});
    expect(clubDB).not.toBeNull();
    expect(clubDB.descripcion).toEqual(newClub.descripcion);
    expect(clubDB.fechaFundacion).toEqual(newClub.fechaFundacion);
    expect(clubDB.imagenUrl).toEqual(newClub.imagenUrl);
    expect(clubDB.nombre).toEqual(newClub.nombre);
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = 'new nombre';
    club.descripcion ='new description';
    const updateClub: ClubEntity = await service.update(club.id, club);
    expect(updateClub).not.toBeNull();
    const clubDB: ClubEntity = await repository.findOne({where: {id: club.id}});
    expect(clubDB).not.toBeNull();
    expect(clubDB.nombre).toEqual(club.nombre);
    expect(clubDB.descripcion).toEqual(club.descripcion);
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, nombre: 'new nombre', descripcion: 'new descripcion'
    }
    await expect(()=> service.update('0', club)).rejects.toHaveProperty('message','el club con el id dado no fue encontrado');
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    const deletedClub: ClubEntity = await repository.findOne({where: {id: club.id}});
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(()=> service.delete("0")).rejects.toHaveProperty('message','el club con el id dado no fue encontrado');
  });
});
