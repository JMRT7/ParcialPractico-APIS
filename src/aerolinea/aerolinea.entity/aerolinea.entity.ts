
import { AeropuertoEntity } from "../../aeropuerto/aeropuerto.entity/aeropuerto.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    aerolineaId: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    fechaFundacion: string;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    @JoinTable()
    aeropuertos: AeropuertoEntity[];
}
