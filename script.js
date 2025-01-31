// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_ynF77nvO3o7Cm58zY_ECs_urM0d_U3E",
  authDomain: "bearlovemouse-72e6b.firebaseapp.com",
  projectId: "bearlovemouse-72e6b",
  storageBucket: "bearlovemouse-72e6b.firebasestorage.app",
  messagingSenderId: "653453221345",
  appId: "1:653453221345:web:9850b61e50f4586b9c86a0",
  measurementId: "G-1E1JQQL8DX"
};

// Initialize Firebase App
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentDate = new Date();
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = document.querySelector(".calendar-days");
const currentMonthElement = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventInfo = document.getElementById("event-info");

// Load Events from Firestore
async function loadEvents() {
  const eventsSnapshot = await db.collection("events").get();
  const events = {};
  eventsSnapshot.forEach((doc) => {
    events[doc.id] = doc.data().description;
  });
  return events;
}

// Render Calendar
async function renderCalendar() {
  const events = await loadEvents(); // Fetch events from Firestore
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
      dayElement.title = events[dateKey];
    }

    dayElement.addEventListener("click", () => {
      eventInfo.textContent = events[dateKey] || "No events on this day.";
    });

    calendarDays.appendChild(dayElement);
  }
}

// Event Creation Form
document.getElementById("event-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const eventName = document.getElementById("event-name").value.trim();
  const eventType = document.getElementById("event-type").value;

  if (!eventName) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  // Save event to Firestore
  await db.collection("events").doc(dateKey).set({
    description: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)}: ${eventName}`
  });

  renderCalendar();
  document.getElementById("event-form").reset();
});

// Month Navigation
prevMonthButton?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Initial Render
if (calendarDays) renderCalendar();
