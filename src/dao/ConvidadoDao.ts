import Convite from '../models/Convite';
import Convidado from '../models/Convidado';
import { Transaction } from 'sequelize';

export default class ConvidadoDao {
  public criarConvidado = async (idConvite: string, nome: string, email: string, rg: string, dataNascimento: Date, transaction: Transaction | null = null) => {
    const convidado = await Convidado.create({
      nome,
      email,
      rg,
      dataNascimento,
      status: "Pendente",
      idConvite
    }, { transaction });
    return convidado;
  };

  public listarConvidados = async (idEvento: string) => {
        const convidados = await Convidado.findAll({
            include: [{
                model: Convite,
                as: 'Convite',
                where: {
                  idEvento
                }
              }],
        });
    return convidados;
  };

  public atualizarStatusConvidadoDAO = async (idConvidado: string, status: string) => {
    try {
      const convidado = await Convidado.findByPk(idConvidado);
      if (!convidado) {
        throw new Error('Convidado não encontrado');
      }
      convidado.status = status;
      await convidado.save();
      return convidado;
    } catch (error) {
      console.error('Erro ao atualizar status do convidado:', error);
      throw error;
    }
  }
}