
function q(name) {
  return new URLSearchParams(location.search).get(name);
}

function renderCourseList() {
  const container = document.getElementById('courses');
  container.innerHTML = '';
  COURSES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="course-title">${c.title}</div>
      <div class="small">${c.short} · ${c.duration} · ${c.price}</div>
      <a class="button" href="course.html?id=${c.id}">View details</a>
    `;
    container.appendChild(card);
  });
}

function renderCourseDetail() {
  const id = Number(q('id'));
  const course = COURSES.find(c => c.id === id);
  if (!course) return document.getElementById('course').innerHTML = '<div class="card">Course not found</div>';
  const instr = INSTRUCTORS.find(i => i.id === course.instructorId);
  document.getElementById('course').innerHTML = `
    <div class="card">
      <div class="course-title">${course.title}</div>
      <div class="small">${course.duration} · ${course.price}</div>
      <p style="margin-top:10px;">${course.description}</p>
      <p class="small">Instructor: <a href="instructor.html?id=${instr.id}">${instr.name}</a></p>
      <a class="button" href="enroll.html?courseId=${course.id}">Enroll</a>
    </div>
  `;
}

function renderInstructorsList() {
  const container = document.getElementById('instructors');
  container.innerHTML = '';
  INSTRUCTORS.forEach(i => {
    const card = document.createElement('div');
    card.className = 'card';
    const coursesFor = COURSES.filter(c => c.instructorId === i.id).map(c => `<a href="course.html?id=${c.id}">${c.title}</a>`).join(', ');
    card.innerHTML = `
      <div class="course-title">${i.name}</div>
      <div class="small">${i.bio}</div>
      <div class="small" style="margin-top:8px">Courses: ${coursesFor}</div>
      <a class="button" href="instructor.html?id=${i.id}">Profile</a>
    `;
    container.appendChild(card);
  });
}

function renderInstructorDetail() {
  const id = Number(q('id'));
  const instructor = INSTRUCTORS.find(i => i.id === id);
  if (!instructor) return document.getElementById('instructor').innerHTML = '<div class="card">Instructor not found</div>';
  const coursesFor = COURSES.filter(c => c.instructorId === instructor.id);
  document.getElementById('instructor').innerHTML = `
    <div class="card">
      <div class="course-title">${instructor.name}</div>
      <div class="small">${instructor.bio}</div>
      <div style="margin-top:12px">
        <strong>Courses by ${instructor.name}</strong>
        <ul>
          ${coursesFor.map(c => `<li><a href="course.html?id=${c.id}">${c.title}</a></li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function setupEnrollForm() {
  const select = document.getElementById('courseSelect');
  COURSES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = `${c.title} (${c.duration})`;
    select.appendChild(opt);
  });
  

  const pre = q('courseId');
  if (pre) select.value = pre;
  document.getElementById('enrollForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const courseId = Number(document.getElementById('courseSelect').value);
    if (!name || !email) return alert('Please enter name and email');
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
    enrollments.push({ name, email, courseId, time: new Date().toISOString() });
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    document.getElementById('enrollSuccess').innerText = 'Enrollment saved locally — thank you!';
    this.reset();
  });
}
