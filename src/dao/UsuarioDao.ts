import { Transaction } from "sequelize";
import Usuario from "../models/Usuario";

export default class UsuarioDao{
    public async cadastrarUsuario(emailUsu: string, senhaUsu: string, nomeUsu: string, sobrenomeUsu: string, fotoUsu: Buffer, dtNasUsu: Date, telUsu: string, cpfUsu: string, nomeEmpresa: string, fotoEmpresa: Buffer, telEmpresa: string, cnpjEmpresa: string, localizacaoEmpresa: string, transaction: Transaction | null = null){
        const usuario: Usuario = await Usuario.create({
            emailUsu,
            senhaUsu,
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
        }, transaction ? {transaction} : {});
        return usuario;
    }

    public async atualizarUsuario(usuario: Usuario, transaction: Transaction | null = null){
        return await usuario.save(transaction ? {transaction} : {});
    }

    public async buscarUsuarioPorEmail(emailUsu: string, transaction: Transaction | null = null){
        const usuario: Usuario | null = await Usuario.findOne({
            where: {
                emailUsu
            },
            transaction
        });
        return usuario;
    }
}