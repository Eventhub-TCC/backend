import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface UsuarioAttributes {
    codigo_usu: string;
    email_usu: string;
    senha_usu: string;
    nome_usu?: string;
    foto_usu?: Buffer;
    dt_nas_usu?: Date;
    tel_usu?: string;
    cpf_usu?: string;
    nome_empresa?: string;
    foto_empresa?: Buffer;
    tel_empresa?: string;
    cnpj_empresa?: string;
    localizacao_empresa?: string;
}

class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
    public codigo_usu!: string;
    public email_usu!: string;
    public senha_usu!: string;
    public nome_usu?: string;
    public foto_usu?: Buffer;
    public dt_nas_usu?: Date;
    public tel_usu?: string;
    public cpf_usu?: string;
    public nome_empresa?: string;
    public foto_empresa?: Buffer;
    public tel_empresa?: string;
    public cnpj_empresa?: string;
    public localizacao_empresa?: string;
}
Usuario.init({
    codigo_usu: { type: DataTypes.STRING, primaryKey: true, allowNull: false},
    email_usu: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha_usu: { type: DataTypes.STRING, allowNull: false },
    nome_usu: { type: DataTypes.STRING, allowNull: true },
    foto_usu: { type: DataTypes.BLOB, allowNull: true },
    dt_nas_usu: { type: DataTypes.DATE, allowNull: true },
    tel_usu: { type: DataTypes.STRING, allowNull: true },
    cpf_usu: { type: DataTypes.STRING, allowNull: true, unique: true},
    nome_empresa: { type: DataTypes.STRING, allowNull: true},
    foto_empresa: { type: DataTypes.BLOB, allowNull:true},
    tel_empresa: { type: DataTypes.STRING, allowNull:true},
    cnpj_empresa: { type: DataTypes.STRING, allowNull: true},
    localizacao_empresa: {type: DataTypes.STRING, allowNull:true}
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'USUARIO',
    timestamps: false
  });

  export default Usuario