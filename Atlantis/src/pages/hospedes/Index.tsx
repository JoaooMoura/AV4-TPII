import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchBar } from "../../components/ui/SearchBar";
import { Table } from "../../components/ui/Tabela";
import { Botao} from "../../components/ui/Botao";
import { Pencil, Trash2, Plus } from "lucide-react"; 

export function TelaHospedes() {
  const [busca, setBusca] = useState("");

  const hospedesMock = [
    { id: 1, nome: "João Silva", cpf: "111.222.333-44", quarto: "104" },
  ];

  return (
    <div>
      <Card>
        <div>
          <h2>Gerenciamento de Hóspedes</h2>
          
          <Botao variant="primario" onClick={() => alert("Abrir modal de cadastro!")}>
            <Plus size={18} />
            Novo Hóspede
          </Botao>
        </div>
        
        <div >
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar hóspede..." />
        </div>

        <Table cabecalho={["Nome", "CPF", "Quarto", "Ações"]}>
          {hospedesMock.map((hospede) => (
            <tr key={hospede.id}>
              <td>{hospede.nome}</td>
              <td>{hospede.cpf}</td>
              <td>{hospede.quarto}</td>
              <td>
                
                <Botao variant="ghost" title="Editar" onClick={() => console.log("Editar", hospede.id)}>
                  <Pencil size={18} />
                </Botao>

                <Botao variant="danger" title="Excluir" onClick={() => console.log("Excluir", hospede.id)}>
                  <Trash2 size={18} />
                </Botao>

              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}