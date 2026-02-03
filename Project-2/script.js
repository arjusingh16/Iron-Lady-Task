let learners = JSON.parse(localStorage.getItem("learners")) || [];

render();
updateDashboard();

function addLearner() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const program = programInput.value.trim();
  const status = statusInput.value;

  if (!name || !email || !program) {
    showToast("⚠️ Please fill all fields");
    return;
  }

  learners.push({ name, email, program, status });
  save();
  clearForm();
  showToast("✅ Learner added");
}

function render(list = learners) {
  learnerTable.innerHTML = "";

  if (list.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  list.forEach((l, i) => {
    learnerTable.innerHTML += `
      <tr>
        <td>${l.name}</td>
        <td>${l.email}</td>
        <td>${l.program}</td>
        <td><span class="status ${l.status}">${l.status}</span></td>
        <td>
          <button onclick="editLearner(${i})">✏️</button>
          <button onclick="deleteLearner(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editLearner(i) {
  const l = learners[i];
  const name = prompt("Name", l.name);
  const email = prompt("Email", l.email);
  const program = prompt("Program", l.program);
  const status = prompt("Status (Enrolled/Ongoing/Completed)", l.status);

  if (name && email && program && status) {
    learners[i] = { name, email, program, status };
    save();
    showToast("✏️ Updated successfully");
  }
}

function deleteLearner(i) {
  if (confirm("Delete this learner?")) {
    learners.splice(i, 1);
    save();
    showToast("🗑️ Deleted");
  }
}

function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const status = filterStatus.value;

  const filtered = learners.filter(l =>
    (search === "" ||
      l.name.toLowerCase().includes(search) ||
      l.program.toLowerCase().includes(search)) &&
    (status === "" || l.status === status)
  );

  render(filtered);
}

function clearFilters() {
  searchInput.value = "";
  filterStatus.value = "";
  render();
}

function resetAll() {
  if (confirm("Clear all learner data?")) {
    learners = [];
    save();
  }
}

function save() {
  localStorage.setItem("learners", JSON.stringify(learners));
  applyFilters();
  updateDashboard();
}

function clearForm() {
  nameInput.value = "";
  emailInput.value = "";
  programInput.value = "";
  statusInput.value = "Enrolled";
}

function updateDashboard() {
  totalCount.innerText = learners.length;
  enrolledCount.innerText = learners.filter(l => l.status === "Enrolled").length;
  ongoingCount.innerText = learners.filter(l => l.status === "Ongoing").length;
  completedCount.innerText = learners.filter(l => l.status === "Completed").length;
}

function showToast(msg) {
  toast.innerText = msg;
  toast.style.visibility = "visible";
  setTimeout(() => toast.style.visibility = "hidden", 2500);
}
