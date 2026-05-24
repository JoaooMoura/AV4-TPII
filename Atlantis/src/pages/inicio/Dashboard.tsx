import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  DoorOpen,
  Plus,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useAtlantis } from "../../context/AtlantisContext";
import css from "../../styles/pages/home.module.css";

const acoesRapidas = [
  {
    titulo: "Cadastrar hóspede",
    descricao: "Crie titulares ou dependentes mantendo a regra de herança de contato.",
    rota: "/hospedes",
    icone: Plus,
  },
  {
    titulo: "Cadastrar acomodação",
    descricao: "Veja, edite ou cadastre os tipos de quarto usados na hospedagem.",
    rota: "/acomodacoes",
    icone: DoorOpen,
  },
  {
    titulo: "Registrar hospedagem",
    descricao: "Vincule hóspedes cadastrados a uma acomodação disponível.",
    rota: "/paysandu",
    icone: ClipboardList,
  },
];

export function Dashboard() {
  const { acomodacoes, hospedes, hospedagens } = useAtlantis();

  const totalCamasSolteiro = acomodacoes.reduce(
    (total, acomodacao) => total + acomodacao.camaSolteiro,
    0
  );

  const totalCamasCasal = acomodacoes.reduce(
    (total, acomodacao) => total + acomodacao.camaCasal,
    0
  );

  const totalSuites = acomodacoes.reduce(
    (total, acomodacao) => total + acomodacao.suite,
    0
  );

  const totalGaragens = acomodacoes.reduce(
    (total, acomodacao) => total + acomodacao.garagem,
    0
  );

  const composicaoAcomodacoes = [
    { label: "Camas de solteiro", valor: totalCamasSolteiro },
    { label: "Camas de casal", valor: totalCamasCasal },
    { label: "Suítes", valor: totalSuites },
    { label: "Vagas de garagem", valor: totalGaragens },
  ];

  return (
    <div className={css.pageWrapper}>
      <section className={css.heroContent}>
        <div>
          <h1 className={css.heroTitle}>Atlantis Resort</h1>
          <p className={css.heroResumo}>
            {hospedes.length} hóspede(s), {acomodacoes.length} acomodação(ões) e {hospedagens.length} hospedagem(ns) ativa(s).
          </p>
        </div>

        <div className={css.heroActions}>
          <Link to="/hospedes" className={css.primaryAction}>
            Gerenciar hóspedes
            <ArrowRight size={17} />
          </Link>

          <Link to="/hospedagem" className={css.secondaryAction}>
            Nova hospedagem
          </Link>
        </div>
      </section>

      <Card className={css.actionsCard}>
        <div className={css.sectionHeader}>
          <div>
            <h2>Ações rápidas</h2>
          </div>

          <span className={css.sectionIcon}>
            <Sparkles size={22} />
          </span>
        </div>

        <div className={css.quickActions}>
          {acoesRapidas.map(({ titulo, descricao, rota, icone: Icon }) => (
            <Link to={rota} className={css.quickAction} key={titulo}>
              <span className={css.quickIcon}>
                <Icon size={20} />
              </span>

              <div>
                <strong>{titulo}</strong>
                <p>{descricao}</p>
              </div>

              <ArrowRight size={18} className={css.quickArrow} />
            </Link>
          ))}
        </div>
      </Card>

      <section className={css.bottomGrid}>
        <Card className={css.acomodacoesCard}>
          <div className={css.sectionHeader}>
            <div>
              <h2>Composição das acomodações</h2>
            </div>
          </div>

          <div className={css.composicaoGrid}>
            {composicaoAcomodacoes.map((item) => (
              <div className={css.composicaoItem} key={item.label}>
                <span>{item.valor}</span>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className={css.builderCard}>
          <div className={css.sectionHeader}>
            <div>
              <h2>Tipos disponíveis</h2>
              <p>Acomodações cadastradas no protótipo.</p>
            </div>
          </div>

          <div className={css.acomodacaoList}>
            {acomodacoes.map((acomodacao) => {
              const categoriaClasse =
                css[`categoria_${acomodacao.categoria}`] || css.categoriaPadrao;

              return (
                <div className={css.acomodacaoItem} key={acomodacao.id}>
                  <div>
                    <strong>{acomodacao.nome}</strong>
                    <p>{acomodacao.descricao}</p>
                  </div>

                  <span className={`${css.categoriaBadge} ${categoriaClasse}`}>
                    {acomodacao.categoria}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
