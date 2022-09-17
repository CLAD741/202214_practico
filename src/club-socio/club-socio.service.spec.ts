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
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    socioRepository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        usuario: faker.name.firstName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.birthdate(),
        clubs: [],
      });
      socioList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.name.firstName(),
      fechaFundacion: faker.date.birthdate(),
      imagenUrl: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: socioList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add member to club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });

    const newClub: ClubEntity =  await clubRepository.save({
      nombre: faker.name.firstName(),
      fechaFundacion: faker.date.birthdate(),
      imagenUrl: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: []
    });

    const result: ClubEntity = await service.addMembersToClub(newClub.id, newSocio.id);
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].usuario).toBe(newSocio.usuario);
    expect(result.socios[0].fechaNacimiento).toStrictEqual(newSocio.fechaNacimiento);
    expect(result.socios[0].correo).toBe(newSocio.correo);
  });

  it('addMemberToClub should throw exception invalid socio', async () => {
    const newClub: ClubEntity =  await clubRepository.save({
      nombre: faker.name.firstName(),
      fechaFundacion: faker.date.birthdate(),
      imagenUrl: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: []
    });
    await expect(()=> service.addMembersToClub(newClub.id,"0")).rejects.toHaveProperty('message','El socio con el id dado no fue encontrado');
  });
  it('addMemberToClub should throw exception invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });
    await expect(()=> service.addMembersToClub("0",newSocio.id)).rejects.toHaveProperty('message','El club con el id dado no fue encontrado');
  });

  it('findMemberFromClub should return socio by club ', async () => {
    const socio: SocioEntity = socioList[0];
    const socioDB: SocioEntity = await service.findMemberFromClub(club.id,socio.id)
    expect(socioDB).not.toBeNull();
    expect(socioDB.usuario).toBe(socio.usuario);
    expect(socioDB.correo).toBe(socio.correo);
    expect(socioDB.fechaNacimiento).toStrictEqual(socio.fechaNacimiento);
  });
  it('findMemberFromClub should throw an exception for invalid socio ', async () => {
    await expect(()=> service.findMemberFromClub(club.id,"0")).rejects.toHaveProperty('message','El socio con el id dado no fue encontrado');
  });
  it('findMemberFromClub should throw an exception for invalid socio ', async () => {
    const socio: SocioEntity = socioList[0];
    await expect(()=> service.findMemberFromClub("0",socio.id)).rejects.toHaveProperty('message','El club con el id dado no fue encontrado');
  });
  it('findMemberFromClub should throw an exception not associated socio ', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });
    await expect(()=> service.findMemberFromClub(club.id,newSocio.id)).rejects.toHaveProperty('message','El socio no pertenece al club dado');
  });

  it('findMembersFromClub should return socios by club', async ()=>{
    const socios: SocioEntity[] =await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5);
  });
  it('findMembersFromClub should throw exception for invalid error', async ()=>{
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty('message','El club con el id dado no fue encontrado');
  });

  it('updateMembersFromClub should update socios list for a club', async ()=>{
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });

    const updateClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updateClub.socios.length).toBe(1);
    expect(updateClub.socios[0].usuario).toBe(newSocio.usuario);
    expect(updateClub.socios[0].correo).toBe(newSocio.correo);
    expect(updateClub.socios[0].fechaNacimiento).toStrictEqual(newSocio.fechaNacimiento);
  });
  it('updateMembersFromClub should throw exception for invalid club', async ()=>{
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });
    await expect(()=> service.updateMembersFromClub("0",[newSocio])).rejects.toHaveProperty('message','El club con el id dado no fue encontrado');
  });
  it('updateMembersFromClub should throw exception for invalid socio', async ()=>{
    const newSocio: SocioEntity = socioList[0];
    newSocio.id = "0";
    await expect(()=> service.updateMembersFromClub(club.id,[newSocio])).rejects.toHaveProperty('message','El socio con el id dado no fue encontrado');
  });

  it('deleteMemberFromClub should remove an socio from a club', async ()=>{
    const socio: SocioEntity = socioList[0];
    await service.deleteMemberFromClub(club.id, socio.id);
    const clubDB: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedSocio: SocioEntity = clubDB.socios.find(a => a.id === socio.id);
    expect(deletedSocio).toBeUndefined();
  });
  it('deleteMemberFromClub should throw exception for invalid socio', async ()=>{
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty('message','El socio con el id dado no fue encontrado');
  });
  it('deleteMemberFromClub should throw exception for invalid club', async ()=>{
    const socio: SocioEntity = socioList[0];
    await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty('message','El club con el id dado no fue encontrado');
  });
  it('deleteMemberFromClub should throw exception for non associated socio', async ()=>{
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: [],
    });
    await expect(()=> service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty('message','El socio no pertenece al club dado');
  });
});
