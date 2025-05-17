"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Round = {
  id: number;
  user: string;
  numbers: number;
  deposit: number;
  withdrawal: number;
  date: string;
};

const mockRounds: Round[] = [
  { id: 1, user: 'loginDemoNick21', numbers: 1, deposit: 16, withdrawal: 200, date: '2025-05-17T15:15' },
  { id: 2, user: 'loginDemoNick21', numbers: 2, deposit: 16, withdrawal: 200, date: '2025-05-17T15:15' },
  { id: 3, user: 'loginDemoNick21', numbers: 3, deposit: 16, withdrawal: 280, date: '2025-05-17T15:15' },
  { id: 4, user: 'loginDemoNick21', numbers: 4, deposit: 16, withdrawal: 206, date: '2025-05-17T15:25' },
  { id: 5, user: 'loginDemoNick21', numbers: 5, deposit: 16, withdrawal: 280, date: '2025-05-18T15:25' },
];

export default function Dashboard() {
  const [rounds, setRounds] = useState<Round[]>(mockRounds);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Метрики
  const totalRounds = rounds.length;
  const totalDeposit = rounds.reduce((s, r) => s + r.deposit, 0);
  const totalWithdrawal = rounds.reduce((s, r) => s + r.withdrawal, 0);
  const avgCheck = totalRounds ? (totalWithdrawal / totalRounds).toFixed(2) : "0.00";

  return (
    <div style={{ padding: 32, background: "#f7f8f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 30 }}>Дашборд расходов и смен</h1>

      {/* Карточки */}
      <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
        <div style={cardStyle}>
          <div style={cardNum}>{totalRounds}</div>
          <div style={cardDesc}>Смены</div>
        </div>
        <div style={cardStyle}>
          <div style={cardNum}>${totalDeposit.toFixed(2)}</div>
          <div style={cardDesc}>Всего расходов</div>
        </div>
        <div style={cardStyle}>
          <div style={cardNum}>${totalWithdrawal.toFixed(2)}</div>
          <div style={cardDesc}>Всего вывода</div>
        </div>
        <div style={cardStyle}>
          <div style={cardNum}>${avgCheck}</div>
          <div style={cardDesc}>Средние чеки</div>
        </div>
      </div>

      {/* Фильтр по датам */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
  <div style={{ padding: 8, borderRadius: 8, background: "#fff" }}>
    <DatePicker
      selected={startDate}
      onChange={d => setStartDate(d)}
      dateFormat="dd.MM"
      placeholderText="Начальная дата"
    />
  </div>
  <div style={{ padding: 8, borderRadius: 8, background: "#fff" }}>
    <DatePicker
      selected={endDate}
      onChange={d => setEndDate(d)}
      dateFormat="dd.MM"
      placeholderText="Конечная дата"
    />
  </div>
</div>


      {/* Таблица */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 10px #0001", padding: 20, marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 18 }}>
          <thead>
            <tr style={{ background: "#f5f6f7", fontWeight: 700 }}>
              <th style={thStyle}>Пользователь</th>
              <th style={thStyle}>Номеров</th>
              <th style={thStyle}>Депозит</th>
              <th style={thStyle}>Вывод</th>
              <th style={thStyle}>Дата</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{r.user}</td>
                <td style={tdStyle}>{r.numbers}</td>
                <td style={tdStyle}>${r.deposit.toFixed(2)}</td>
                <td style={tdStyle}>${r.withdrawal.toFixed(2)}</td>
                <td style={tdStyle}>{new Date(r.date).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Inline стили (чтобы было без tailwind/css)
const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 10px #0001",
  padding: "30px 36px",
  minWidth: 180,
};
const cardNum: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#222",
};
const cardDesc: React.CSSProperties = {
  fontSize: 16,
  color: "#888",
  marginTop: 4,
};
const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "2px solid #eee",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
};

