import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchBar } from "../../components/ui/SearchBar";
import { Table } from "../../components/ui/Tabela";
import { Botao } from "../../components/ui/Botao";
import { Pencil, Trash2, Plus, Users, UserCheck, UserX, BedDouble, ListTree } from "lucide-react";
import { ModalCriarHospede } from "../../components/modais/ModalCriarHospede";
import { ModalEditarHospede } from "../../components/modais/ModalEditarHospede";
import { ModalDependentes } from "../../components/modais/ModalDependentes";
import { Hospede } from "../../types/hospede";
import { useAtlantis } from "../../context/AtlantisContext";
import css from "../../styles/pages/TelaHospedes.module.css";

function formatarData(data: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function TelaHospedes() {
  const [busca, setBusca] = useState("");
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [hospedeEmEdicao, setHospedeEmEdicao] = useState<Hospede | null>(null);
  const [titularDependentes, setTitularDependentes] = useState<Hospede | null>(null);

  const {
    hospedes,
    titulares,
    criarHospede,
    editarHospede,
    excluirHospede,
    obterTitular,
    listarDependentes,
  } = useAtlantis();

  function excluir(id: number) {
    const hospede = hospedes.find((item) => item.id === id);
    if (!hospede) return;

    const confirmar = window.confirm(`Excluir o hóspede ${hospede.nome}?`);
    if (!confirmar) return;

    const erro = excluirHospede(id);
    if (erro) alert(erro);
  }

  const hospedesFiltrados = hospedes.filter((hospede) => {
    const documento = hospede.documentos[0];
    const telefone = hospede.telefones[0];
    const titular = obterTitular(hospede);
    const termo = busca.toLowerCase();

    return (
      hospede.nome.toLowerCase().includes(termo) ||
      hospede.nomeSocial.toLowerCase().includes(termo) ||
      documento?.numero.toLowerCase().includes(termo) ||
      documento?.tipo.toLowerCase().includes(termo) ||
      telefone?.numero.toLowerCase().includes(termo) ||
      titular?.nome.toLowerCase().includes(termo)
    );
  });

  const totalTitulares = titulares.length;
  const totalDependentes = hospedes.filter((hospede) => hospede.titularId).length;
  const totalDocumentos = hospedes.reduce((total, hospede) => total + hospede.documentos.length, 0);
  const dependentesDoTitular = titularDependentes ? listarDependentes(titularDependentes.id) : [];

  return (
    <div className={css.pageWrapper}>
      <header className={css.pageHeader}>
        <div className={css.headerTexts}>
          <h1 className={css.pageTitle}>Hóspedes</h1>
          <p className={css.pageSubtitle}>Gerencie titulares, dependentes, documentos e contatos do resort</p>
        </div>

        <Botao variant="primario" onClick={() => setModalCriarAberto(true)}>
          <Plus size={18} />
          Novo Hóspede
        </Botao>
      </header>

      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconTotal}`}>
            <Users size={20} />
          </div>
          <div>
            <p className={css.statValue}>{hospedes.length}</p>
            <p className={css.statLabel}>Total de hóspedes</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconAtivo}`}>
            <UserCheck size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalTitulares}</p>
            <p className={css.statLabel}>Titulares</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconReserva}`}>
            <UserX size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalDependentes}</p>
            <p className={css.statLabel}>Dependentes</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconCheckout}`}>
            <BedDouble size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalDocumentos}</p>
            <p className={css.statLabel}>Documentos</p>
          </div>
        </div>
      </div>

      <Card className={css.tableCard}>
        <div className={css.tableToolbar}>
          <div className={css.tableTitle}>
            <span>Lista de hóspedes</span>
            <span className={css.countBadge}>{hospedesFiltrados.length}</span>
          </div>
          <div className={css.searchWrapper}>
            <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por nome, documento, telefone ou titular…" />
          </div>
        </div>

        <Table cabecalho={["Hóspede", "Documento", "Nascimento", "Tipo", "Titular", "Telefone", "Ações"]}>
          {hospedesFiltrados.map((hospede) => {
            const documento = hospede.documentos[0];
            const telefone = hospede.telefones[0];
            const titular = obterTitular(hospede);
            const ehDependente = Boolean(hospede.titularId);
            const totalDeps = listarDependentes(hospede.id).length;

            return (
              <tr key={hospede.id} className={css.tableRow}>
                <td className={css.cellNome}>
                  <div className={css.nomeWrapper}>
                    <span>{hospede.nome}</span>
                    {hospede.nomeSocial && <small>Nome social: {hospede.nomeSocial}</small>}
                  </div>
                </td>
                <td>
                  <div className={css.documentoCell}>
                    <span className={css.documentoBadge}>{documento?.tipo ?? "—"}</span>
                    <span className={css.cellMuted}>{documento?.numero ?? "—"}</span>
                  </div>
                </td>
                <td className={css.cellMuted}>{formatarData(hospede.dataNascimento)}</td>
                <td>
                  <span className={`${css.tipoBadge} ${ehDependente ? css.tipoDependente : css.tipoTitular}`}>
                    {ehDependente ? "Dependente" : "Titular"}
                  </span>
                </td>
                <td className={css.cellMuted}>{titular?.nome ?? "—"}</td>
                <td className={css.cellMuted}>{telefone ? `(${telefone.ddd}) ${telefone.numero}` : "—"}</td>
                <td>
                  <div className={css.actions}>
                    {!ehDependente && (
                      <Botao
                        variant="ghost"
                        className={`${css.actionButton} ${css.dependentesButton}`}
                        title="Ver dependentes"
                        onClick={() => setTitularDependentes(hospede)}
                      >
                        <ListTree size={16} />
                        {totalDeps > 0 && <span className={css.actionCount}>{totalDeps}</span>}
                      </Botao>
                    )}
                    <Botao
                      variant="ghost"
                      className={css.actionButton}
                      title="Editar"
                      onClick={() => setHospedeEmEdicao(hospede)}
                    >
                      <Pencil size={16} />
                    </Botao>
                    <Botao
                      variant="danger"
                      className={css.actionButton}
                      title="Excluir"
                      onClick={() => excluir(hospede.id)}
                    >
                      <Trash2 size={16} />
                    </Botao>
                  </div>
                </td>
              </tr>
            );
          })}

          {hospedesFiltrados.length === 0 && (
            <tr>
              <td colSpan={7} className={css.emptyState}>
                Nenhum hóspede encontrado para "<strong>{busca}</strong>"
              </td>
            </tr>
          )}
        </Table>
      </Card>

      <ModalCriarHospede
        aberto={modalCriarAberto}
        onFechar={() => setModalCriarAberto(false)}
        onSalvar={criarHospede}
        titulares={titulares}
      />

      <ModalEditarHospede
        aberto={Boolean(hospedeEmEdicao)}
        hospede={hospedeEmEdicao}
        titulares={titulares}
        onFechar={() => setHospedeEmEdicao(null)}
        onSalvar={editarHospede}
      />

      <ModalDependentes
        aberto={Boolean(titularDependentes)}
        titular={titularDependentes}
        dependentes={dependentesDoTitular}
        onFechar={() => setTitularDependentes(null)}
      />
    </div>
  );
}
