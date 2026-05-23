import React from "react";
import { ModalBase } from "../ui/ModalBase";
import { Botao } from "../ui/Botao";
import { Table } from "../ui/Tabela";
import { Hospede } from "../../types/hospede";
import css from "../../styles/modals/ModalDependentes.module.css";

interface ModalDependentesProps {
  aberto: boolean;
  titular: Hospede | null;
  dependentes: Hospede[];
  onFechar: () => void;
}

function formatarData(data: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function ModalDependentes({ aberto, titular, dependentes, onFechar }: ModalDependentesProps) {
  const rodape = <Botao variant="ghost" onClick={onFechar}>Fechar</Botao>;

  return (
    <ModalBase
      aberto={aberto}
      onFechar={onFechar}
      titulo="Dependentes do titular"
      subtitulo={titular ? `Titular responsável: ${titular.nome}` : undefined}
      largura="lg"
      rodape={rodape}
    >
      {dependentes.length === 0 ? (
        <div className={css.empty}>Este titular ainda não possui dependentes cadastrados.</div>
      ) : (
        <Table cabecalho={["Dependente", "Documento", "Nascimento", "Telefone herdado"]}>
          {dependentes.map((dependente) => {
            const documento = dependente.documentos[0];
            const telefone = dependente.telefones[0];

            return (
              <tr key={dependente.id} className={css.tableRow}>
                <td className={css.nome}>{dependente.nome}</td>
                <td>{documento ? `${documento.tipo} ${documento.numero}` : "—"}</td>
                <td>{formatarData(dependente.dataNascimento)}</td>
                <td>{telefone ? `(${telefone.ddd}) ${telefone.numero}` : "—"}</td>
              </tr>
            );
          })}
        </Table>
      )}
    </ModalBase>
  );
}
