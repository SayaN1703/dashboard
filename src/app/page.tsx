'use client'

import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-8">
    Дашборд расходов и смен
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
      <span className="text-2xl font-bold text-gray-900">6</span>
      <span className="text-sm text-gray-500">Смены</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
      <span className="text-2xl font-bold text-gray-900">$97.00</span>
      <span className="text-sm text-gray-500">Всего расходов</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
      <span className="text-2xl font-bold text-gray-900">$1055.00</span>
      <span className="text-sm text-gray-500">Всего вывода</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
      <span className="text-2xl font-bold text-gray-900">$175.83</span>
      <span className="text-sm text-gray-500">Средний чек</span>
    </div>
  </div>
</main>
  )
}
