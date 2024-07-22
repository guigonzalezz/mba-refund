const form = document.querySelector("form");
const itemsList = document.querySelector("ul");

const amount = document.getElementById("amount");
const title = document.getElementById("title");
const category = document.getElementById("category");
const expensesNumber = document.getElementById("expensesNumber");
const expensesTotal = document.getElementById("expensesTotal");

const formatCurrencyUSD = value => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const createExpenseElement = (tag, className, textContent) => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
};

const expenseAdd = newExpense => {
    try {
        const expenseItem = createExpenseElement("li", "expense");
        const expenseIcon = createExpenseElement("img");
        expenseIcon.src = `assets/${newExpense.category_id}.svg`;
        expenseIcon.alt = `icon of ${newExpense.category_name}`;

        const expenseInfo = createExpenseElement("div");
        expenseInfo.append(
            createExpenseElement("span", null, newExpense.title),
            createExpenseElement("span", null, newExpense.category_name)
        );

        const expenseinfoValue = createExpenseElement("div");
        expenseinfoValue.innerHTML = `
            <span><small>$</small><strong class="expense-amount">${newExpense.amount.replace("$", "")}</strong></span>
            <img class="removeIcon" src="assets/remove.svg" alt="icon to remove item from list">
        `;

        expenseItem.append(expenseIcon, expenseInfo, expenseinfoValue);
        itemsList.append(expenseItem);

        updateTotals();
        formClear();

    } catch (error) {
        alert("Could not update the expense list.");
        console.error(error);
    }
};

const updateTotals = () => {
    try {
        const items = itemsList.children;
        expensesNumber.textContent = `${items.length} ${items.length > 1 ? "Expenses" : "Expense"}`;

        let total = Array.from(items).reduce((sum, item) => {
            const value = parseFloat(item.querySelector(".expense-amount").textContent.replace(/[^0-9.]/g, ""));
            if (isNaN(value)) throw new Error("Value is not a number");
            return sum + value;
        }, 0);

        expensesTotal.textContent = formatCurrencyUSD(total).replace("$", "").toUpperCase();
    } catch (error) {
        console.error(error);
        alert("Could not update the totals.");
    }
};

const formClear = () => {
    amount.value = "";
    title.value = "";
    category.value = "";
    title.focus();
};

amount.oninput = () => {
    let value = parseFloat(amount.value.replace(/\D/g, "")) / 100;
    amount.value = formatCurrencyUSD(value);
};

form.onsubmit = event => {
    event.preventDefault();

    const newExpense = {
        id: Date.now(),
        title: title.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    };

    expenseAdd(newExpense);
};

itemsList.addEventListener("click", event => {
    if (event.target.classList.contains("removeIcon")) {
        event.target.closest(".expense").remove();
        updateTotals();
    }
});
