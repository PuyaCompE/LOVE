// Constants
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'PuyaCompE';
const REPO_NAME = 'LOVE';
const EVENTS_FILE_PATH = 'events.json';

let events = {}; // Initialize events as an empty object
let currentDate = new Date(); // Track the current date
let selectedDate = null; // Track the currently selected date

// Fetch events from GitHub
async function fetchEvents() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}?t=${Date.now()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      console.log('File does not exist. Creating a new one.');
      events = {}; // Initialize as empty
    } else {
      const data = await response.json();
      events = JSON.parse(atob(data.content)); // Decode Base64 content

      // Ensure all dates map to arrays
      for (const date in events) {
        if (!Array.isArray(events[date])) {
          events[date] = [events[date]]; // Convert single entry to array
        }
      }
    }
  } catch (error) {
    console.error('Error fetching events from GitHub:', error);
    // Fallback to localStorage if GitHub fetch fails
    events = JSON.parse(localStorage.getItem('events')) || {};
  }

  renderCalendar(); // Render the calendar after fetching events
}

// Save events to GitHub
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

    let sha = null;

    if (response.status === 200) {
      // File exists, use its SHA
      const data = await response.json();
      sha = data.sha;
    } else if (response.status === 404) {
      // File does not exist, no SHA needed
      console.log('File does not exist. Creating a new one.');
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    // Prepare the new content
    const content = btoa(JSON.stringify(events)); // Encode to Base64
    const commitMessage = 'Update events';

    // Update or create the file
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
        sha: sha // Include SHA only if the file exists
      })
    });

    console.log('Events saved successfully.');
  } catch (error) {
    console.error('Error saving events to GitHub:', error);
  }
}

// Calendar functionality
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = document.querySelector(".calendar-days");
const currentMonthElement = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventInfo = document.getElementById("event-info");

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  currentMonthElement.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)} ${year}`;
  calendarDays.innerHTML = "";

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Add empty days for the first week
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    const emptyDay = document.createElement("div");
    calendarDays.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (events[dateKey]) {
      dayElement.classList.add("event-day");
      dayElement.title = events[dateKey].join("\n"); // Display all events in the tooltip
    }

    // Highlight the current date in PST
    const pstDate = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const pstYear = new Date(pstDate).getFullYear();
    const pstMonth = new Date(pstDate).getMonth() + 1; // Months are zero-indexed
    const pstDay = new Date(pstDate).getDate();

    if (year === pstYear && month + 1 === pstMonth && day === pstDay) {
      dayElement.classList.add("current-date");
    }

    // Highlight the selected date
    if (selectedDate === dateKey) {
      dayElement.classList.add("selected-date");
    }

    dayElement.addEventListener("click", () => {
      selectedDate = dateKey; // Set the selected date
      eventInfo.textContent = events[dateKey] ? events[dateKey].join(", ") : "No events on this day.";
      renderCalendar(); // Re-render the calendar to update the selected date highlight
    });

    calendarDays.appendChild(dayElement);
  }

  // Automatically select and display events for the current date if no date is selected
  if (!selectedDate) {
    const currentDateKey = `${pstYear}-${String(pstMonth).padStart(2, '0')}-${String(pstDay).padStart(2, '0')}`;
    selectedDate = currentDateKey;
    eventInfo.textContent = events[currentDateKey] ? events[currentDateKey].join(", ") : "No events on this day.";
  }
}

// Month navigation
prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  renderCalendar(); // Re-render the calendar
});

nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
  renderCalendar(); // Re-render the calendar
});

// Event Creation Form
function addEvent(eventType) {
  return async () => {
    const eventName = document.getElementById("event-name").value.trim();
    if (!eventName || !selectedDate) {
      alert('Please enter an event name and select a date.');
      return;
    }

    // Ensure the date has an array
    if (!events[selectedDate]) {
      events[selectedDate] = [];
    }

    // Add the new event
    events[selectedDate].push(`${eventType}: ${eventName}`);
    await saveEvents(); // Save to GitHub
    localStorage.setItem('events', JSON.stringify(events)); // Save to localStorage
    renderCalendar();
    document.getElementById("event-form").reset();
  };
}

document.getElementById("add-food")?.addEventListener("click", addEvent("Food"));
document.getElementById("add-place")?.addEventListener("click", addEvent("Place"));

// Fetch events when the page loads
fetchEvents();
