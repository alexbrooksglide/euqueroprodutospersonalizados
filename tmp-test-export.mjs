import * as XLSX from "xlsx";
import fs from "fs";

const data = {
  pedreiros: [
    { id: "p1", nome: "João Silva", tipoPagamento: "Diaria", foto: "" },
    { id: "p2", nome: "Carlos Souza", tipoPagamento: "Empreitada", foto: "" },
  ],
  diarias: [
    { id: "d1", pedreiroId: "p1", pedreiroNome: "João Silva", data: "2026-04-17", valorDiaria: 200, quantidadeDias: 3, total: 600 },
  ],
  empreitadas: [
    { id: "e1", pedreiroNome: "Carlos Souza", nomeObra: "Casa do Sr. José", valorTotal: 10000, totalPago: 3000, saldoRestante: 7000, status: "Em andamento" },
  ],
  adiantamentos: [
    { id: "a1", pedreiroNome: "João Silva", data: "2026-04-17", valor: 150, observacao: "Vale para mercado" },
  ],
};

const wb = XLSX.utils.book_new();
const map = {
  Pedreiros: data.pedreiros.map(p => ({ ID: p.id, Nome: p.nome, "Tipo de pagamento": p.tipoPagamento, Foto: p.foto ?? "" })),
  Diarias: data.diarias.map(d => ({ ID: d.id, "ID do Pedreiro": d.pedreiroId, "Nome do Pedreiro": d.pedreiroNome, Data: d.data, "Valor da diária": d.valorDiaria, "Quantidade de dias": d.quantidadeDias, Total: d.total })),
  Empreitadas: data.empreitadas.map(e => ({ ID: e.id, "Nome do Pedreiro ou Equipe": e.pedreiroNome, "Nome da Obra": e.nomeObra, "Valor Total": e.valorTotal, "Total Pago": e.totalPago, "Saldo Restante": e.saldoRestante, Status: e.status })),
  Adiantamentos: data.adiantamentos.map(a => ({ ID: a.id, "Nome do Pedreiro": a.pedreiroNome, Data: a.data, Valor: a.valor, "Observação": a.observacao ?? "" })),
};
for (const [n, rows] of Object.entries(map)) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), n);
XLSX.writeFile(wb, "/tmp/controle-obra.xlsx");

// Re-read and verify
const wb2 = XLSX.readFile("/tmp/controle-obra.xlsx");
console.log("Sheets:", wb2.SheetNames);
for (const n of wb2.SheetNames) {
  console.log(`\n--- ${n} ---`);
  console.table(XLSX.utils.sheet_to_json(wb2.Sheets[n]));
}
