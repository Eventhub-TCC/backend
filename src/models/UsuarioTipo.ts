import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario'; 

class UsuarioTipo extends Model {
  declare idUsu: string;
  declare idTipo: number;
}

UsuarioTipo.init({
    idUsu : {
      type: DataTypes.UUID, 
      primaryKey: true, 
      allowNull: false, 
      references: { 
        model:Usuario, 
        key: 'codigo_usu'
      }
    },
    idTipo : {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UsuarioTipo',
    tableName: 'USUARIO_TIPO',
    timestamps: false,
    underscored: true
});

UsuarioTipo.belongsTo(Usuario, { foreignKey: 'id_usu' });

export default UsuarioTipo