import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { criptografarSenha } from '../utils/criptografiaSenha';

class Usuario extends Model{
    declare codigoUsu: string;
    declare emailUsu: string;
    declare senhaUsu: string;
    declare nomeUsu: string;
    declare sobrenomeUsu: string;
    declare fotoUsu: string | null;
    declare dtNasUsu: Date;
    declare telUsu: string;
    declare cpfUsu: string;
    declare nomeEmpresa: string;
    declare fotoEmpresa: string | null;
    declare telEmpresa: string;
    declare cnpjEmpresa: string;
    declare localizacaoEmpresa: string;
    declare tokenRedefinicaoSenha: string;
    declare tokenUtilizado: boolean;
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
    sobrenomeUsu:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fotoUsu: { 
        type: DataTypes.STRING, 
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
        type: DataTypes.STRING, 
        allowNull:true
    },
    telEmpresa: { 
        type: DataTypes.STRING, 
        allowNull:true
    },
    cnpjEmpresa: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: true
    },
    localizacaoEmpresa: {
        type: DataTypes.STRING, 
        allowNull:true
    },
    tokenRedefinicaoSenha: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    tokenUtilizado: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'USUARIO',
    timestamps: false,
    underscored: true,
    hooks: {
        beforeCreate: async (usuario: Usuario) => { 
            usuario.senhaUsu = await criptografarSenha(usuario.senhaUsu) 
        },
        async beforeUpdate(instance) {
            if(instance.changed('senhaUsu')){
                instance.senhaUsu = await criptografarSenha(instance.senhaUsu)
            }
        }
    }
});

export default Usuario