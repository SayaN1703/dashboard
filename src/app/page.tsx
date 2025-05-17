import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./dashboard.module.css"; // простой CSS-модуль

const mockRounds = [
  // Мок-данные, тут должны быть твои данные из Supabase или API
];

export default function Dashboard() {
  const [rounds, setRounds] = useState(mockRounds);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Метрики
  const totalRounds = rounds.length;
  const totalDeposit = rounds.reduce((s, r) => s + r.deposit, 0);
  const totalWithdrawal = rounds.reduce((s, r) => s + r.withdrawal, 0);
  const avgCheck = totalRounds ? (totalWithdrawal / totalRounds).toFixed(2) : "0.00";

  // График
  const chartData = [
    // собери данные для графика по датам (можно map/reduce)
  ];

  // Фильтрация по датам (если нужна)
  // ...

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.header}>Дашборд расходов и смен</h1>
      <div className={styles.metrics}>
        <div className={styles.card}>
          <div className={styles.cardNum}>{totalRounds}</div>
          <div className={styles.cardLabel}>Смены</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNum}>${totalDeposit.toFixed(2)}</div>
          <div className={styles.cardLabel}>Всего расходов</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNum}>${totalWithdrawal.toFixed(2)}</div>
          <div className={styles.cardLabel}>Всего вывода</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNum}>${avgCheck}</div>
          <div className={styles.cardLabel}>Средний чек</div>
        </div>
      </div>
      <div className={styles.filters}>
        <DatePicker selected={startDate} onChange={setStartDate} dateFormat="dd/MM/yyyy" />
        <DatePicker selected={endDate} onChange={setEndDate} dateFormat="dd/MM/yyyy" />
      </div>
      <div className={styles.chartBlock}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="deposit" name="Депозит" stroke="#F59E42" />
            <Line type="monotone" dataKey="withdrawal" name="Вывод" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.tableBlock}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Номеров</th>
              <th>Депозит</th>
              <th>Вывод</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, idx) => (
              <tr key={idx}>
                <td>{r.username}</td>
                <td>{r.numbers}</td>
                <td style={{ color: "#F59E42" }}>${r.deposit.toFixed(2)}</td>
                <td style={{ color: "#059669" }}>${r.withdrawal.toFixed(2)}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
