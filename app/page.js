"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              💰
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-600">
                Smart Expense
              </h1>
              <p className="text-xs text-gray-500">
                Track. Budget. Save.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              💡 Smart way to manage your money
            </div>

            <h2 className="text-5xl font-bold leading-tight text-gray-900">
              Take Control of Your
              <span className="block text-blue-600">
                Expenses & Budget
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Smart Expense Tracker helps you record transactions,
              monitor your budget, understand your spending, and view
              clear financial reports in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:bg-blue-700"
              >
                Start Tracking →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-blue-100">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-7 text-white">
              <p className="text-sm text-blue-100">
                Your Financial Overview
              </p>

              <p className="mt-2 text-4xl font-bold">
                ₹24,850
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Income</p>
                  <p className="mt-1 text-xl font-bold">₹35,000</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-sm text-blue-100">Expenses</p>
                  <p className="mt-1 text-xl font-bold">₹10,150</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white/10 p-4">
                <div className="flex justify-between text-sm">
                  <span>Monthly Budget</span>
                  <span>68%</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-white/20">
                  <div className="h-2 w-[68%] rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold text-blue-600">FEATURES</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            Everything you need to manage expenses
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Simple tools to help you understand where your money goes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon="💳"
            title="Transactions"
            text="Add, edit, delete and search your income and expenses."
          />

          <Feature
            icon="🎯"
            title="Budget Tracking"
            text="Set a monthly budget and monitor your remaining amount."
          />

          <Feature
            icon="📊"
            title="Smart Reports"
            text="View income, expenses and category-wise spending reports."
          />

          <Feature
            icon="📈"
            title="Visual Analytics"
            text="Understand your finances with clear charts and summaries."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center text-white">
          <h3 className="text-3xl font-bold">
            Ready to manage your expenses smarter?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your account and start tracking your money today.
          </p>

          <Link
            href="/signup"
            className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow hover:bg-blue-50"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-400">
        © 2026 Smart Expense Tracker. Built with Next.js, Supabase & PostgreSQL.
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
        {icon}
      </div>

      <h4 className="mt-5 text-lg font-bold text-gray-900">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  );
}