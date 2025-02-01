const GITHUB_TOKEN = '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';
const REPO_OWNER = 'PuyaCompE';
const REPO_NAME = 'LOVE';
const EVENTS_FILE_PATH = 'events.json';

let events = {}; // Initialize events as an empty object

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
    } else {
      events = {}; // Initialize as empty if no content exists
    }
  } catch (error) {
    console.error('Error fetching events from GitHub:', error);
    // Fallback to localStorage if GitHub fetch fails
    events = JSON.parse(localStorage.getItem('events')) || {};
  }

  renderCalendar(); // Render the calendar after fetching events
}

async function saveEvents() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}`;
  
  try {
    // Fetch the current file to get its SHA
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    const sha = data.sha; // Get the current SHA of the file

    // Prepare the new content
    const content = btoa(JSON.stringify(events)); // Encode to base64
    const commitMessage = 'Update events';

    // Update the file with the new content
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
        sha: sha // Include the SHA to overwrite the existing file
      })
    });

    console.log('Events saved successfully.');
  } catch (error) {
    console.error('Error saving events to GitHub:', error);
  }
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

let selectedDate = null; // Track the currently selected date

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
    }

    // Highlight the selected date
    if (selectedDate === dateKey) {
      dayElement.classList.add("selected-date");
    }

    dayElement.addEventListener("click", () => {
      selectedDate = dateKey; // Set the selected date
      eventInfo.textContent = events[dateKey] || "No events on this day.";
      renderCalendar(); // Re-render the calendar to update the selected date highlight
    });

    calendarDays.appendChild(dayElement);
  }

  // Automatically select and display events for the current date if no date is selected
  if (!selectedDate) {
    const currentDateKey = `${pstYear}-${String(pstMonth).padStart(2, '0')}-${String(pstDay).padStart(2, '0')}`;
    selectedDate = currentDateKey;
    eventInfo.textContent = events[currentDateKey] || "No events on this day.";
  }
}
prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  renderCalendar(); // Re-render the calendar
});

nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
  renderCalendar(); // Re-render the calendar
});
// Event Creation Form
document.getElementById("add-food")?.addEventListener("click", async () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName || !selectedDate) return;

  events[selectedDate] = `Food: ${eventName}`;
  await saveEvents(); // Save to GitHub
  localStorage.setItem('events', JSON.stringify(events)); // Save to localStorage

  renderCalendar();
  document.getElementById("event-form").reset();
});

document.getElementById("add-place")?.addEventListener("click", async () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName || !selectedDate) return;

  events[selectedDate] = `Place: ${eventName}`;
  await saveEvents(); // Save to GitHub
  localStorage.setItem('events', JSON.stringify(events)); // Save to localStorage

  renderCalendar();
  document.getElementById("event-form").reset();
});
