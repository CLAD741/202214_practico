import { ClubEntity } from 'src/club/club.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  usuario: string;
  @Column()
  correo: string;
  @Column()
  fechaNacimiento: Date;
  @ManyToMany(()=> ClubEntity, club => club.socios)
  clubs: ClubEntity[]
}
