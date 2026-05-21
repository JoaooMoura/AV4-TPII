import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchBar } from "../../components/ui/SearchBar";
import { Table } from "../../components/ui/Tabela";

export function TelaHospedes() {
  const [busca, setBusca] = useState("");

  const hospedesMock = [
    { id: 1, nome: "Moura", cpf: "111.222.333-44", quarto: "104", status: "Ativo" },
    { id: 2, nome: "ENZO", cpf: "555.666.777-88", quarto: "201", status: "Checkout" },
  ];

  return (
    <div>
    
      <Card>
        <div>
          <h2>Gerenciamento de Hóspedes</h2>
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar hóspede..." />
        </div>

        <Table cabecalho={["Nome", "CPF", "Quarto", "Status", "Ações"]}>
          
          {hospedesMock.map((hospede) => (
            <tr key={hospede.id}>
              <td>{hospede.nome}</td>
              <td>{hospede.cpf}</td>
              <td>{hospede.quarto}</td>
              <td>
                <span style={{ color: hospede.status === 'Ativo' ? '#4ade80' : '#94a3b8' }}>
                  {hospede.status}
                </span>
              </td>
              <td>
                <button>Editar</button>
              </td>
            </tr>
          ))}

        </Table>
      </Card>

    </div>
  );
}