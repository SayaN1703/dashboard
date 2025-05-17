'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import supabase from '../supabaseClient'

type Round = {
  id: number
  user_id: string
  username: string | null
  numbers: number
  deposit: number
  withdrawal: number
  started_at: string | null
  ended_at: string | null
}

export default function Home() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  )
  const [endDate, setEndDate] = useState<Date>(new Date())

  useEffect(() => {
    async function loadRounds() {
      setLoading(true)
      let q = supabase
        .from<'rounds', Round>('rounds')
        .select('*')
        .order('ended_at', { ascending: false })
      if (startDate) q = q.gte('ended_at', startDate.toISOString())
      if (endDate) q = q.lte('ended_at', endDate.toISOString())
      const { data, error } = await q
      if (error) console.error(error.message)
      else setRounds(data ?? [])
      setLoading(false)
    }

    loadRounds()
    const ch = supabase
      .channel('realtime:rounds')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rounds' },
        loadRounds
      )
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [startDate, endDate])

  const summary = useMemo(() => {
    const totalRounds = rounds.length
    const totalDeposit = rounds.reduce((s, r) => s + r.deposit, 0)
    const totalWithdrawal = rounds.reduce((s, r) => s + r.withdrawal, 0)
    const avgCheck = totalRounds ? totalWithdrawal / totalRounds : 0
    return { totalRounds, totalDeposit, totalWithdrawal, avgCheck }
  }, [rounds])

  const chartData = useMemo(() => {
    const m: Record<string, { date: string; deposit: number; withdrawal: number }> =
      {}
    rounds.forEach((r) => {
      if (!r.ended_at) return
      const d = new Date(r.ended_at).toISOString().slice(0, 10)
      if (!m[d]) m[d] = { date: d, deposit: 0, withdrawal: 0 }
      m[d].deposit += r.deposit
      m[d].withdrawal += r.withdrawal
    })
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date))
  }, [rounds])

  return (
    <main className="min-h-screen bg-neutral-100 p-4 sm:p-8 flex flex-col items-center">
      {/* Заголовок */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        Дашборд расходов и смен
      </h1>

      {/* Карточки */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 max-w-6xl">
        <div className="bg-white rounded-2xl shadow flex flex-col justify-center items-center p-7 min-w-[160px]">
          <span className="text-3xl font-extrabold text-gray-900">{summary.totalRounds}</span>
          <span className="text-base text-gray-500 mt-2">Смены</span>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col justify-center items-center p-7 min-w-[160px]">
          <span className="text-3xl font-extrabold text-gray-900">${summary.totalDeposit.toFixed(2)}</span>
          <span className="text-base text-gray-500 mt-2">Всего расходов</span>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col justify-center items-center p-7 min-w-[160px]">
          <span className="text-3xl font-extrabold text-gray-900">${summary.totalWithdrawal.toFixed(2)}</span>
          <span className="text-base text-gray-500 mt-2">Всего вывода</span>
        </div>
        <div className="bg-white rounded-2xl shadow flex flex-col justify-center items-center p-7 min-w-[160px]">
          <span className="text-3xl font-extrabold text-gray-900">${summary.avgCheck.toFixed(2)}</span>
          <span className="text-base text-gray-500 mt-2">Средний чек</span>
        </div>
      </div>

      {/* Фильтр по датам */}
      <div className="w-full flex flex-wrap justify-start gap-4 mb-6 max-w-6xl">
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow min-w-[170px]">
          <DatePicker
            selected={startDate}
            onChange={(d) => d && setStartDate(d)}
            dateFormat="MM/dd/yyyy"
            maxDate={new Date()}
            className="border-none bg-transparent text-gray-900 text-base w-28 outline-none"
            calendarClassName="!z-30"
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow min-w-[170px]">
          <DatePicker
            selected={endDate}
            onChange={(d) => d && setEndDate(d)}
            dateFormat="MM/dd/yyyy"
            maxDate={new Date()}
            className="border-none bg-transparent text-gray-900 text-base w-28 outline-none"
            calendarClassName="!z-30"
          />
        </div>
      </div>

      {/* График */}
      <div className="w-full bg-white rounded-2xl shadow p-6 mb-6 max-w-6xl">
        {loading ? (
          <p className="text-gray-600">Загрузка данных...</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" stroke="#52525b" fontSize={12} />
              <YAxis stroke="#52525b" fontSize={12} />
              <Tooltip
                formatter={(v: number | string) => `$${Number(v).toFixed(2)}`}
                contentStyle={{ borderRadius: 8, fontWeight: 500 }}
              />
              <Legend iconType="plainline" />
              <Line
                type="monotone"
                dataKey="deposit"
                name="Депозит"
                stroke="#F59E42"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="withdrawal"
                name="Вывод"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Таблица */}
      <div className="w-full bg-white rounded-2xl shadow p-6 mb-10 max-w-6xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-base text-left">
            <thead>
              <tr className="text-gray-700 border-b font-bold">
                <th className="py-3 px-4">Пользователь</th>
                <th className="py-3 px-4 text-center">Номеров</th>
                <th className="py-3 px-4">Депозит</th>
                <th className="py-3 px-4">Вывод</th>
                <th className="py-3 px-4">Дата</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="py-2 px-4 font-medium text-gray-900">{r.username || r.user_id}</td>
                  <td className="py-2 px-4 text-center">{r.numbers}</td>
                  <td className="py-2 px-4 text-orange-500 font-semibold">${r.deposit.toFixed(2)}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">${r.withdrawal.toFixed(2)}</td>
                  <td className="py-2 px-4 text-gray-500">
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
      </div>
    </main>
  )
}
