const GITHUB_TOKEN = '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';
const REPO_OWNER = 'PuyaCompE';
const REPO_NAME = 'LOVE';
const EVENTS_FILE_PATH = 'events.json';

let events = {}; // Initialize events as an empty object

// Function to fetch events from GitHub
async function fetchEvents() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    if (data.content) {
      events = JSON.parse(atob(data.content)); // Decode base64 content
    }
  } catch (error) {
    console.error('Error fetching events from GitHub:', error);
    // Fallback to localStorage if GitHub fetch fails
    events = JSON.parse(localStorage.getItem('events')) || {};
  }
  renderCalendar(); // Render the calendar after fetching events
}

// Function to save events to GitHub
async function saveEvents() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const data = await response.json();
  const sha = data.sha;

  const content = btoa(JSON.stringify(events)); // Encode to base64
  const commitMessage = 'Update events';

  await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: content,
      sha: sha
    })
  });
}

// Fetch events when the page loads
fetchEvents();

// Existing checkbox logic
function check() {
  if (
    document.forms[0].elements[0].checked == true &&
    document.forms[0].elements[1].checked == true &&
    document.forms[0].elements[2].checked == true
  ) {
    if (!$('.wrapper').hasClass('throb')) {
      $('.wrapper').addClass('throb');
    }
  } else {
    if ($('.wrapper').hasClass('throb')) {
      $('.wrapper').removeClass('throb');
    }
  }
}

// Calendar functionality
let currentDate = new Date();
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = document.querySelector(".calendar-days");
const currentMonthElement = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventInfo = document.getElementById("event-info");

// Function to render the calendar and auto-select the current date
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  currentMonthElement.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)} ${year}`;
  calendarDays.innerHTML = "";
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get the current date in PST
  const pstDate = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const pstYear = new Date(pstDate).getFullYear();
  const pstMonth = new Date(pstDate).getMonth() + 1; // Months are zero-indexed
  const pstDay = new Date(pstDate).getDate();

  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    const emptyDay = document.createElement("div");
    calendarDays.appendChild(emptyDay);
  }

  let currentDateElement = null; // To store the current date element

  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (events[dateKey]) {
      dayElement.classList.add("event-day");
      dayElement.title = events[dateKey];
    }

    // Highlight the current date in PST
    if (
      year === pstYear &&
      month + 1 === pstMonth && // Months are zero-indexed
      day === pstDay
    ) {
      dayElement.classList.add("current-date");
      currentDateElement = dayElement; // Store the current date element
    }

    dayElement.addEventListener("click", () => {
      eventInfo.textContent = events[dateKey] || "No events on this day.";
    });

    calendarDays.appendChild(dayElement);
  }

  // Automatically select and display events for the current date
  if (currentDateElement) {
    currentDateElement.click(); // Simulate a click on the current date
  }
}

prevMonthButton?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

if (calendarDays) fetchEvents().then(renderCalendar);

// Event Creation Form
document.getElementById("add-food")?.addEventListener("click", async () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  events[dateKey] = `Food: ${eventName}`;
  await saveEvents();

  renderCalendar();
  document.getElementById("event-form").reset();
});

document.getElementById("add-place")?.addEventListener("click", async () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  events[dateKey] = `Place: ${eventName}`;
  await saveEvents();

  renderCalendar();
  document.getElementById("event-form").reset();
});
