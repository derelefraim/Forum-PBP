    import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
    import { Users } from "./Users";
import { defaultValueSchemable } from "sequelize/lib/utils";

    @Table({
        tableName: "posts",
        timestamps: true,
        })

        export class Posts extends Model        {


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
        title!: string;

        @Column({
            type: DataType.STRING,
            allowNull: false,
        })
        content!: string;

        @ForeignKey(() => Users)  // Specify that this foreign key references the User model
        @Column({
            type: DataType.INTEGER,
            allowNull: false,
        })
        user_id!: number;


        @Column({
            type: DataType.INTEGER,
            allowNull: false,
            defaultValue:0,
        })
        likes!: number;

    }
