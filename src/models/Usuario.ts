import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Usuario extends Model{
    declare codigoUsu: string;
    declare emailUsu: string;
    declare senhaUsu: string;
    declare nomeUsu: string;
    declare fotoUsu: Buffer;
    declare dt_nasUsu: Date;
    declare telUsu: string;
    declare cpfUsu: string;
    declare nomeEmpresa: string;
    declare fotoEmpresa: Buffer;
    declare telEmpresa: string;
    declare cnpjEmpresa: string;
    declare localizacaoEmpresa: string;
}

Usuario.init({
    codigoUsu: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true, 
        allowNull: false
    },
    emailUsu: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    senhaUsu: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    nomeUsu: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    fotoUsu: { 
        type: DataTypes.BLOB, 
        allowNull: true 
    },
    dtNasUsu: { 
        type: DataTypes.DATEONLY, 
        allowNull: true 
    },
    telUsu: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    cpfUsu: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        unique: true
    },
    nomeEmpresa: { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    fotoEmpresa: { 
        type: DataTypes.BLOB, 
        allowNull:true
    },
    telEmpresa: { 
        type: DataTypes.STRING, 
        allowNull:true
    },
    cnpjEmpresa: { 
        type: DataTypes.STRING, 
        allowNull: true
    },
    localizacaoEmpresa: {
        type: DataTypes.STRING, 
        allowNull:true
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'USUARIO',
    timestamps: false,
    underscored: true
});

export default Usuario