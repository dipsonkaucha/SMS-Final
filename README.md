For login.html, concepts used:
1. HTML from input
2. Client side authentication
3. Redirect logic (uses window.location.href to navigate to index.html if login is successful)
4. Tailwind CSS
5. Google Fonts

For students.html, concepts used:
1. Student data storage (names are stored in localStorage under the key "students" as an array)
2. DOM manipulation (updates the HTML by modifying innerHTML and creating/removing elements)
3. Input handling (validates empty input and avoids duplicate names)
4. Sorting (students are sorted alphabetically using .sort())
5. Navigation (going back to the main page)

For index.html, concepts used:
1. Login check (prevents access if isLoggedIn is not found in localStorage)
2. Date handling (gets current date using new Date() and saves attendance under the date key)
3. Monthly report generation (displays a calendar view of attendance for each student for the current or selected month)
4. PDF export

For script.js, concepts used:
1. DOM manipulation (access elements using : document.getElementById("studentList"))
2. Local storage (used to store and retrive : students list, attendance record, login state)
3. Form handling (collects form data using : new FormData(e.target))
4. Sorting (alphabetically sorts students using : students.sort((a, b) => a.localeCompare(b)))
5. Attendance storage saved as: {
  "current date": {
    "Student name": "Present or Absent"
  }
}
6. Monthly calender table and month selector for attendance data
7. Export to PDF{
          Captures the report table using html2canvas
          Converts it to an image
          Uses jsPDF to create and download the PDF
          Adds a title like Attendance Report for Current Date
   }
