import express from 'express'
require('dotenv').config()
import { Sequelize, DataTypes, Model, UUID } from 'sequelize';
import bcrypt from 'bcrypt';
const app = express()
app.use(express.json());
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

app.use(express.json());

const {
    port,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DATABASE,
    DB_PORT
  } = process.env;

const sequelize = new Sequelize(DB_DATABASE!, DB_USER!, DB_PASSWORD!, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});


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
  
  Usuario_tipo.belongsTo(Usuario, { foreignKey: 'id_usu' });


  (async () => {
    try {
        await sequelize.sync();
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao sincronizar modelos:', error);
    }
})();

app.post('/signup', async (req, res) => {
    const transaction = await sequelize.transaction()
    try{
        const { email_usu, senha_usu, nome_usu, foto_usu, dt_nas_usu, tel_usu, cpf_usu, nome_empresa, foto_empresa, tel_empresa, cnpj_empresa, localizacao_empresa, id_tipo} = req.body
        const criptografada = await bcrypt.hash(senha_usu, 10)
        const codigo_gerado = uuidv4()
        const usuario = await Usuario.create({
            codigo_usu: codigo_gerado,
            email_usu,
            senha_usu: criptografada,
            nome_usu,
            foto_usu,
            dt_nas_usu,
            tel_usu,
            cpf_usu,
            nome_empresa,
            foto_empresa,
            tel_empresa,
            cnpj_empresa,
            localizacao_empresa
        }, {transaction});

        const usuario_tipo = await Usuario_tipo.create({
            id_usu: codigo_gerado,
            id_tipo
        }, {transaction})

        await transaction.commit();
        console.log(usuario.toJSON());
        console.log(usuario_tipo.toJSON());
        res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
    }   catch (error) {
        console.error(error);
        res.status(409).json({ error: 'Erro ao cadastrar Usuario' });
        }  
    })


app.post("/signin", async (req, res) => {
    const { emailLogin, senhaLogin } = req.body
    const u = await Usuario.findOne({
        where: {
            email_usu : emailLogin
        }
    })  
    if(!u) {
        res.status(401).json({mensagem: "login inválido"})
        return
    }
    const senhaValida = u && await bcrypt.compare(senhaLogin, u.senha_usu)
    if(!senhaValida){
        res.status(401).json({mensagem: "senha inválida"})
        return
    }

    const token = jwt.sign(
        {emailLogin},
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token})
})

app.listen(port, () => console.log(`Servidor aberto na porta ${port}`))
   