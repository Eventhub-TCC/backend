import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario'; 

class Usuario_tipo extends Model {}
Usuario_tipo.init({
    id_usu : {type: DataTypes.STRING, primaryKey: true, allowNull: false, references: { model:Usuario, key: 'codigo_usu'}},
    id_tipo : {type: DataTypes.INTEGER, primaryKey: true, allowNull: false}
  }, {
    sequelize,
    modelName: 'Usuario_tipo',
    tableName: 'USUARIO_TIPO',
    timestamps: false
  });

  export default Usuario_tipo