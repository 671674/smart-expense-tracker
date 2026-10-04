"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [budget, setBudget] = useState(20000);
  const [budgetInput, setBudgetInput] = useState(20000);

  useEffect(() => {
  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
    }
  }

  checkUser();
}, []);

  // LOAD TRANSACTIONS
  async function loadTransactions() {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  // FORM CHANGE
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ADD / UPDATE TRANSACTION
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await fetch("/api/transactions", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingId,
            ...form,
            amount: Number(form.amount),
          }),
        });
      } else {
        response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert(
        editingId
          ? "Transaction updated!"
          : "Transaction added!"
      );

      setForm({
        type: "expense",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });

      setEditingId(null);
      setShowForm(false);

      loadTransactions();
    } catch (error) {
      alert("Error connecting to server");
      console.log(error);
    }
  }

  // EDIT
  function handleEdit(transaction) {
    setEditingId(transaction.id);

    setForm({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // DELETE
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      alert("Transaction deleted!");

      loadTransactions();
    } catch (error) {
      alert("Error deleting transaction");
      console.log(error);
    }
  }

  // LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  // TOTALS
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const remainingBudget = budget - totalExpenses;

  // SEARCH
  const filteredTransactions = transactions.filter((t) => {
    const text =
      `${t.category} ${t.description || ""} ${t.type}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  // EXPENSE CATEGORIES
  const expenseCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Education",
    "Bills",
    "Entertainment",
    "Other",
  ];

  // CATEGORY TOTALS
  const categoryTotals = expenseCategories.map((category) => {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
  });

  // INCOME VS EXPENSE CHART
  const incomeExpenseData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  // CATEGORY CHART
  const categoryData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses",
        data: categoryTotals,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
          "#ec4899",
          "#6b7280",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white p-6 shadow-lg">

        <h1 className="text-2xl font-bold text-blue-600">
          💰 Smart Expense
        </h1>

        <nav className="mt-10 space-y-3">

          <a
            href="#dashboard"
            className="block rounded-lg bg-blue-600 px-4 py-3 text-white"
          >
            🏠 Dashboard
          </a>

          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
          >
            ➕ Add Transaction
          </button>

          <a
            href="#transactions"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            💳 Transactions
          </a>

          <a
            href="#budget"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            🎯 Budget
          </a>

          <a
            href="#reports"
            className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            📊 Reports
          </a>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-6 block w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
          >
            🚪 Logout
          </button>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-8">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="text-gray-600">
              Manage your income and expenses easily.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Transaction
          </button>

        </div>

        {/* DASHBOARD CARDS */}
        <section id="dashboard">

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-medium text-gray-600">
                Total Balance
              </p>

              <h3 className="mt-2 text-3xl font-bold text-blue-600">
                ₹{balance.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-medium text-gray-600">
                Total Income
              </p>

              <h3 className="mt-2 text-3xl font-bold text-green-600">
                ₹{totalIncome.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>

              <h3 className="mt-2 text-3xl font-bold text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </h3>
            </div>

          </div>
        </section>

        {/* ADD / EDIT TRANSACTION */}
        {showForm && (
          <section className="mt-8 rounded-xl bg-white p-6 shadow">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold text-gray-900">
                {editingId
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-600 hover:text-red-500"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Education</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                  <option>Salary</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                />
              </div>

              <div className="md:col-span-2">

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Example: Lunch with friends"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                />

              </div>

              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingId
                    ? "Update Transaction"
                    : "Save Transaction"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* TRANSACTIONS */}
        <section
          id="transactions"
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Transactions
              </h2>

              <p className="text-sm text-gray-600">
                All your transactions from the database.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 p-3 text-gray-800 md:w-64"
            />

          </div>

          {filteredTransactions.length === 0 ? (

            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-600">
              No transactions found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">

                    <th className="p-3">
                      Date
                    </th>

                    <th className="p-3">
                      Category
                    </th>

                    <th className="p-3">
                      Description
                    </th>

                    <th className="p-3">
                      Type
                    </th>

                    <th className="p-3">
                      Amount
                    </th>

                    <th className="p-3">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredTransactions.map(
                    (transaction) => (

                      <tr
                        key={transaction.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-3 text-gray-700">
                          {transaction.date}
                        </td>

                        <td className="p-3 font-medium text-gray-800">
                          {transaction.category}
                        </td>

                        <td className="p-3 text-gray-700">
                          {transaction.description || "-"}
                        </td>

                        <td className="p-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transaction.type}
                          </span>

                        </td>

                        <td
                          className={`p-3 font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "+"
                            : "-"}
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString()}
                        </td>

                        <td className="p-3">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleEdit(transaction)
                              }
                              className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  transaction.id
                                )
                              }
                              className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* BUDGET */}
        <section
          id="budget"
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >

          <h2 className="text-xl font-bold text-gray-900">
            Monthly Budget
          </h2>

          <div className="mt-5 grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-600">
                Budget
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{budget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Amount Spent
              </p>

              <p className="mt-1 text-2xl font-bold text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Remaining
              </p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  remainingBudget >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{remainingBudget.toLocaleString()}
              </p>
            </div>

          </div>

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Set Monthly Budget
            </label>

            <div className="flex gap-3">

              <input
                type="number"
                value={budgetInput}
                onChange={(e) =>
                  setBudgetInput(
                    Number(e.target.value)
                  )
                }
                className="flex-1 rounded-lg border border-gray-300 p-3 text-gray-800"
                placeholder="Enter monthly budget"
              />

              <button
                type="button"
                onClick={() =>
                  setBudget(budgetInput)
                }
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Set Budget
              </button>

            </div>

          </div>

        </section>

        {/* REPORTS */}
        <section
          id="reports"
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >

          <h2 className="text-xl font-bold text-gray-900">
            Reports
          </h2>

          {/* SUMMARY */}
          <div className="mt-5 grid gap-6 md:grid-cols-2">

            <div className="rounded-lg bg-green-50 p-5">

              <p className="text-sm text-gray-600">
                Total Income
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                ₹{totalIncome.toLocaleString()}
              </p>

            </div>

            <div className="rounded-lg bg-red-50 p-5">

              <p className="text-sm text-gray-600">
                Total Expenses
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </p>

            </div>

          </div>

          {/* CHARTS */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            {/* INCOME VS EXPENSE */}
            <div className="rounded-xl border border-gray-200 p-5">

              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Income vs Expenses
              </h3>

              <div className="h-64">

                <Bar
                  data={incomeExpenseData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    datasets: {
                      bar: {
                        barThickness: 60,
                        maxBarThickness: 60,
                      },
                    },

                    plugins: {
                      legend: {
                        display: false,
                      },
                    },

                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />

              </div>

            </div>

            {/* EXPENSE BY CATEGORY */}
            <div className="rounded-xl border border-gray-200 p-5">

              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Expenses by Category
              </h3>

              <div className="mx-auto h-56 w-full max-w-xs">

                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                      legend: {
                        position: "bottom",

                        labels: {
                          boxWidth: 12,
                          padding: 12,
                        },
                      },
                    },
                  }}
                />

              </div>

            </div>

          </div>

          {/* EXPENSE RATIO */}
          <div className="mt-8">

            <h3 className="mb-3 font-semibold text-gray-800">
              Expense Overview
            </h3>

            <div className="h-5 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full bg-red-500"
                style={{
                  width:
                    totalIncome > 0
                      ? `${Math.min(
                          (totalExpenses /
                            totalIncome) *
                            100,
                          100
                        )}%`
                      : "0%",
                }}
              ></div>

            </div>

            <p className="mt-2 text-sm text-gray-600">
              Expense ratio compared with total income.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}