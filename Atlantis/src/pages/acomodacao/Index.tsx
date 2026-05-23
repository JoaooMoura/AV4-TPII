import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Tabela";
import { Botao } from "../../components/ui/Botao";
import { ModalAcomodacao } from "../../components/modais/ModalAcomodacao";
import { Bed, Users, Car, Wind, Star, Plus, Pencil, Trash2 } from "lucide-react";
import { Acomodacao, CategoriaAcomodacao, FormularioAcomodacao } from "../../types/hospede";
import { useAtlantis } from "../../context/AtlantisContext";
import css from "../../styles/pages/TelaAcomodacao.module.css";

const categoriaLabel: Record<CategoriaAcomodacao, string> = {
  solteiro: "Solteiro(a)",
  casal: "Casal",
  familia: "Família",
};

type Categoria = "todos" | CategoriaAcomodacao;

export function TelaAcomodacoes() {
  const [filtro, setFiltro] = useState<Categoria>("todos");
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [acomodacaoEmEdicao, setAcomodacaoEmEdicao] = useState<Acomodacao | null>(null);

  const {
    acomodacoes,
    criarAcomodacao,
    editarAcomodacao,
    excluirAcomodacao,
    acomodacoesOcupadas,
  } = useAtlantis();

  const filtradas =
    filtro === "todos"
      ? acomodacoes
      : acomodacoes.filter((acomodacao) => acomodacao.categoria === filtro);

  const detalhe = acomodacoes.find((acomodacao) => acomodacao.id === selecionada) ?? null;

  function abrirCadastro() {
    setAcomodacaoEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(acomodacao: Acomodacao) {
    setAcomodacaoEmEdicao(acomodacao);
    setModalAberto(true);
  }

  function salvarAcomodacao(dados: FormularioAcomodacao) {
    if (acomodacaoEmEdicao) {
      editarAcomodacao(acomodacaoEmEdicao.id, dados);
      return;
    }

    criarAcomodacao(dados);
  }

  function excluir(id: number) {
    const acomodacao = acomodacoes.find((item) => item.id === id);
    if (!acomodacao) return;

    const confirmar = window.confirm(`Excluir a acomodação ${acomodacao.nome}?`);
    if (!confirmar) return;

    const erro = excluirAcomodacao(id);
    if (erro) {
      alert(erro);
      return;
    }

    if (selecionada === id) setSelecionada(null);
  }

  return (
    <div className={css.pageWrapper}>
      <header className={css.pageHeader}>
        <div>
          <h1 className={css.pageTitle}>Acomodações</h1>
          <p className={css.pageSubtitle}>
            {acomodacoes.length} tipo(s) cadastrado(s) no resort
          </p>
        </div>

        <Botao variant="primario" onClick={abrirCadastro}>
          <Plus size={18} /> Nova Acomodação
        </Botao>
      </header>

      <div className={css.filtros}>
        {(["todos", "solteiro", "casal", "familia"] as Categoria[]).map((cat) => (
          <button
            key={cat}
            className={`${css.filtroBotao} ${filtro === cat ? css.filtroAtivo : ""}`}
            onClick={() => setFiltro(cat)}
          >
            {cat === "todos" ? "Todos" : categoriaLabel[cat]}
          </button>
        ))}
      </div>

      <div className={css.conteudo}>
        <div className={css.cardsGrid}>
          {filtradas.map((acomodacao) => {
            const ocupada = acomodacoesOcupadas.includes(acomodacao.id);

            return (
              <button
                key={acomodacao.id}
                className={`${css.acomCard} ${selecionada === acomodacao.id ? css.acomCardAtivo : ""}`}
                onClick={() => setSelecionada(acomodacao.id === selecionada ? null : acomodacao.id)}
              >
                <div className={css.acomCardHeader}>
                  <span className={`${css.categoriaBadge} ${css[`cat_${acomodacao.categoria}`]}`}>
                    {categoriaLabel[acomodacao.categoria]}
                  </span>
                  <div className={css.badgeGroup}>
                    {ocupada && <span className={css.ocupadaBadge}>Ocupada</span>}
                    {(acomodacao.camaCasal + acomodacao.camaSolteiro + acomodacao.suite) >= 6 && (
                      <span className={css.destaqueBadge}><Star size={11} /> Premium</span>
                    )}
                  </div>
                </div>

                <h3 className={css.acomNome}>{acomodacao.nome}</h3>
                <p className={css.acomDesc}>{acomodacao.descricao}</p>

                <div className={css.acomIcons}>
                  {acomodacao.camaSolteiro > 0 && (
                    <span className={css.iconItem} title="Camas de solteiro">
                      <Bed size={14} /> {acomodacao.camaSolteiro}
                    </span>
                  )}
                  {acomodacao.camaCasal > 0 && (
                    <span className={css.iconItem} title="Camas de casal">
                      <Users size={14} /> {acomodacao.camaCasal}
                    </span>
                  )}
                  {acomodacao.garagem > 0 && (
                    <span className={css.iconItem} title="Vagas de garagem">
                      <Car size={14} /> {acomodacao.garagem}
                    </span>
                  )}
                  {acomodacao.climatizacao && (
                    <span className={css.iconItem} title="Climatização">
                      <Wind size={14} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {detalhe && (
          <aside className={css.detalhePanel}>
            <div className={css.detalheTopo}>
              <span className={`${css.categoriaBadge} ${css[`cat_${detalhe.categoria}`]}`}>
                {categoriaLabel[detalhe.categoria]}
              </span>
              <button className={css.fecharDetalhe} onClick={() => setSelecionada(null)}>✕</button>
            </div>

            <h2 className={css.detalheNome}>{detalhe.nome}</h2>
            <p className={css.detalheDesc}>{detalhe.descricao}</p>

            <div className={css.detalheSeparador} />

            <ul className={css.detalheItens}>
              <li>
                <span className={css.detalheLabel}>Camas de solteiro</span>
                <span className={css.detalheValor}>{detalhe.camaSolteiro}</span>
              </li>
              <li>
                <span className={css.detalheLabel}>Camas de casal</span>
                <span className={css.detalheValor}>{detalhe.camaCasal}</span>
              </li>
              <li>
                <span className={css.detalheLabel}>Suítes</span>
                <span className={css.detalheValor}>{detalhe.suite}</span>
              </li>
              <li>
                <span className={css.detalheLabel}>Climatização</span>
                <span className={`${css.detalheValor} ${detalhe.climatizacao ? css.sim : ""}`}>
                  {detalhe.climatizacao ? "Sim" : "Não"}
                </span>
              </li>
              <li>
                <span className={css.detalheLabel}>Vagas de garagem</span>
                <span className={css.detalheValor}>{detalhe.garagem}</span>
              </li>
            </ul>

            <div className={css.detalheActions}>
              <Botao variant="secundario" onClick={() => abrirEdicao(detalhe)}>
                <Pencil size={15} /> Editar
              </Botao>
              <Botao variant="danger" onClick={() => excluir(detalhe.id)}>
                <Trash2 size={15} /> Excluir
              </Botao>
            </div>
          </aside>
        )}
      </div>

      <Card className={css.tabelaCard}>
        <div className={css.tabelaTitulo}>Resumo das acomodações</div>
        <div className={css.tabelaScroll}>
          <Table cabecalho={["Nome", "Cama Solteiro", "Cama Casal", "Suítes", "Garagem", "Climatização", "Ações"]}>
            {acomodacoes.map((acomodacao) => (
              <tr key={acomodacao.id}>
                <td className={css.cellNome}>{acomodacao.nome}</td>
                <td>{acomodacao.camaSolteiro}</td>
                <td>{acomodacao.camaCasal}</td>
                <td>{acomodacao.suite}</td>
                <td>{acomodacao.garagem}</td>
                <td>
                  <span className={acomodacao.climatizacao ? css.simTag : css.naoTag}>
                    {acomodacao.climatizacao ? "Sim" : "Não"}
                  </span>
                </td>
                <td>
                  <div className={css.tabelaActions}>
                    <Botao variant="ghost" title="Editar" onClick={() => abrirEdicao(acomodacao)}>
                      <Pencil size={16} />
                    </Botao>
                    <Botao variant="danger" title="Excluir" onClick={() => excluir(acomodacao.id)}>
                      <Trash2 size={16} />
                    </Botao>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      <ModalAcomodacao
        aberto={modalAberto}
        acomodacao={acomodacaoEmEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvar={salvarAcomodacao}
      />
    </div>
  );
}
