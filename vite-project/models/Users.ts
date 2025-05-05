import { Table, Column, Model, DataType } from "sequelize-typescript";


@Table({
    tableName: "users",
    timestamps: true,
    })

    export class Users extends Model        {


    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number = 0;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

}
