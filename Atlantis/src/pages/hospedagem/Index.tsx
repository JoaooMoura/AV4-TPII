import React from "react";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Tabela";
import { Botao } from "../../components/ui/Botao";
import { ModalNovaHospedagem } from "../../components/modais/ModalCadastroHospedagem";
import { Plus, Trash2, BedDouble, Users } from "lucide-react";
import { useAtlantis } from "../../context/AtlantisContext";
import css from "../../styles/pages/TelaHospedagem.module.css";

const catLabel: Record<string, string> = {
  solteiro: "Solteiro(a)",
  casal: "Casal",
  familia: "Família",
};

export function TelaHospedagem() {
  const [modalAberto, setModalAberto] = React.useState(false);

  const {
    hospedes,
    acomodacoes,
    hospedagens,
    criarHospedagem,
    excluirHospedagem,
    hospedesOcupados,
    acomodacoesOcupadas,
  } = useAtlantis();

  function handleConfirmar(hospedeIds: number[], acomodacaoId: number) {
    criarHospedagem(hospedeIds, acomodacaoId);
  }

  function excluir(id: number) {
    const confirmar = window.confirm("Encerrar esta hospedagem?");
    if (!confirmar) return;
    excluirHospedagem(id);
  }

  return (
    <div className={css.pageWrapper}>
      <header className={css.pageHeader}>
        <div>
          <h1 className={css.pageTitle}>Hospedagens</h1>
          <p className={css.pageSubtitle}>Associe hóspedes cadastrados às acomodações disponíveis</p>
        </div>
        <Botao variant="primario" onClick={() => setModalAberto(true)}>
          <Plus size={18} /> Nova Hospedagem
        </Botao>
      </header>

      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.iconBlue}`}><BedDouble size={20} /></div>
          <div>
            <p className={css.statValue}>{hospedagens.length}</p>
            <p className={css.statLabel}>Hospedagens ativas</p>
          </div>
        </div>
        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.iconGreen}`}><Users size={20} /></div>
          <div>
            <p className={css.statValue}>{hospedesOcupados.length}</p>
            <p className={css.statLabel}>Hóspedes alocados</p>
          </div>
        </div>
        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.iconTeal}`}><BedDouble size={20} /></div>
          <div>
            <p className={css.statValue}>{acomodacoes.length - acomodacoesOcupadas.length}</p>
            <p className={css.statLabel}>Acomodações livres</p>
          </div>
        </div>
      </div>

      <Card className={css.tableCard}>
        <div className={css.tableToolbar}>
          <div className={css.tableTitle}>
            Lista de hospedagens
            <span className={css.countBadge}>{hospedagens.length}</span>
          </div>
        </div>

        {hospedagens.length === 0 ? (
          <div className={css.emptyState}>
            <BedDouble size={36} strokeWidth={1.2} />
            <p>Nenhuma hospedagem registrada</p>
            <span>Clique em "Nova Hospedagem" para associar hóspedes a uma acomodação</span>
          </div>
        ) : (
          <Table cabecalho={["Hóspedes", "Acomodação", "Categoria", "Entrada", "Ações"]}>
            {hospedagens.map((hospedagem) => {
              const hospedesDaHospedagem = hospedes.filter((hospede) => hospedagem.hospedeIds.includes(hospede.id));
              const acomodacao = acomodacoes.find((item) => item.id === hospedagem.acomodacaoId);

              if (!acomodacao) return null;

              return (
                <tr key={hospedagem.id} className={css.tableRow}>
                  <td>
                    <div className={css.hospedesCell}>
                      {hospedesDaHospedagem.map((hospede) => (
                        <span key={hospede.id} className={css.hospedeTag}>{hospede.nome}</span>
                      ))}
                    </div>
                  </td>
                  <td className={css.cellNome}>{acomodacao.nome}</td>
                  <td>
                    <span className={`${css.catBadge} ${css["cat_" + acomodacao.categoria]}`}>
                      {catLabel[acomodacao.categoria]}
                    </span>
                  </td>
                  <td className={css.cellMuted}>{hospedagem.dataEntrada}</td>
                  <td>
                    <Botao variant="danger" title="Excluir" onClick={() => excluir(hospedagem.id)}>
                      <Trash2 size={16} />
                    </Botao>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      <ModalNovaHospedagem
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onConfirmar={handleConfirmar}
        hospedes={hospedes}
        acomodacoes={acomodacoes}
        hospedesOcupados={hospedesOcupados}
        acomodacoesOcupadas={acomodacoesOcupadas}
      />
    </div>
  );
}
