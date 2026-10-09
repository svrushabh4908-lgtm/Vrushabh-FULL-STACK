const form = document.getElementById('studentForm');
const message = document.getElementById('message');
const result = document.getElementById('result');
const studentList = document.getElementById('studentList');
const clearBtn = document.getElementById('clearBtn');

const STORAGE_KEY = 'student-registration-data';

let students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map((student) => ({
    name: student.name,
    rollNo: student.rollNo,
    email: student.email,
    fullStack: Number(student.fullStack ?? student.html),
    dsa: Number(student.dsa ?? student.css),
    python: Number(student.python ?? student.javascript)
}));

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('message-error', isError);
    message.classList.toggle('message-success', !isError);
}

function calculateGrade(average) {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
}

function renderResult() {
    if (!students.length) {
        result.innerHTML = `
            <article class="stat-card">
                <span class="stat-label">Students registered</span>
                <strong class="stat-value">0</strong>
                <span class="stat-note">No records yet</span>
            </article>
            <article class="stat-card">
                <span class="stat-label">Class average</span>
                <strong class="stat-value">N/A</strong>
                <span class="stat-note">Appears after registration</span>
            </article>
            <article class="stat-card">
                <span class="stat-label">Top performer</span>
                <strong class="stat-value">N/A</strong>
                <span class="stat-note">Appears after registration</span>
            </article>
        `;
        studentList.innerHTML = '<p class="empty-state">No students registered yet. Add the first student using the form above.</p>';
        return;
    }

    const totalMarks = students.reduce((sum, student) => {
        return sum + student.fullStack + student.dsa + student.python;
    }, 0);

    const average = totalMarks / (students.length * 3);
    const topStudent = students.reduce((best, current) => {
        const currentTotal = current.fullStack + current.dsa + current.python;
        const bestTotal = best.fullStack + best.dsa + best.python;
        return currentTotal > bestTotal ? current : best;
    }, students[0]);
    const topAverage = (topStudent.fullStack + topStudent.dsa + topStudent.python) / 3;

    result.innerHTML = `
        <article class="stat-card">
            <span class="stat-label">Students registered</span>
            <strong class="stat-value">${students.length}</strong>
            <span class="stat-note">In this assignment</span>
        </article>
        <article class="stat-card">
            <span class="stat-label">Class average</span>
            <strong class="stat-value">${average.toFixed(1)}<small>%</small></strong>
            <span class="stat-note">Across all subjects</span>
        </article>
        <article class="stat-card">
            <span class="stat-label">Top performer</span>
            <strong class="stat-value stat-name">${escapeHTML(topStudent.name)}</strong>
            <span class="stat-note">Grade ${calculateGrade(topAverage)} | ${topAverage.toFixed(1)}% average</span>
        </article>
    `;

    studentList.innerHTML = `
        <div class="table-scroll">
            <table class="student-table">
                <thead>
                    <tr>
                        <th scope="col">Student</th>
                        <th scope="col">Roll number</th>
                        <th scope="col">Email</th>
                        <th scope="col">Full Stack</th>
                        <th scope="col">DSA</th>
                        <th scope="col">Python</th>
                        <th scope="col">Average</th>
                        <th scope="col">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map((student) => {
                        const total = student.fullStack + student.dsa + student.python;
                        const averageMark = total / 3;
                        return `
                            <tr>
                                <td><span class="student-name">${escapeHTML(student.name)}</span></td>
                                <td>${escapeHTML(student.rollNo)}</td>
                                <td>${escapeHTML(student.email)}</td>
                                <td>${student.fullStack}</td>
                                <td>${student.dsa}</td>
                                <td>${student.python}</td>
                                <td>${averageMark.toFixed(1)}%</td>
                                <td><span class="grade grade-${calculateGrade(averageMark).replace('+', 'plus').toLowerCase()}">${calculateGrade(averageMark)}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function validateForm() {
    const fields = [
        { input: form.elements.name, label: 'Student name' },
        { input: form.elements.rollNo, label: 'Roll number' },
        { input: form.elements.email, label: 'Email address' },
        { input: form.elements.fullStack, label: 'Full Stack mark' },
        { input: form.elements.dsa, label: 'DSA mark' },
        { input: form.elements.python, label: 'Python mark' }
    ];

    fields.forEach(({ input }) => input.setAttribute('aria-invalid', 'false'));

    for (const { input, label } of fields) {
        const value = input.value.trim();
        const isMark = input.type === 'number';
        const mark = input.valueAsNumber;
        let error = '';

        if (!value) {
            error = `${label} is required.`;
        } else if (input.type === 'email' && !input.validity.valid) {
            error = 'Enter a valid email address.';
        } else if (isMark && (!Number.isInteger(mark) || mark < 0 || mark > 100)) {
            error = `${label} must be a whole number from 0 to 100.`;
        }

        input.setAttribute('aria-invalid', String(Boolean(error)));
        if (error) {
            showMessage(error, true);
            input.focus();
            return false;
        }
    }

    return true;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const student = {
        name: form.elements.name.value.trim(),
        rollNo: form.elements.rollNo.value.trim(),
        email: form.elements.email.value.trim(),
        fullStack: Number(form.elements.fullStack.value),
        dsa: Number(form.elements.dsa.value),
        python: Number(form.elements.python.value)
    };

    students.push(student);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    form.reset();
    showMessage(`${student.name} registered successfully.`);
    renderResult();
});

clearBtn.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((input) => input.removeAttribute('aria-invalid'));
    message.textContent = '';
    message.classList.remove('message-error', 'message-success');
});

renderResult();
