import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Calculator,
  PieChart,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react";

const BudgetManager = () => {
  const [currentTab, setCurrentTab] = useState("budget");
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize budget data for all months
  const [monthlyBudgets, setMonthlyBudgets] = useState(() => {
    const initialBudget = {
      income: [
        {
          id: 1,
          name: "Stipendio",
          amount: 2550,
          frequency: "monthly",
          active: true,
        },
        { id: 2, name: "Bonus", amount: 0, frequency: "monthly", active: true },
      ],
      categories: [
        {
          id: 1,
          name: "Home",
          type: "needs",
          color: "bg-orange-500",
          items: [
            {
              id: 1,
              name: "Mutuo mese dopo",
              amount: 1140,
              frequency: "monthly",
              active: true,
            },
            {
              id: 2,
              name: "Spese condominio",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
          ],
        },
        {
          id: 2,
          name: "Car and transport",
          type: "needs",
          color: "bg-orange-500",
          items: [
            {
              id: 3,
              name: "RCA",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 4,
              name: "Benzina",
              amount: 30,
              frequency: "monthly",
              active: true,
            },
            {
              id: 5,
              name: "Bollo Auto",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 6,
              name: "Mezzi pubblici",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
          ],
        },
        {
          id: 3,
          name: "Subscriptions",
          type: "wants",
          color: "bg-blue-500",
          items: [
            {
              id: 7,
              name: "Netflix",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 8,
              name: "MS Office",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 9,
              name: "Telepass/MooneyGo",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
          ],
        },
        {
          id: 4,
          name: "Health and doctors",
          type: "needs",
          color: "bg-yellow-500",
          items: [
            {
              id: 10,
              name: "Terapia",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 11,
              name: "Dottori a pagamento",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
            {
              id: 12,
              name: "Gym",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
          ],
        },
        {
          id: 5,
          name: "Credit cards",
          type: "needs",
          color: "bg-red-500",
          items: [
            {
              id: 13,
              name: "Varie",
              amount: 150,
              frequency: "monthly",
              active: true,
            },
            {
              id: 14,
              name: "Lenti a contatto",
              amount: 19,
              frequency: "monthly",
              active: true,
            },
            {
              id: 15,
              name: "Apple iCloud",
              amount: 1,
              frequency: "monthly",
              active: true,
            },
            {
              id: 16,
              name: "Ricarica Revolut",
              amount: 0,
              frequency: "monthly",
              active: true,
            },
          ],
        },
      ],
    };

    // Initialize all 12 months with the same base data
    const allMonths = {};
    for (let i = 0; i < 12; i++) {
      allMonths[i] = JSON.parse(JSON.stringify(initialBudget));
    }
    return allMonths;
  });

  const currentBudget = monthlyBudgets[currentMonth];
  const income = currentBudget.income;
  const categories = currentBudget.categories;

  // Navigation functions
  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Update functions that work with the current month
  const updateMonthlyBudget = (updates) => {
    setMonthlyBudgets((prev) => {
      // Crea una copia profonda del mese corrente
      const updatedMonth = { ...prev[currentMonth], ...updates };
      return {
        ...prev,
        [currentMonth]: updatedMonth,
      };
    });
  };

  // Calculate 50/30/20 budget allocation
  const totalIncome = income
    .filter((item) => item.active)
    .reduce((sum, item) => sum + item.amount, 0);
  const needsBudget = totalIncome * 0.5;
  const wantsBudget = totalIncome * 0.3;
  const savingsBudget = totalIncome * 0.2;

  // Calculate actual spending by category
  const calculateCategoryTotal = (categoryType) => {
    return categories
      .filter((cat) => cat.type === categoryType)
      .reduce((total, category) => {
        return (
          total +
          category.items
            .filter((item) => item.active)
            .reduce((sum, item) => sum + item.amount, 0)
        );
      }, 0);
  };

  const needsSpent = calculateCategoryTotal("needs");
  const wantsSpent = calculateCategoryTotal("wants");
  const totalExpenses = needsSpent + wantsSpent;
  const actualSavings = totalIncome - totalExpenses;

  // Forecast calculations
  const calculateYearlyForecast = () => {
    const yearlyData = [];
    for (let month = 0; month < 12; month++) {
      const monthBudget = monthlyBudgets[month];
      const monthIncome = monthBudget.income
        .filter((item) => item.active)
        .reduce((sum, item) => sum + item.amount, 0);

      const monthNeedsSpent = monthBudget.categories
        .filter((cat) => cat.type === "needs")
        .reduce((total, category) => {
          return (
            total +
            category.items
              .filter((item) => item.active)
              .reduce((sum, item) => sum + item.amount, 0)
          );
        }, 0);

      const monthWantsSpent = monthBudget.categories
        .filter((cat) => cat.type === "wants")
        .reduce((total, category) => {
          return (
            total +
            category.items
              .filter((item) => item.active)
              .reduce((sum, item) => sum + item.amount, 0)
          );
        }, 0);

      const monthTotalExpenses = monthNeedsSpent + monthWantsSpent;
      const monthSavings = monthIncome - monthTotalExpenses;

      yearlyData.push({
        month: months[month],
        income: monthIncome,
        needs: monthNeedsSpent,
        wants: monthWantsSpent,
        totalExpenses: monthTotalExpenses,
        savings: monthSavings,
        needsBudget: monthIncome * 0.5,
        wantsBudget: monthIncome * 0.3,
        savingsBudget: monthIncome * 0.2,
      });
    }
    return yearlyData;
  };

  // Palette di colori per le categorie
  const categoryColors = [
    "#f59e42", // arancione
    "#2563eb", // blu
    "#22c55e", // verde
    "#eab308", // giallo
    "#ef4444", // rosso
    "#a21caf", // viola
    "#14b8a6", // teal
    "#f472b6", // rosa
  ];

  // Aggiorno addCategory per assegnare un colore ciclico
  const addCategory = () => {
    const color = categoryColors[categories.length % categoryColors.length];
    const newCategory = {
      id: Date.now(),
      name: "NEW CATEGORY",
      type: "needs",
      color,
      items: [],
    };
    updateMonthlyBudget({ categories: [...categories, newCategory] });
  };

  // Aggiorno addItem per includere type: "needs"
  const addItem = (categoryId) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newItem = {
          id: Date.now(),
          name: "New Item",
          amount: 0,
          frequency: "monthly",
          active: true,
          actual: false,
          type: "needs",
        };
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });
    updateMonthlyBudget({ categories: updatedCategories });
  };

  const updateItem = (categoryId, itemId, field, value) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        };
      }
      return cat;
    });
    updateMonthlyBudget({ categories: updatedCategories });
  };

  const updateCategory = (categoryId, field, value) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    );
    updateMonthlyBudget({ categories: updatedCategories });
  };

  const deleteItem = (categoryId, itemId) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== itemId),
        };
      }
      return cat;
    });
    updateMonthlyBudget({ categories: updatedCategories });
  };

  const updateIncome = (incomeId, field, value) => {
    const updatedIncome = income.map((item) =>
      item.id === incomeId ? { ...item, [field]: value } : item
    );
    updateMonthlyBudget({ income: updatedIncome });
  };

  const addIncomeItem = () => {
    const newIncome = {
      id: Date.now(),
      name: "New Income",
      amount: 0,
      frequency: "monthly",
      active: true,
    };
    updateMonthlyBudget({ income: [...income, newIncome] });
  };

  const deleteIncomeItem = (incomeId) => {
    const updatedIncome = income.filter((item) => item.id !== incomeId);
    updateMonthlyBudget({ income: updatedIncome });
  };

  const yearlyForecast = calculateYearlyForecast();
  const yearlyTotals = yearlyForecast.reduce(
    (totals, month) => ({
      income: totals.income + month.income,
      needs: totals.needs + month.needs,
      wants: totals.wants + month.wants,
      totalExpenses: totals.totalExpenses + month.totalExpenses,
      savings: totals.savings + month.savings,
    }),
    { income: 0, needs: 0, wants: 0, totalExpenses: 0, savings: 0 }
  );

  // Aggiorno i calcoli per usare il tipo dell'item invece che della categoria
  const calculateActualTotal = (itemType) => {
    return categories.reduce((total, category) => {
      return (
        total +
        category.items
          .filter(
            (item) => item.active && item.actual && item.type === itemType
          )
          .reduce((sum, item) => sum + item.amount, 0)
      );
    }, 0);
  };
  const calculatePlannedTotal = (itemType) => {
    return categories.reduce((total, category) => {
      return (
        total +
        category.items
          .filter((item) => item.active && item.type === itemType)
          .reduce((sum, item) => sum + item.amount, 0)
      );
    }, 0);
  };
  const needsActual = calculateActualTotal("needs");
  const wantsActual = calculateActualTotal("wants");
  const needsPlanned = calculatePlannedTotal("needs");
  const wantsPlanned = calculatePlannedTotal("wants");
  const savingsActual = totalIncome - (needsActual + wantsActual);
  const savingsPlanned = totalIncome - (needsPlanned + wantsPlanned);

  // Prima del return, calcolo i cumulative savings per ogni mese
  const yearlyForecastWithCumulative = (() => {
    let cumulative = 0;
    return yearlyForecast.map((month) => {
      cumulative += month.savings;
      return { ...month, cumulative };
    });
  })();

  return (
    <div className="container">
      <div>
        {/* Header with tabs */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h1
              style={{
                fontSize: "2.2em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calculator style={{ color: "#2563eb" }} />
              Personal Budget Manager
            </h1>
            {/* Tab Navigation */}
            <div className="tabs">
              <button
                onClick={() => setCurrentTab("budget")}
                className={`tab-btn${currentTab === "budget" ? " active" : ""}`}
              >
                <Calculator size={16} /> Monthly Budget
              </button>
              <button
                onClick={() => setCurrentTab("forecast")}
                className={`tab-btn${
                  currentTab === "forecast" ? " active" : ""
                }`}
              >
                <BarChart3 size={16} /> Yearly Forecast
              </button>
            </div>
          </div>

          {currentTab === "budget" && (
            <>
              {/* Month Navigation */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <p style={{ color: "#4a5a6a" }}>
                  Manage your budget using the 50/30/20 rule
                </p>
                <div className="month-nav">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="month-btn"
                  >
                    &#60;
                  </button>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Calendar size={16} style={{ color: "#4a5a6a" }} />
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#222",
                        minWidth: 120,
                        textAlign: "center",
                      }}
                    >
                      {months[currentMonth]} {currentYear}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="month-btn"
                  >
                    &#62;
                  </button>
                </div>
              </div>

              {/* Budget Overview Cards */}
              <div className="summary-cards">
                <div className="summary-card">
                  <span className="label">Total Income</span>
                  <span className="value">€{totalIncome.toFixed(0)}</span>
                  <TrendingUp
                    style={{ color: "#22c55e", marginTop: 8 }}
                    size={24}
                  />
                </div>
                <div className="summary-card">
                  <span className="label">Needs</span>
                  <span className="value">
                    <span className="value-label">Actual vs Budget: </span> €
                    {needsActual.toFixed(0)} / €{needsBudget.toFixed(0)}
                  </span>
                  <span style={{ fontSize: "0.98em" }}>
                    Actual vs Planned: €{needsActual.toFixed(0)} / €
                    {needsPlanned.toFixed(0)}
                  </span>
                  <span style={{ fontSize: "0.98em", color: "#fb923c" }}>
                    %:{" "}
                    {(needsBudget
                      ? (needsActual / needsBudget) * 100
                      : 0
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="summary-card">
                  <span className="label">Wants</span>
                  <span className="value">
                    <span className="value-label">Actual vs Budget:</span>{" "}
                    <span>
                      {" "}
                      €{wantsActual.toFixed(0)} / €{wantsBudget.toFixed(0)}
                    </span>
                  </span>
                  <span style={{ fontSize: "0.98em" }}>
                    Actual vs Planned: €{wantsActual.toFixed(0)} / €
                    {wantsPlanned.toFixed(0)}
                  </span>
                  <span style={{ fontSize: "0.98em", color: "#2563eb" }}>
                    %:{" "}
                    {(wantsBudget
                      ? (wantsActual / wantsBudget) * 100
                      : 0
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="summary-card">
                  <span className="label">Savings</span>
                  <span className="value">
                    <span className="value-label">Actual vs Budget:</span> €
                    {savingsActual.toFixed(0)} / €{savingsBudget.toFixed(0)}
                  </span>
                  <span style={{ fontSize: "0.98em" }}>
                    Actual vs Planned: €{savingsActual.toFixed(0)} / €
                    {savingsPlanned.toFixed(0)}
                  </span>
                  <span style={{ fontSize: "0.98em", color: "#a21caf" }}>
                    %:{" "}
                    {(savingsBudget
                      ? (savingsActual / savingsBudget) * 100
                      : 0
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              {/* Income Section */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: "1.2em", marginBottom: 12 }}>Income</h2>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Frequency</th>
                      <th>Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {income.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateIncome(item.id, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              updateIncome(
                                item.id,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={item.frequency}
                            onChange={(e) =>
                              updateIncome(item.id, "frequency", e.target.value)
                            }
                          >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.active}
                            onChange={(e) =>
                              updateIncome(item.id, "active", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn"
                            style={{ background: "#dc2626" }}
                            onClick={() => deleteIncomeItem(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="btn"
                  style={{ marginTop: 10 }}
                  onClick={addIncomeItem}
                >
                  <Plus size={16} /> Add Income
                </button>
              </div>

              {/* Categories Section */}
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h2 style={{ fontSize: "1.2em" }}>Expenses Categories</h2>
                  <button className="btn" onClick={addCategory}>
                    <Plus size={16} /> Add Category
                  </button>
                </div>
                {categories.map((category) => {
                  // Calcolo il colore con trasparenza 50%
                  const bgColor = category.color
                    ? category.color.replace("#", "#80") // fallback semplice per hex, meglio usare rgba se serve
                    : "rgba(37,99,235,0.08)";
                  return (
                    <div
                      key={category.id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderLeft: `8px solid ${category.color || "#2563eb"}`,
                        borderRadius: 8,
                        marginBottom: 18,
                        padding: 16,
                        background: category.color
                          ? category.color.length === 7
                            ? category.color + "20" // aggiunge trasparenza 50% a hex (es: #2563eb20)
                            : category.color
                          : "rgba(37,99,235,0.08)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <input
                          value={category.name}
                          onChange={(e) =>
                            updateCategory(category.id, "name", e.target.value)
                          }
                          style={{
                            fontWeight: 700,
                            fontSize: "1.1em",
                            color: category.color || "#2563eb",
                            background: "transparent",
                            border: "none",
                          }}
                        />
                      </div>
                      <table style={{ width: "100%", marginBottom: 8 }}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Frequency</th>
                            <th>Active</th>
                            <th>Actual</th>
                            <th>Type</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <input
                                  value={item.name}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "amount",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <select
                                  value={item.frequency}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "frequency",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item.active}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "active",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item.actual || false}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "actual",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <select
                                  value={item.type}
                                  onChange={(e) =>
                                    updateItem(
                                      category.id,
                                      item.id,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="needs">Needs</option>
                                  <option value="wants">Wants</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="btn"
                                  style={{ background: "#dc2626" }}
                                  onClick={() =>
                                    deleteItem(category.id, item.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        className="btn"
                        onClick={() => addItem(category.id)}
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {currentTab === "forecast" && (
            <div>
              <p style={{ color: "#4a5a6a", marginBottom: 16 }}>
                Yearly budget forecast based on monthly plans
              </p>
              {/* Yearly Summary Cards */}
              <div className="summary-cards" style={{ marginBottom: 24 }}>
                <div className="summary-card">
                  <span className="label">Total Yearly Income</span>
                  <span className="value">
                    €{yearlyTotals.income.toFixed(0)}
                  </span>
                </div>
                <div className="summary-card">
                  <span className="label">Total Needs</span>
                  <span className="value">
                    €{yearlyTotals.needs.toFixed(0)}
                  </span>
                </div>
                <div className="summary-card">
                  <span className="label">Total Wants</span>
                  <span className="value">
                    €{yearlyTotals.wants.toFixed(0)}
                  </span>
                </div>
                <div className="summary-card">
                  <span className="label">Total Savings</span>
                  <span className="value">
                    €{yearlyTotals.savings.toFixed(0)}
                  </span>
                </div>
              </div>
              {/* Forecast Table */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Needs</th>
                      <th>Wants</th>
                      <th>Savings</th>
                      <th>Cumulative Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyForecastWithCumulative.map((month, index) => (
                      <tr
                        key={index}
                        style={
                          index === currentMonth
                            ? { background: "#dbeafe" }
                            : {}
                        }
                      >
                        <td style={{ fontWeight: 600, color: "#222" }}>
                          {month.month}
                          {index === currentMonth && (
                            <span style={{ marginLeft: 8, color: "#2563eb" }}>
                              ●
                            </span>
                          )}
                        </td>
                        <td>€{month.income.toFixed(0)}</td>
                        <td
                          style={
                            month.needs > needsBudget
                              ? { color: "#dc2626", fontWeight: 600 }
                              : { color: "#222" }
                          }
                        >
                          €{month.needs.toFixed(0)}
                        </td>
                        <td
                          style={
                            month.wants > wantsBudget
                              ? { color: "#dc2626", fontWeight: 600 }
                              : { color: "#222" }
                          }
                        >
                          €{month.wants.toFixed(0)}
                        </td>
                        <td
                          style={
                            month.savings < savingsBudget
                              ? { color: "#dc2626", fontWeight: 600 }
                              : { color: "#22c55e", fontWeight: 600 }
                          }
                        >
                          €{month.savings.toFixed(0)}
                        </td>
                        <td
                          style={{
                            fontWeight: 600,
                            color: month.cumulative < 0 ? "#dc2626" : "#2563eb",
                          }}
                        >
                          €{month.cumulative.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
