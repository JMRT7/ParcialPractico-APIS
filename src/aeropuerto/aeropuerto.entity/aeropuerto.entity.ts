
import { AerolineaEntity } from "../../aerolinea/aerolinea.entity/aerolinea.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    aeropuertoId: string;

    @Column()
    nombre: string;

    @Column()
    codigo: number;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable()
    aerolineas: AerolineaEntity[];
    aerolineaId: string;
}
