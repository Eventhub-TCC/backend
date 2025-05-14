import { Transaction } from "sequelize";
import TipoServico from '../models/TipoServico';

export default class TipoServicoDao{
    public listarTiposServico = async ():Promise<TipoServico[]>=>{
        const tipoServico: TipoServico[] = await TipoServico.findAll()
        return tipoServico
    }
}