const defaultData = {
    users: [
        { id: 1, name1: "Александр", name2: "Иванов", email: "alex.ivanov@mail.ru", role: "admin", group: "IT", status: "active", date: "2026-01-10" },
        { id: 2, name1: "Мария", name2: "Петрова", email: "maria.petrova@yandex.ru", role: "developer", group: "sec", status: "active", date: "2026-01-12" },
        { id: 3, name1: "Дмитрий", name2: "Смирнов", email: "dmitry.smirnov@gmail.com", role: "admin", group: "fin", status: "active", date: "2026-01-15" },
        { id: 4, name1: "Елена", name2: "Кузнецова", email: "elena.kuznetsova@mail.ru", role: "developer", group: "IT", status: "active", date: "2026-01-18" },
        { id: 5, name1: "Сергей", name2: "Попов", email: "sergey.popov@yandex.ru", role: "developer", group: "IT", status: "blocked", date: "2026-01-20" },
        { id: 6, name1: "Анна", name2: "Васильева", email: "anna.vasilyeva@mail.ru", role: "admin", group: "sec", status: "active", date: "2026-02-01" },
        { id: 7, name1: "Андрей", name2: "Соколов", email: "andrey.sokolov@gmail.com", role: "auditor", group: "IT", status: "active", date: "2026-02-05" },
        { id: 8, name1: "Ольга", name2: "Михайлова", email: "olga.mikhailova@yandex.ru", role: "developer", group: "sec", status: "active", date: "2026-02-10" },
        { id: 9, name1: "Алексей", name2: "Новиков", email: "alexey.novikov@mail.ru", role: "auditor", group: "fin", status: "active", date: "2026-02-14" },
        { id: 10, name1: "Татьяна", name2: "Фёдорова", email: "tatiana.fedorova@yandex.ru", role: "developer", group: "sec", status: "active", date: "2026-02-18" },
        { id: 11, name1: "Иван", name2: "Морозов", email: "ivan.morozov@gmail.com", role: "developer", group: "IT", status: "active", date: "2026-02-22" },
        { id: 12, name1: "Наталья", name2: "Волкова", email: "natalia.volkova@mail.ru", role: "developer", group: "IT", status: "active", date: "2026-03-01" },
        { id: 13, name1: "Максим", name2: "Алексеев", email: "maksim.alekseev@yandex.ru", role: "developer", group: "IT", status: "blocked", date: "2026-03-04" },
        { id: 14, name1: "Екатерина", name2: "Лебедева", email: "ekaterina.lebedeva@gmail.com", role: "developer", group: "sec", status: "active", date: "2026-03-08" },
        { id: 15, name1: "Владимир", name2: "Семёнов", email: "vladimir.semenov@yandex.ru", role: "developer", group: "sec", status: "active", date: "2026-03-10" }
    ],
    roles: [
        { id: "admin", name: "Администратор", permissions: ["read", "create", "update", "delete"] },
        { id: "developer", name: "Программист", permissions: ["read", "create"] },
        { id: "auditor", name: "Аудитор", permissions: ["read"] }
    ],
    groups: [
        { id: "IT", name: "IT-отдел" },
        { id: "sec", name: "Безопасность" },
        { id: "fin", name: "Финансы" }
    ],
    audit: []
};

let appData = JSON.parse(localStorage.getItem("iam_pro_data")) || defaultData;

function saveData() {
    localStorage.setItem("iam_pro_data", JSON.stringify(appData));
}

function logAudit(action, details) {
    appData.audit.unshift({
        time: new Date().toLocaleString("ru"),
        action,
        details
    });
    if (appData.audit.length > 50) appData.audit.pop();
    saveData();
    renderAudit();
}

function getRoleName(id) {
    const r = appData.roles.find(item => item.id === id);
    return r ? r.name : id;
}

function getGroupName(id) {
    const g = appData.groups.find(item => item.id === id);
    return g ? g.name : id;
}

function renderSelects() {
    const roleSelect = document.getElementById("userRoles");
    roleSelect.innerHTML = '<option value="" disabled selected>Выберите роль</option>';
    appData.roles.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.name;
        roleSelect.appendChild(opt);
    });

    const groupSelect = document.getElementById("userGroup");
    groupSelect.innerHTML = '<option value="" disabled selected>Выберите группу</option>';
    appData.groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = g.name;
        groupSelect.appendChild(opt);
    });
}

function renderUsers() {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.textContent = "";

    if (appData.users.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.setAttribute("colspan", "7");
        td.style.textAlign = "center";
        td.style.color = "var(--text-muted)";
        td.textContent = "Нет пользователей в системе";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    appData.users.forEach(u => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = u.id;
        tr.appendChild(tdId);

        const tdName1 = document.createElement("td");
        tdName1.textContent = u.name1;
        tr.appendChild(tdName1);

        const tdName2 = document.createElement("td");
        tdName2.textContent = u.name2;
        tr.appendChild(tdName2);

        const tdEmail = document.createElement("td");
        tdEmail.textContent = u.email;
        tr.appendChild(tdEmail);

        const tdRole = document.createElement("td");
        tdRole.textContent = getRoleName(u.role);
        tr.appendChild(tdRole);

        const tdGroup = document.createElement("td");
        tdGroup.textContent = getGroupName(u.group);
        tr.appendChild(tdGroup);

        const tdActions = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "Удалить";
        delBtn.addEventListener("click", () => deleteUser(u.id));
        tdActions.appendChild(delBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function renderRoles() {
    const container = document.getElementById("rolesList");
    container.textContent = "";
    appData.roles.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";

        const h3 = document.createElement("h3");
        h3.textContent = `${r.name} (${r.id})`;
        card.appendChild(h3);

        const p = document.createElement("p");
        p.textContent = `Права: ${r.permissions.join(", ")}`;
        card.appendChild(p);

        container.appendChild(card);
    });
}

function renderGroups() {
    const container = document.getElementById("groupList");
    container.textContent = "";
    appData.groups.forEach(g => {
        const card = document.createElement("div");
        card.className = "card";

        const h3 = document.createElement("h3");
        h3.textContent = g.name;
        card.appendChild(h3);

        const small = document.createElement("small");
        small.textContent = `ID: ${g.id}`;
        card.appendChild(small);

        container.appendChild(card);
    });
}

function renderAudit() {
    const tbody = document.querySelector("#auditTable tbody");
    tbody.textContent = "";

    if (appData.audit.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.setAttribute("colspan", "3");
        td.style.textAlign = "center";
        td.style.color = "var(--text-muted)";
        td.textContent = "Журнал аудита пуст";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    appData.audit.forEach(a => {
        const tr = document.createElement("tr");

        const tdTime = document.createElement("td");
        tdTime.textContent = a.time;
        tr.appendChild(tdTime);

        const tdAction = document.createElement("td");
        tdAction.textContent = a.action;
        tr.appendChild(tdAction);

        const tdDetails = document.createElement("td");
        tdDetails.textContent = a.details;
        tr.appendChild(tdDetails);

        tbody.appendChild(tr);
    });
}

function initApp() {
    renderSelects();
    renderUsers();
    renderRoles();
    renderGroups();
    renderAudit();
}

document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name1 = document.getElementById("userName1").value.trim();
    const name2 = document.getElementById("userName2").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const role = document.getElementById("userRoles").value;
    const group = document.getElementById("userGroup").value;

    if (!name1 || !name2 || !email || !role || !group) return;

    const newId = appData.users.length ? Math.max(...appData.users.map(u => u.id)) + 1 : 1;
    const newDate = new Date().toISOString().split('T')[0];

    appData.users.push({
        id: newId,
        name1,
        name2,
        email,
        role,
        group,
        status: "active",
        date: newDate
    });

    saveData();
    logAudit("Добавление пользователя", `${name1} ${name2} (${email})`);
    renderUsers();
    e.target.reset();
});

function deleteUser(id) {
    const user = appData.users.find(u => u.id === id);
    if (!user) return;

    if (confirm(`Удалить пользователя ${user.name1} ${user.name2}?`)) {
        appData.users = appData.users.filter(u => u.id !== id);
        saveData();
        logAudit("Удаление пользователя", `${user.name1} ${user.name2} (${user.email})`);
        renderUsers();
    }
}

document.getElementById("clearAudit").addEventListener("click", () => {
    if (confirm("Очистить журнал аудита?")) {
        appData.audit = [];
        saveData();
        renderAudit();
    }
});

const themeSelect = document.getElementById("themeSelect");
themeSelect.value = localStorage.getItem("iam_theme") || "light";
themeSelect.addEventListener("change", (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("iam_theme", theme);
});

const accentInput = document.getElementById("accentColorInput");
const savedAccent = localStorage.getItem("iam_accent");
if (savedAccent) accentInput.value = savedAccent;

accentInput.addEventListener("input", (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty("--accent-color", color);
    localStorage.setItem("iam_accent", color);
});

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        document.getElementById(btn.dataset.tab).classList.add("active");

        document.getElementById("sidebar").classList.remove("open");
        document.getElementById("overlay").classList.remove("open");
    });
});

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("open");
});

mobileCloseBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
});

initApp();