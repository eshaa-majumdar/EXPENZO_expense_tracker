let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expense-form");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
const chartButton = document.getElementById("show-chart-btn");
const themeToggle = document.getElementById("theme-toggle");
const chartWrapper = document.querySelector(".chart-wrapper");
const chartCanvas = document.getElementById("categoryChart");

let categoryChart;

// Update list and filter
function updateList() {
    list.innerHTML = "";
    let total = 0;

    const filterCat = filterCategory.value;
    const filterDt = filterDate.value;

    const filtered = expenses.filter(exp => {
        const matchCat = !filterCat || exp.category === filterCat;
        const matchDate = !filterDt || exp.date.startsWith(filterDt);
        return matchCat && matchDate;
    });

    filtered.forEach((exp, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${exp.title} (₹${exp.amount}) - ${exp.category} on ${exp.date}
      <button onclick="deleteExpense(${index})">×</button>`;
        list.appendChild(li);
        total += Number(exp.amount);
    });

    totalEl.innerText = `Total: ₹${total}`;
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateList();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newExpense = {
        title: title.value,
        amount: amount.value,
        category: category.value,
        date: date.value
    };
    expenses.push(newExpense);
    title.value = "";
    amount.value = "";
    date.value = "";
    updateList();
});

filterCategory.addEventListener("change", updateList);
filterDate.addEventListener("change", updateList);

chartButton.addEventListener("click", () => {
    chartWrapper.style.display = "flex";
    renderChart(expenses);
});

function renderChart(data) {
    const ctx = chartCanvas.getContext("2d");
    const categoryTotals = {};

    data.forEach(exp => {
        if (categoryTotals[exp.category]) {
            categoryTotals[exp.category] += Number(exp.amount);
        } else {
            categoryTotals[exp.category] = Number(exp.amount);
        }
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses",
                data: values,
                backgroundColor: ["#FFB3C6", "#A0E7E5", "#B4F8C8", "#FFDAC1"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

// Dark mode toggle
function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark");
        themeToggle.checked = true;
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark");
        themeToggle.checked = false;
        localStorage.setItem("theme", "light");
    }
}

themeToggle.addEventListener("change", () => {
    setTheme(themeToggle.checked);
});

setTheme(localStorage.getItem("theme") === "dark");

updateList();
