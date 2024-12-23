import { Request, Response } from "express";
import { sequelize } from "../config/database";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario";
import UsuarioTipo from "../models/UsuarioTipo";
import UsuarioDao from "../dao/UsuarioDao";
import UsuarioTipoDao from "../dao/UsuarioTipoDao";
import { compararSenha } from "../utils/criptografiaSenha";
import enviarEmailRecuperacaoSenha from "../utils/enviaEmail";

export default class UsuarioController {
    private usuarioDao = new UsuarioDao();
    private usuarioTipoDao = new UsuarioTipoDao();

    public cadastrarUsuario = async (req: Request, res: Response) => {
        const transaction = await sequelize.transaction();
        try{
            const { emailUsu, senhaUsu, nomeUsu, sobrenomeUsu, fotoUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, fotoEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa, idTipo} = req.body;

            const usuario: Usuario = await this.usuarioDao.cadastrarUsuario(emailUsu, senhaUsu, nomeUsu, sobrenomeUsu, fotoUsu, dtNasUsu, telUsu, cpfUsu, nomeEmpresa, fotoEmpresa, telEmpresa, cnpjEmpresa, localizacaoEmpresa, transaction);

            const usuarioTipo: UsuarioTipo = await this.usuarioTipoDao.cadastrarUsuarioTipo(usuario.codigoUsu, idTipo, transaction);
    
            await transaction.commit();
            console.log(usuario.toJSON());
            console.log(usuarioTipo.toJSON());

            res.status(201).json({ message: 'Usuario cadastrado com sucesso!' });
        }   
        catch (error: any) {
            await transaction.rollback();
            console.error("Erro ao cadastrar usuario",error);
            res.status(409).json({ error: 'Erro ao cadastrar usuario' });
        }  
    }

    public fazerLogin = async (req: Request, res: Response) => {
        try{
            const { email, senha } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(email);
            if(!usuario) {
                res.status(401).json({mensagem: "login inválido"});
                return;
            }
            const senhaValida = await compararSenha(senha, usuario.senhaUsu);
            if(!senhaValida){
                res.status(401).json({mensagem: "senha inválida"});
                return;
            }
        
            const token = jwt.sign(
                {email},
                process.env.JWT_SECRET_LOGIN!,
                {expiresIn: "1h"}
            );
            res.status(200).json({mensagem: "Usuario autenticado com sucesso!", token});
        }
        catch(error){
            console.error('Erro ao autenticar usuario');
            res.status(500).json({mensagem: "Erro ao autenticar usuario"});
        }
    }

    public esqueciSenha = async (req: Request, res: Response) => {
        try{
            const { email } = req.body;
            const usuario: Usuario | null = await this.usuarioDao.buscarUsuarioPorEmail(email);
            if(!usuario) {
                res.status(404).json({mensagem: "E-mail não encontrado"});
                return;
            }
            const token = jwt.sign({email}, process.env.JWT_SECRET_RESET_PASSWORD!, {expiresIn: "15m"});
            usuario.tokenRedefinicaoSenha = token;
            usuario.tokenUtilizado = false;
            await this.usuarioDao.atualizarUsuario(usuario);
            await enviarEmailRecuperacaoSenha(email, usuario.nomeUsu, token);
            res.status(200).json({mensagem: "Email de recuperação enviado com sucesso!"});
        }
        catch(error){
            console.error('Erro ao enviar email');
            res.status(500).json({mensagem: "Erro ao enviar email"});
        }
    }
}