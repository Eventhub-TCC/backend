import express from 'express'
import 'dotenv/config'
import bcrypt from 'bcrypt';
const app = express()
app.use(express.json());
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Usuario from './models/Usuario';
import Usuario_tipo from './models/Usuario_tipo';
import sequelize from './config/database';

app.use(express.json());

const {
    PORT
  } = process.env;
  
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

app.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}`))
   