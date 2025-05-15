import { Transaction } from "sequelize";
import Servico from '../models/Servico';
import Usuario from "../models/Usuario";

export default class ServicoDao{
    public cadastrarServico = async (idUsuario: string, idTipoServico: number, nomeServico:string, descricaoServico:string, unidadeCobranca: string, valorServico:number, qntMinima: number, qntMaxima:number, imagem1:string, imagem2:string | null, imagem3:string | null,imagem4:string | null, imagem5:string | null, imagem6:string | null, transaction: Transaction | null = null)=>{
        const servico: Servico = await Servico.create({
            idUsuario,
            idTipoServico,
            nomeServico,
            descricaoServico,
            unidadeCobranca,
            valorServico,
            qntMinima,
            qntMaxima,
            imagem1,
            imagem2,
            imagem3,
            imagem4,
            imagem5,
            imagem6 
        }, transaction ? {transaction} : {});
        return servico;
    }

    public buscarServicoPorId = async (idServico: string):Promise<Servico | null> =>{
        const servico: Servico | null = await Servico.findByPk(idServico);
        return servico;
    }
    
    public listarServicos = async (emailUsu: string):Promise<Servico[]> =>{
        const usuario: Usuario | null = await Usuario.findOne({
            where: {
                emailUsu
            }
        });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        const idUsuario = usuario?.codigoUsu;

        const servicos: Servico[] = await Servico.findAll({
            where: {
                idUsuario
            }
        });
        return servicos;
    }
}