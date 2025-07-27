// Utility function to get sorted students
function getSortedStudents() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  return students.sort((a, b) => a.localeCompare(b));
}

// DOM elements
const studentContainer = document.getElementById("studentList");
const attendanceForm = document.getElementById("attendanceForm");
const monthlyReportContainer = document.getElementById("monthlyReport");
const reportContent = document.getElementById("reportContent");

// Month dropdown
const monthSelector = document.createElement("select");
monthSelector.className = "mb-4 p-2 rounded-lg border border-indigo-300 shadow-sm";
for (let i = 0; i < 12; i++) {
  const date = new Date(0, i);
  const option = document.createElement("option");
  option.value = i;
  option.textContent = date.toLocaleString("default", { month: "long" });
  monthSelector.appendChild(option);
}
monthSelector.value = new Date().getMonth();
monthSelector.addEventListener("change", () => showMonthlyReport(parseInt(monthSelector.value)));
monthlyReportContainer.insertBefore(monthSelector, reportContent);

// Render attendance inputs
function renderAttendanceInputs() {
  const students = getSortedStudents();
  studentContainer.innerHTML = "";
  if (students.length === 0) {
    studentContainer.innerHTML = `<p class='text-center text-gray-500'>No students found. Please add students first.</p>`;
    return;
  }
  students.forEach((student, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg shadow-sm";
    wrapper.innerHTML = `
      <span>${index + 1} - ${student}</span>
      <label class="flex items-center gap-2">
        <input type="radio" name="${student}" value="Present" required>
        <span>Present</span>
        <input type="radio" name="${student}" value="Absent">
        <span>Absent</span>
      </label>
    `;
    studentContainer.appendChild(wrapper);
  });
}

attendanceForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const todayKey = new Date().toISOString().split("T")[0];
  const attendanceData = JSON.parse(localStorage.getItem("attendance") || "{}");
  const dailyRecord = {};
  for (let [student, value] of formData.entries()) {
    dailyRecord[student] = value;
  }
  attendanceData[todayKey] = dailyRecord;
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  alert("Attendance submitted successfully!");
  e.target.reset();
  showMonthlyReport(parseInt(monthSelector.value));
  setTimeout(() => monthlyReportContainer.scrollIntoView({ behavior: "smooth" }), 200);
});

function showMonthlyReport(monthIndex = new Date().getMonth()) {
  const attendanceData = JSON.parse(localStorage.getItem("attendance") || "{}");
  const students = getSortedStudents();
  const today = new Date();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthName = new Date(0, monthIndex).toLocaleString("default", { month: "long" });

  let table = `<h3 class='text-lg font-semibold mb-2 text-center'>Attendance Report for ${monthName} ${year}</h3>`;
  table += `<table class="min-w-full border text-center text-sm">
    <thead><tr><th class="border px-2 py-1">Roll No.</th><th class="border px-2 py-1">Name</th>`;
  for (let d = 1; d <= daysInMonth; d++) {
    table += `<th class="border px-2 py-1">${d}</th>`;
  }
  table += `</tr></thead><tbody>`;

  students.forEach((name, index) => {
    table += `<tr><td class="border px-2 py-1">${index + 1}</td><td class="border px-2 py-1">${name}</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const status = attendanceData[dateStr]?.[name];
      let cell = `<td class="border px-2 py-1 text-gray-500">-</td>`;
      if (status === "Present") cell = `<td class="border px-2 py-1 bg-green-100 text-green-700">P</td>`;
      else if (status === "Absent") cell = `<td class="border px-2 py-1 bg-red-100 text-red-700">A</td>`;
      table += cell;
    }
    table += `</tr>`;
  });

  table += `</tbody></table>`;
  reportContent.innerHTML = table;
  monthlyReportContainer.classList.remove("hidden");
}

renderAttendanceInputs();

// Export report to PDF
async function exportToPDF() {
  const reportElement = document.getElementById("reportContent");
  const { jsPDF } = window.jspdf;
  const monthIndex = parseInt(monthSelector.value);
  const monthName = new Date(0, monthIndex).toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();

  try {
    const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.setFontSize(16);
    pdf.text(`Attendance Report for ${monthName} ${year}`, pdfWidth / 2, 10, { align: "center" });
    pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
    pdf.save(`Attendance_Report_${monthName}_${year}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
    alert("Failed to export PDF. Try again.");
  }
}
