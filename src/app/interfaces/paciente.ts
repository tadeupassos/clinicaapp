import { Prontuario } from './prontuario';

export interface Paciente {
    id?: string;
    dataInicio?: string;
    dataInicioStamp?: number;
    atendimento?: string;
    convenio?: string;
    valor?: string;
    dataEncerrou?: string;
    motivoEncerrou?: string;
    nome?: string;
    email?: string;
    dataNascimento?: string;
    celular1?: string;
    celular2?: string;
    telefone?: string;
    responsaveis?: string;
    cep?: string;
    cidade?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    psicologo?: string;
    crp?: string;
    userId?: string;
    prontuario?: Prontuario;
}

