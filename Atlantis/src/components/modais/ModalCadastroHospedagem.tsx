import React, { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { ModalBase } from "../ui/ModalBase";
import { Botao } from "../ui/Botao";
import { Acomodacao, Hospede } from "../../types/hospede";
import css from "../../styles/modals/ModalCadHospedagem.module.css";

interface ModalNovaHospedagemProps {
  aberto: boolean;
  onFechar: () => void;
  onConfirmar: (hospedeIds: number[], acomodacaoId: number) => void;
  hospedes: Hospede[];
  acomodacoes: Acomodacao[];
  hospedesOcupados: number[];
  acomodacoesOcupadas: number[];
}

const catLabel: Record<string, string> = {
  solteiro: "Solteiro(a)",
  casal: "Casal",
  familia: "Família",
};

export function ModalNovaHospedagem({
  aberto,
  onFechar,
  onConfirmar,
  hospedes,
  acomodacoes,
  hospedesOcupados,
  acomodacoesOcupadas,
}: ModalNovaHospedagemProps) {
  const [passo, setPasso] = useState<1 | 2>(1);
  const [hospedesSelecionados, setHospedesSelecionados] = useState<number[]>([]);
  const [acomodacaoSelecionada, setAcomodacaoSelecionada] = useState<number | null>(null);

  useEffect(() => {
    if (!aberto) return;
    setPasso(1);
    setHospedesSelecionados([]);
    setAcomodacaoSelecionada(null);
  }, [aberto]);

  function fechar() {
    setPasso(1);
    setHospedesSelecionados([]);
    setAcomodacaoSelecionada(null);
    onFechar();
  }

  function toggleHospede(id: number) {
    setHospedesSelecionados((prev) =>
      prev.includes(id) ? prev.filter((hospedeId) => hospedeId !== id) : [...prev, id]
    );
  }

  function confirmar() {
    if (!acomodacaoSelecionada || hospedesSelecionados.length === 0) return;
    onConfirmar(hospedesSelecionados, acomodacaoSelecionada);
    fechar();
  }

  const hospedesLivres = hospedes.filter((hospede) => !hospedesOcupados.includes(hospede.id));
  const acomodacoesLivres = acomodacoes.filter((acomodacao) => !acomodacoesOcupadas.includes(acomodacao.id));

  const subtitulo =
    passo === 1
      ? "Passo 1 de 2 — escolha os hóspedes cadastrados"
      : `Passo 2 de 2 — ${hospedesSelecionados.length} hóspede(s) selecionado(s)`;

  const rodape =
    passo === 1 ? (
      <>
        <Botao variant="ghost" onClick={fechar}>Cancelar</Botao>
        <Botao
          variant="primario"
          onClick={() => setPasso(2)}
          disabled={hospedesSelecionados.length === 0 || acomodacoesLivres.length === 0}
        >
          Próximo <ChevronRight size={16} />
        </Botao>
      </>
    ) : (
      <>
        <Botao variant="ghost" onClick={() => setPasso(1)}>Voltar</Botao>
        <Botao
          variant="primario"
          onClick={confirmar}
          disabled={!acomodacaoSelecionada}
        >
          Confirmar hospedagem
        </Botao>
      </>
    );

  return (
    <ModalBase
      aberto={aberto}
      onFechar={fechar}
      titulo="Nova Hospedagem"
      subtitulo={subtitulo}
      rodape={rodape}
    >
      <div className={css.stepper}>
        <div className={`${css.step} ${passo >= 1 ? css.stepAtivo : ""}`}>
          <div className={css.stepCircle}>
            {passo > 1 ? <Check size={13} /> : "1"}
          </div>
          <span>Hóspedes</span>
        </div>
        <div className={css.stepLine} />
        <div className={`${css.step} ${passo >= 2 ? css.stepAtivo : ""}`}>
          <div className={css.stepCircle}>2</div>
          <span>Acomodação</span>
        </div>
      </div>

      {passo === 1 && (
        <div className={css.lista}>
          {hospedes.length === 0 && (
            <div className={css.empty}>Cadastre pelo menos um hóspede antes de registrar uma hospedagem.</div>
          )}

          {hospedes.length > 0 && hospedesLivres.length === 0 && (
            <div className={css.empty}>Todos os hóspedes cadastrados já estão em hospedagens ativas.</div>
          )}

          {hospedes.map((hospede) => {
            const ocupado = hospedesOcupados.includes(hospede.id);
            const selecionado = hospedesSelecionados.includes(hospede.id);
            const documento = hospede.documentos[0];

            return (
              <button
                key={hospede.id}
                type="button"
                className={`${css.item} ${selecionado ? css.itemAtivo : ""} ${ocupado ? css.itemDesabilitado : ""}`}
                onClick={() => !ocupado && toggleHospede(hospede.id)}
                disabled={ocupado}
              >
                <div className={css.checkBox}>
                  {selecionado && <Check size={12} />}
                </div>
                <div>
                  <p className={css.itemNome}>{hospede.nome}</p>
                  <p className={css.itemSub}>
                    {documento ? `${documento.tipo} ${documento.numero}` : "Sem documento"}
                    {ocupado && " · já hospedado"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {passo === 2 && (
        <div className={css.lista}>
          {acomodacoesLivres.length === 0 && (
            <div className={css.empty}>Nenhuma acomodação livre no momento.</div>
          )}

          {acomodacoes.map((acomodacao) => {
            const ocupada = acomodacoesOcupadas.includes(acomodacao.id);
            const selecionada = acomodacaoSelecionada === acomodacao.id;

            return (
              <button
                key={acomodacao.id}
                type="button"
                className={`${css.item} ${selecionada ? css.itemAtivo : ""} ${ocupada ? css.itemDesabilitado : ""}`}
                onClick={() => !ocupada && setAcomodacaoSelecionada(acomodacao.id)}
                disabled={ocupada}
              >
                <div className={css.checkBox}>
                  {selecionada && <Check size={12} />}
                </div>
                <div className={css.itemInfo}>
                  <div className={css.itemTopo}>
                    <p className={css.itemNome}>{acomodacao.nome}</p>
                    <span className={`${css.catBadge} ${css[`cat_${acomodacao.categoria}`]}`}>
                      {catLabel[acomodacao.categoria]}
                    </span>
                  </div>
                  <p className={css.itemSub}>
                    {acomodacao.descricao}
                    {ocupada && " · ocupada"}
                  </p>
                  <div className={css.acomMini}>
                    {acomodacao.camaSolteiro > 0 && <span>{acomodacao.camaSolteiro} solteiro</span>}
                    {acomodacao.camaCasal > 0 && <span>{acomodacao.camaCasal} casal</span>}
                    {acomodacao.suite > 0 && <span>{acomodacao.suite} suíte</span>}
                    {acomodacao.garagem > 0 && <span>{acomodacao.garagem} vaga{acomodacao.garagem > 1 ? "s" : ""}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </ModalBase>
  );
}
