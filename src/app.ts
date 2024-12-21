import 'dotenv/config';
import express from 'express';
import sequelize from './config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from './models/Usuario';
import UsuarioTipo from './models/UsuarioTipo';
import cors from 'cors'

const app = express();

const {
    SERVER_PORT,
    JWT_SECRET,
    URL_FRONTEND
} = process.env;
    
app.use(cors({origin:URL_FRONTEND}))

app.use(express.json());


  
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
        const { emailUsu, senhaUsu, nomeUsu, sobrenomeUsu, fotoUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, fotoEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa, idTipo} = req.body
        const criptografada = await bcrypt.hash(senhaUsu, 10)
        const usuario = await Usuario.create({
            emailUsu,
            senhaUsu: criptografada,
            nomeUsu,
            sobrenomeUsu,
            fotoUsu,
            dtNasUsu,
            telUsu,
            cpfUsu,
            nomeEmpresa,
            fotoEmpresa,
            telEmpresa,
            cnpjEmpresa,
            localizacaoEmpresa
        }, {transaction});

        const usuarioTipo = await UsuarioTipo.create({
            idUsu: usuario.codigoUsu,
            idTipo
        }, {transaction})

        await transaction.commit();
        console.log(usuario.toJSON());
        console.log(usuarioTipo.toJSON());
        res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
    }   
    catch (error) {
        await transaction.rollback();
        console.error('Erro ao cadastrar usuario');
        res.status(409).json({ error: 'Erro ao cadastrar usuario' });
    }  
})


app.post("/signin", async (req, res) => {
    try{
        const { email, senha } = req.body
        const u = await Usuario.findOne({
            where: {
                emailUsu: email
            }
        })  
        if(!u) {
            res.status(401).json({mensagem: "login inválido"})
            return
        }
        const senhaValida = await bcrypt.compare(senha, u.senhaUsu)
        if(!senhaValida){
            res.status(401).json({mensagem: "senha inválida"})
            return
        }
    
        const token = jwt.sign(
            {email},
            JWT_SECRET!,
            {expiresIn: "1h"}
        )
        res.status(200).json({"mensagem": "Usuario autenticado com sucesso!", token})
    }
    catch(error){
        console.error('Erro ao autenticar usuario')
        res.status(500).json({mensagem: "Erro ao autenticar usuario"})
    }
})

app.listen(SERVER_PORT, () => console.log(`Servidor aberto na porta ${SERVER_PORT}`))
   