import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchBar } from "../../components/ui/SearchBar";
import { Table } from "../../components/ui/Tabela";
import { Botao } from "../../components/ui/Botao";
import { Pencil, Trash2, Plus, Users, UserCheck, UserX, BedDouble } from "lucide-react";
import css from "../../styles/pages/TelaHospedes.module.css";

const hospedesMock = [
  { id: 1, nome: "João Silva",       cpf: "111.222.333-44", quarto: "104", status: "ativo",    checkin: "18/05/2026", checkout: "25/05/2026" },
  { id: 2, nome: "Maria Oliveira",   cpf: "222.333.444-55", quarto: "201", status: "ativo",    checkin: "20/05/2026", checkout: "23/05/2026" },
  { id: 3, nome: "Carlos Mendes",    cpf: "333.444.555-66", quarto: "305", status: "checkout", checkin: "15/05/2026", checkout: "21/05/2026" },
  { id: 4, nome: "Ana Paula Costa",  cpf: "444.555.666-77", quarto: "102", status: "ativo",    checkin: "19/05/2026", checkout: "28/05/2026" },
  { id: 5, nome: "Rafael Souza",     cpf: "555.666.777-88", quarto: "210", status: "reserva",  checkin: "22/05/2026", checkout: "26/05/2026" },
  { id: 6, nome: "Fernanda Lima",    cpf: "666.777.888-99", quarto: "401", status: "ativo",    checkin: "17/05/2026", checkout: "24/05/2026" },
  { id: 7, nome: "Lucas Pereira",    cpf: "777.888.999-00", quarto: "308", status: "checkout", checkin: "12/05/2026", checkout: "20/05/2026" },
];

const statusLabel: Record<string, string> = {
  ativo:    "Hospedado",
  checkout: "Check-out",
  reserva:  "Reserva",
};

export function TelaHospedes() {
  const [busca, setBusca] = useState("");

  const hospedesFiltrados = hospedesMock.filter((h) =>
    h.nome.toLowerCase().includes(busca.toLowerCase()) ||
    h.cpf.includes(busca) ||
    h.quarto.includes(busca)
  );

  const totalAtivos   = hospedesMock.filter((h) => h.status === "ativo").length;
  const totalCheckout = hospedesMock.filter((h) => h.status === "checkout").length;
  const totalReservas = hospedesMock.filter((h) => h.status === "reserva").length;

  return (
    <div className={css.pageWrapper}>

      {/* ── Cabeçalho da página ── */}
      <header className={css.pageHeader}>
        <div className={css.headerTexts}>
          <h1 className={css.pageTitle}>Hóspedes</h1>
          <p className={css.pageSubtitle}>Gerencie os hóspedes e reservas do resort</p>
        </div>

        <Botao variant="primario" onClick={() => alert("Abrir modal de cadastro!")}>
          <Plus size={18} />
          Novo Hóspede
        </Botao>
      </header>

      {/* ── Cards de estatísticas ── */}
      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconTotal}`}>
            <Users size={20} />
          </div>
          <div>
            <p className={css.statValue}>{hospedesMock.length}</p>
            <p className={css.statLabel}>Total de hóspedes</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconAtivo}`}>
            <UserCheck size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalAtivos}</p>
            <p className={css.statLabel}>Hospedados</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconReserva}`}>
            <BedDouble size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalReservas}</p>
            <p className={css.statLabel}>Reservas</p>
          </div>
        </div>

        <div className={css.statCard}>
          <div className={`${css.statIcon} ${css.statIconCheckout}`}>
            <UserX size={20} />
          </div>
          <div>
            <p className={css.statValue}>{totalCheckout}</p>
            <p className={css.statLabel}>Check-outs</p>
          </div>
        </div>
      </div>

      {/* ── Tabela principal ── */}
      <Card className={css.tableCard}>
        <div className={css.tableToolbar}>
          <div className={css.tableTitle}>
            <span>Lista de hóspedes</span>
            <span className={css.countBadge}>{hospedesFiltrados.length}</span>
          </div>
          <div className={css.searchWrapper}>
            <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por nome, CPF ou quarto…" />
          </div>
        </div>

        <Table cabecalho={["Hóspede", "CPF", "Quarto", "Status", "Check-in", "Check-out", "Ações"]}>
          {hospedesFiltrados.map((hospede) => (
            <tr key={hospede.id} className={css.tableRow}>
              <td className={css.cellNome}>{hospede.nome}</td>
              <td className={css.cellMuted}>{hospede.cpf}</td>
              <td>
                <span className={css.quartoTag}>Quarto {hospede.quarto}</span>
              </td>
              <td>
                <span className={`${css.statusBadge} ${css[`status_${hospede.status}`]}`}>
                  {statusLabel[hospede.status]}
                </span>
              </td>
              <td className={css.cellMuted}>{hospede.checkin}</td>
              <td className={css.cellMuted}>{hospede.checkout}</td>
              <td>
                <div className={css.actions}>
                  <Botao variant="ghost" title="Editar" onClick={() => console.log("Editar", hospede.id)}>
                    <Pencil size={16} />
                  </Botao>
                  <Botao variant="danger" title="Excluir" onClick={() => console.log("Excluir", hospede.id)}>
                    <Trash2 size={16} />
                  </Botao>
                </div>
              </td>
            </tr>
          ))}

          {hospedesFiltrados.length === 0 && (
            <tr>
              <td colSpan={7} className={css.emptyState}>
                Nenhum hóspede encontrado para "<strong>{busca}</strong>"
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}