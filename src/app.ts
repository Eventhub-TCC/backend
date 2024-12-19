import express from 'express'
require('dotenv').config()
const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken')

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


class Usuario extends Model {}
Usuario.init({
    codigo_usu: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
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
    id_usu : {type: DataTypes.STRING, primaryKey: true, foreignKey:true , allowNull: false},
    id_tipo : {type: DataTypes.INTEGER, primaryKey: true, foreignKey:true, allowNull: false}
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
        const { codigo_usu, email_usu, senha_usu, nome_usu, foto_usu, dt_nas_usu, tel_usu, cpf_usu, nome_empresa, foto_empresa, tel_empresa, cnpj_empresa, localizacao_empresa, id_tipo} = req.body
        const criptografada = await bcrypt.hash(senha_usu, 10)

        const usuario = await Usuario.create({
            codigo_usu,
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
            id_usu: codigo_usu,
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
    const senhaValida = await bcrypt.compare(senhaLogin, u.senha_usu)
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
   