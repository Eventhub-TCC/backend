import Convite from '../models/Convite';
import Convidado from '../models/Convidado';
import { v4 as uuidv4 } from 'uuid';

export default class ConviteDao {
  public listarConvite = async (idEvento: string) => {
    const convites = await Convite.findAll({
      where: {
        idEvento
        },
    });
    console.log("convites", convites);
    return convites;
  }

  public async gerarConvite(idEvento: number): Promise<Convite> {
    const uuidConvite = uuidv4();
    const link = `http://localhost:5173/confirmar-presenca/${uuidConvite}`;
    const dataConvite = new Date();

    const novoConvite = await Convite.create({
      idEvento,
      idConvidado: null,
      linkConvite: link,
      dataConvite,
      status: 'Pendente'
    });

    return novoConvite;
  }

  public async deletarConvite(idConvite: string): Promise<boolean> {
    try {
      const convite = await Convite.destroy({
        where: { idConvite: idConvite }
      });
  
      if (!convite) {
        throw new Error("Convite não encontrado");
      }
      return true;
    } catch (error) {
      console.error("Erro ao deletar convite:", error);
      throw error;
    }
  };
}


