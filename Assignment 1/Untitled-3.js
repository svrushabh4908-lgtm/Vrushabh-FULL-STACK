// Get HTML elements
const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const result = document.getElementById("result");
const studentList = document.getElementById("studentList");
const clearBtn = document.getElementById("clearBtn");


// Load students from Local Storage
let students = JSON.parse(localStorage.getItem("students")) || [];


// Display existing students when page loads
displayStudents();


// Form submission
form.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get input values
    const name = document.getElementById("name").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const email = document.getElementById("email").value.trim();

    const htmlMarks = Number(document.getElementById("html").value);
    const cssMarks = Number(document.getElementById("css").value);
    const jsMarks = Number(document.getElementById("javascript").value);


    // Validation
    if (name === "" || rollNo === "" || email === "") {
        showMessage("Please fill all student details.", "red");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.", "red");
        return;
    }

    if (
        htmlMarks < 0 || htmlMarks > 100 ||
        cssMarks < 0 || cssMarks > 100 ||
        jsMarks < 0 || jsMarks > 100
    ) {
        showMessage("Marks must be between 0 and 100.", "red");
        return;
    }


    // Calculate total
    const total = htmlMarks + cssMarks + jsMarks;

    // Calculate percentage
    const percentage = total / 3;


    // Determine Pass / Fail
    // Minimum 40 marks required in each subject
    let status;

    if (
        htmlMarks >= 40 &&
        cssMarks >= 40 &&
        jsMarks >= 40
    ) {
        status = "Pass";
    } else {
        status = "Fail";
    }


    // Create student object
    const student = {
        name: name,
        rollNo: rollNo,
        email: email,
        marks: {
            html: htmlMarks,
            css: cssMarks,
            javascript: jsMarks
        },
        total: total,
        percentage: percentage.toFixed(2),
        status: status
    };


    // Convert object to JSON
    const studentJSON = JSON.stringify(student);

    console.log("Student JSON:");
    console.log(studentJSON);


    // Add student to array
    students.push(student);


    // Store data in Local Storage
    localStorage.setItem("students", JSON.stringify(students));


    // Display result
    displayResult(student);


    // Display all students
    displayStudents();


    // Success message
    showMessage("Student registered successfully!", "green");


    // Clear form
    form.reset();

});


// Email validation function
function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


// Display message
function showMessage(text, color) {

    message.textContent = text;
    message.style.color = color;
}


// Display result
function displayResult(student) {

    result.style.display = "block";

    result.innerHTML = `
        <h2>Student Result</h2>

        <p><strong>Name:</strong> ${student.name}</p>

        <p><strong>Roll Number:</strong> ${student.rollNo}</p>

        <p><strong>Email:</strong> ${student.email}</p>

        <hr>

        <p><strong>HTML:</strong> ${student.marks.html}</p>

        <p><strong>CSS:</strong> ${student.marks.css}</p>

        <p><strong>JavaScript:</strong> ${student.marks.javascript}</p>

        <p><strong>Total Marks:</strong> ${student.total} / 300</p>

        <p><strong>Percentage:</strong> ${student.percentage}%</p>

        <p>
            <strong>Status:</strong>
            <span class="${student.status === "Pass" ? "pass" : "fail"}">
                ${student.status}
            </span>
        </p>
    `;
}


// Display all registered students
function displayStudents() {

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML = "<p>No students registered yet.</p>";

        return;
    }


    students.forEach(function(student, index) {

        const card = document.createElement("div");

        card.className = "student-card";

        card.innerHTML = `
            <h3>${student.name}</h3>

            <p><strong>Roll No:</strong> ${student.rollNo}</p>

            <p><strong>Total:</strong> ${student.total} / 300</p>

            <p><strong>Percentage:</strong> ${student.percentage}%</p>

            <p>
                <strong>Status:</strong>
                <span class="${student.status === "Pass" ? "pass" : "fail"}">
                    ${student.status}
                </span>
            </p>

            <button onclick="deleteStudent(${index})">
                Delete
            </button>
        `;

        studentList.appendChild(card);
    });
}


// Delete student
function deleteStudent(index) {

    students.splice(index, 1);

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();

    result.style.display = "none";

    showMessage("Student deleted successfully.", "green");
}


// Clear form
clearBtn.addEventListener("click", function() {

    form.reset();

    message.textContent = "";

    result.style.display = "none";
});