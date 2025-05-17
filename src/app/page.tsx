'use client';

import React, { useMemo } from 'react';

// Заглушка данных, замени на свои useState/useEffect для API
const rounds = [
  {
    id: 1,
    username: 'loginDemoNick21',
    numbers: 1,
    deposit: 16,
    withdrawal: 200,
    ended_at: '2025-05-17T15:15:00',
  },
  // ... другие строки
];

export default function Home() {
  // Пример расчетов
  const summary = useMemo(() => {
    const totalRounds = rounds.length;
    const totalDeposit = rounds.reduce((s, r) => s + r.deposit, 0);
    const totalWithdrawal = rounds.reduce((s, r) => s + r.withdrawal, 0);
    const avgCheck = totalRounds ? totalWithdrawal / totalRounds : 0;
    return { totalRounds, totalDeposit, totalWithdrawal, avgCheck };
  }, []);

  return (
    <div>
      <style>{`
        .dashboard-cards {
          display: flex;
          gap: 30px;
          margin-bottom: 32px;
        }
        .dashboard-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 24px 32px;
          min-width: 160px;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 32px;
        }
        .dashboard-table th, .dashboard-table td {
          padding: 10px 14px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .dashboard-table th {
          background: #fafafa;
        }
        .dashboard-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 32px;
        }
        body, html, .main-bg {
          background: #f7f9fa;
        }
      `}</style>

      <h1 className="dashboard-title">Дашборд расходов и смен</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary.totalRounds}</div>
          <div>Смены</div>
        </div>
        <div className="dashboard-card">
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${summary.totalDeposit.toFixed(2)}</div>
          <div>Всего расходов</div>
        </div>
        <div className="dashboard-card">
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${summary.totalWithdrawal.toFixed(2)}</div>
          <div>Всего вывода</div>
        </div>
        <div className="dashboard-card">
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${summary.avgCheck.toFixed(2)}</div>
          <div>Средний чек</div>
        </div>
      </div>

      {/* Таблица */}
      <table className="dashboard-table">
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
          {rounds.map((r) => (
            <tr key={r.id}>
              <td>{r.username}</td>
              <td>{r.numbers}</td>
              <td>${r.deposit.toFixed(2)}</td>
              <td>${r.withdrawal.toFixed(2)}</td>
              <td>
                {r.ended_at
                  ? `${new Date(r.ended_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })} ${new Date(r.ended_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
