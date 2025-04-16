import Convite from '../models/Convite';
import Convidado from '../models/Convidado';

export default class ConvidadoDao {
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
    console.log("convidados", convidados);
    return convidados;
  };
}