import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Tabela";
import { Bed, Users, Car, Wind, Star } from "lucide-react";
import css from "../../styles/pages/TelaAcomodacao.module.css";
import { acomodacoes } from "../../data/acomodacoes";

const categoriaLabel: Record<string, string> = {
  solteiro: "Solteiro(a)",
  casal: "Casal",
  familia: "Família",
};

type Categoria = "todos" | "solteiro" | "casal" | "familia";

export function TelaAcomodacoes() {
  const [filtro, setFiltro] = useState<Categoria>("todos");
  const [selecionada, setSelecionada] = useState<number | null>(null);

  const filtradas =
    filtro === "todos"
      ? acomodacoes
      : acomodacoes.filter((a) => a.categoria === filtro);

  const detalhe = acomodacoes.find((a) => a.id === selecionada) ?? null;

  return (
    <div className={css.pageWrapper}>

      <header className={css.pageHeader}>
        <div>
          <h1 className={css.pageTitle}>Acomodações</h1>
          <p className={css.pageSubtitle}>
            {acomodacoes.length} tipos disponíveis no resort
          </p>
        </div>
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
          {filtradas.map((acom) => (
            <button
              key={acom.id}
              className={`${css.acomCard} ${selecionada === acom.id ? css.acomCardAtivo : ""}`}
              onClick={() => setSelecionada(acom.id === selecionada ? null : acom.id)}
            >
              <div className={css.acomCardHeader}>
                <span className={`${css.categoriaBadge} ${css[`cat_${acom.categoria}`]}`}>
                  {categoriaLabel[acom.categoria]}
                </span>
                {(acom.camaCasal + acom.camaSolteiro + acom.suite) >= 6 && (
                  <span className={css.destaqueBadge}><Star size={11} /> Premium</span>
                )}
              </div>

              <h3 className={css.acomNome}>{acom.nome}</h3>
              <p className={css.acomDesc}>{acom.descricao}</p>

              <div className={css.acomIcons}>
                {acom.camaSolteiro > 0 && (
                  <span className={css.iconItem} title="Camas de solteiro">
                    <Bed size={14} /> {acom.camaSolteiro}
                  </span>
                )}
                {acom.camaCasal > 0 && (
                  <span className={css.iconItem} title="Camas de casal">
                    <Users size={14} /> {acom.camaCasal}
                  </span>
                )}
                {acom.garagem > 0 && (
                  <span className={css.iconItem} title="Vagas de garagem">
                    <Car size={14} /> {acom.garagem}
                  </span>
                )}
                {acom.climatizacao && (
                  <span className={css.iconItem} title="Climatização">
                    <Wind size={14} />
                  </span>
                )}
              </div>
            </button>
          ))}
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
                <span className={`${css.detalheValor} ${css.sim}`}>Sim</span>
              </li>
              <li>
                <span className={css.detalheLabel}>Vagas de garagem</span>
                <span className={css.detalheValor}>{detalhe.garagem}</span>
              </li>
            </ul>
          </aside>
        )}
      </div>

      <Card className={css.tabelaCard}>
        <div className={css.tabelaTitulo}>Resumo das acomodações</div>
        <Table cabecalho={["Nome", "Cama Solteiro", "Cama Casal", "Suítes", "Garagem", "Climatização"]}>
          {acomodacoes.map((acom) => (
            <tr key={acom.id}>
              <td className={css.cellNome}>{acom.nome}</td>
              <td>{acom.camaSolteiro}</td>
              <td>{acom.camaCasal}</td>
              <td>{acom.suite}</td>
              <td>{acom.garagem}</td>
              <td><span className={css.simTag}>Sim</span></td>
            </tr>
          ))}
        </Table>
      </Card>

    </div>
  );
}