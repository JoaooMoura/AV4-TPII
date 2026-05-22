import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Tabela";
import { Botao } from "../../components/ui/Botao";
import { Plus, Trash2, BedDouble, Users, ChevronRight, Check } from "lucide-react";
import css from "../../styles/pages/TelaHospedagem.module.css";

interface Hospede {
  id: number;
  nome: string;
  cpf: string;
}

interface Acomodacao {
  id: number;
  nome: string;
  descricao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  garagem: number;
  categoria: "solteiro" | "casal" | "familia";
}

interface Hospedagem {
  id: number;
  hospedes: Hospede[];
  acomodacao: Acomodacao;
  dataEntrada: string;
}

const hospedesMock: Hospede[] = [
  { id: 1, nome: "João Silva",      cpf: "111.222.333-44" },
  { id: 2, nome: "Maria Oliveira",  cpf: "222.333.444-55" },
  { id: 3, nome: "Carlos Mendes",   cpf: "333.444.555-66" },
  { id: 4, nome: "Ana Paula Costa", cpf: "444.555.666-77" },
  { id: 5, nome: "Rafael Souza",    cpf: "555.666.777-88" },
  { id: 6, nome: "Fernanda Lima",   cpf: "666.777.888-99" },
];

const acomodacoesMock: Acomodacao[] = [
  { id: 1, nome: "Solteiro Simples", descricao: "Acomodação simples para solteiro(a)",               camaSolteiro: 1, camaCasal: 0, suite: 1, garagem: 0, categoria: "solteiro" },
  { id: 2, nome: "Solteiro Mais",    descricao: "Acomodação com garagem para solteiro(a)",            camaSolteiro: 0, camaCasal: 1, suite: 1, garagem: 1, categoria: "solteiro" },
  { id: 3, nome: "Casal Simples",    descricao: "Acomodação simples para casal",                      camaSolteiro: 0, camaCasal: 1, suite: 1, garagem: 1, categoria: "casal"    },
  { id: 4, nome: "Família Simples",  descricao: "Acomodação para família com até duas crianças",      camaSolteiro: 2, camaCasal: 1, suite: 1, garagem: 1, categoria: "familia"  },
  { id: 5, nome: "Família Mais",     descricao: "Acomodação para família com até cinco crianças",     camaSolteiro: 5, camaCasal: 1, suite: 2, garagem: 2, categoria: "familia"  },
  { id: 6, nome: "Família Super",    descricao: "Acomodação para até duas famílias",                  camaSolteiro: 6, camaCasal: 2, suite: 3, garagem: 2, categoria: "familia"  },
];

const catLabel: Record<string, string> = { solteiro: "Solteiro(a)", casal: "Casal", familia: "Família" };

export function TelaHospedagem() {
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [passo, setPasso] = useState<1 | 2>(1);
  const [hospedesSelecionados, setHospedesSelecionados] = useState<number[]>([]);
  const [acomodacaoSelecionada, setAcomodacaoSelecionada] = useState<number | null>(null);

  function abrirModal() {
    setPasso(1);
    setHospedesSelecionados([]);
    setAcomodacaoSelecionada(null);
    setModalAberto(true);
  }

  function toggleHospede(id: number) {
    setHospedesSelecionados((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  }

  function confirmar() {
    if (!acomodacaoSelecionada || hospedesSelecionados.length === 0) return;
    const novaHospedagem: Hospedagem = {
      id: Date.now(),
      hospedes: hospedesMock.filter((h) => hospedesSelecionados.includes(h.id)),
      acomodacao: acomodacoesMock.find((a) => a.id === acomodacaoSelecionada)!,
      dataEntrada: new Date().toLocaleDateString("pt-BR"),
    };
    setHospedagens((prev) => [...prev, novaHospedagem]);
    setModalAberto(false);
  }

  function excluir(id: number) {
    setHospedagens((prev) => prev.filter((h) => h.id !== id));
  }

  const hospedesOcupados = hospedagens.flatMap((h) => h.hospedes.map((ho) => ho.id));

  return (
    <div className={css.pageWrapper}>

      <header className={css.pageHeader}>
        <div>
          <h1 className={css.pageTitle}>Hospedagens</h1>
          <p className={css.pageSubtitle}>Associe hóspedes às acomodações do resort</p>
        </div>
        <Botao variant="primario" onClick={abrirModal}>
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
            <p className={css.statValue}>{acomodacoesMock.length - hospedagens.length}</p>
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
            <span>Clique em "Nova Hospedagem" para associar um hóspede a uma acomodação</span>
          </div>
        ) : (
          <Table cabecalho={["Hóspedes", "Acomodação", "Categoria", "Entrada", "Ações"]}>
            {hospedagens.map((h) => (
              <tr key={h.id} className={css.tableRow}>
                <td>
                  <div className={css.hospedesCell}>
                    {h.hospedes.map((ho) => (
                      <span key={ho.id} className={css.hospedeTag}>{ho.nome}</span>
                    ))}
                  </div>
                </td>
                <td className={css.cellNome}>{h.acomodacao.nome}</td>
                <td>
                  <span className={`${css.catBadge} ${css[`cat_${h.acomodacao.categoria}`]}`}>
                    {catLabel[h.acomodacao.categoria]}
                  </span>
                </td>
                <td className={css.cellMuted}>{h.dataEntrada}</td>
                <td>
                  <Botao variant="danger" title="Excluir" onClick={() => excluir(h.id)}>
                    <Trash2 size={16} />
                  </Botao>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {modalAberto && (
        <div className={css.overlay} onClick={() => setModalAberto(false)}>
          <div className={css.modal} onClick={(e) => e.stopPropagation()}>

            <div className={css.stepper}>
              <div className={`${css.step} ${passo >= 1 ? css.stepAtivo : ""}`}>
                <div className={css.stepCircle}>{passo > 1 ? <Check size={14} /> : "1"}</div>
                <span>Hóspedes</span>
              </div>
              <div className={css.stepLine} />
              <div className={`${css.step} ${passo >= 2 ? css.stepAtivo : ""}`}>
                <div className={css.stepCircle}>2</div>
                <span>Acomodação</span>
              </div>
            </div>

            {passo === 1 && (
              <>
                <h2 className={css.modalTitulo}>Selecione os hóspedes</h2>
                <p className={css.modalSub}>Escolha um ou mais hóspedes para esta hospedagem</p>
                <div className={css.listaSelecao}>
                  {hospedesMock.map((h) => {
                    const ocupado = hospedesOcupados.includes(h.id);
                    const selecionado = hospedesSelecionados.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        className={`${css.itemSelecao} ${selecionado ? css.itemAtivo : ""} ${ocupado ? css.itemDesabilitado : ""}`}
                        onClick={() => !ocupado && toggleHospede(h.id)}
                        disabled={ocupado}
                      >
                        <div className={css.checkBox}>{selecionado && <Check size={12} />}</div>
                        <div>
                          <p className={css.itemNome}>{h.nome}</p>
                          <p className={css.itemSub}>{h.cpf}{ocupado ? " · já hospedado" : ""}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className={css.modalRodape}>
                  <Botao variant="ghost" onClick={() => setModalAberto(false)}>Cancelar</Botao>
                  <Botao
                    variant="primario"
                    onClick={() => setPasso(2)}
                    disabled={hospedesSelecionados.length === 0}
                  >
                    Próximo <ChevronRight size={16} />
                  </Botao>
                </div>
              </>
            )}

            {passo === 2 && (
              <>
                <h2 className={css.modalTitulo}>Selecione a acomodação</h2>
                <p className={css.modalSub}>{hospedesSelecionados.length} hóspede(s) selecionado(s)</p>
                <div className={css.listaSelecao}>
                  {acomodacoesMock.map((a) => {
                    const emUso = hospedagens.some((h) => h.acomodacao.id === a.id);
                    const selecionada = acomodacaoSelecionada === a.id;
                    return (
                      <button
                        key={a.id}
                        className={`${css.itemSelecao} ${selecionada ? css.itemAtivo : ""} ${emUso ? css.itemDesabilitado : ""}`}
                        onClick={() => !emUso && setAcomodacaoSelecionada(a.id)}
                        disabled={emUso}
                      >
                        <div className={css.checkBox}>{selecionada && <Check size={12} />}</div>
                        <div>
                          <p className={css.itemNome}>{a.nome}</p>
                          <p className={css.itemSub}>
                            {a.descricao}{emUso ? " · ocupada" : ""}
                          </p>
                          <div className={css.acomMini}>
                            {a.camaSolteiro > 0 && <span>🛏 {a.camaSolteiro} solteiro</span>}
                            {a.camaCasal > 0 && <span>🛏 {a.camaCasal} casal</span>}
                            {a.garagem > 0 && <span>🚗 {a.garagem}</span>}
                          </div>
                        </div>
                        <span className={`${css.catBadge} ${css[`cat_${a.categoria}`]}`}>
                          {catLabel[a.categoria]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className={css.modalRodape}>
                  <Botao variant="ghost" onClick={() => setPasso(1)}>Voltar</Botao>
                  <Botao
                    variant="primario"
                    onClick={confirmar}
                    disabled={!acomodacaoSelecionada}
                  >
                    Confirmar hospedagem
                  </Botao>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}