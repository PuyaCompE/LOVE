// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCzHrkRrUbLEnjy-mHa1fOW6HXq8b5AUU",
  authDomain: "test-mode-5c0be.firebaseapp.com",
  databaseURL: "https://test-mode-5c0be-default-rtdb.firebaseio.com",
  projectId: "test-mode-5c0be",
  storageBucket: "test-mode-5c0be.firebasestorage.app",
  messagingSenderId: "294518491210",
  appId: "1:294518491210:web:b48ec4c8230fef33bafeb3",
  measurementId: "G-EJLNLYEXPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let events = {}; // Temporary local storage for events
let currentDate = new Date(); // Track the current date
let selectedDate = null; // Track the currently selected date

// Fetch events from Firebase Realtime Database
async function fetchEvents() {
  try {
    const eventsRef = ref(db, "events");
    onValue(eventsRef, (snapshot) => {
      events = snapshot.val() || {};
      console.log('Fetched events:', events);
      renderCalendar();
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

// Save events to Firebase Realtime Database
async function saveEvent(dateKey, eventType, eventName) {
  try {
    const eventDescription = events[dateKey] ? [...events[dateKey], `${eventType}: ${eventName}`] : [`${eventType}: ${eventName}`];
    await set(ref(db, `events/${dateKey}`), eventDescription);
    console.log('Event saved successfully.');
  } catch (error) {
    console.error('Error saving event:', error);
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
    if (selectedDate === dateKey) {
      dayElement.classList.add("selected-date");
    }
    dayElement.addEventListener("click", () => {
      selectedDate = dateKey;
      eventInfo.textContent = events[dateKey] ? events[dateKey].join(", ") : "No events on this day.";
      renderCalendar();
    });
    calendarDays.appendChild(dayElement);
  }
}

// Month navigation
prevMonthButton.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

// Event Creation Form
document.getElementById("add-food").addEventListener("click", () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName) {
    alert('Please enter an event name.');
    return;
  }
  const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.split('-')[2]).padStart(2, '0')}`;
  saveEvent(dateKey, "Food", eventName);
  document.getElementById("event-name").value = "";
  fetchEvents();
});

document.getElementById("add-place").addEventListener("click", () => {
  const eventName = document.getElementById("event-name").value.trim();
  if (!eventName) {
    alert('Please enter an event name.');
    return;
  }
  const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.split('-')[2]).padStart(2, '0')}`;
  saveEvent(dateKey, "Place", eventName);
  document.getElementById("event-name").value = "";
  fetchEvents();
});

// Fetch events when the page loads
fetchEvents();
