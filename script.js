// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_ynF77nvO3o7Cm58zY_ECs_urM0d_U3E",
  authDomain: "bearlovemouse-72e6b.firebaseapp.com",
  projectId: "bearlovemouse-72e6b",
  storageBucket: "bearlovemouse-72e6b.firebasestorage.app",
  messagingSenderId: "653453221345",
  appId: "1:653453221345:web:9850b61e50f4586b9c86a0",
  measurementId: "G-1E1JQQL8DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Calendar functionality
let currentDate = new Date();
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let events = {}; // Events object to store loaded events

const calendarDays = document.querySelector(".calendar-days");
const currentMonthElement = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventInfo = document.getElementById("event-info");

// Load events from Firestore
async function loadEventsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "events"));
  const loadedEvents = {};
  querySnapshot.forEach((doc) => {
    loadedEvents[doc.id] = `${doc.data().type}: ${doc.data().name}`;
  });
  return loadedEvents;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthElement.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)} ${year}`;
  calendarDays.innerHTML = "";

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get the current date in PST
  const pstDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const pstYear = pstDate.getFullYear();
  const pstMonth = pstDate.getMonth() + 1; // Months are zero-indexed
  const pstDay = pstDate.getDate();

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

    dayElement.addEventListener("click", () => {
      eventInfo.textContent = events[dateKey] || "No events on this day.";
    });

    calendarDays.appendChild(dayElement);
  }
}

// Navigate to the previous month
prevMonthButton?.addEventListener("click", () => {
  currentDate.setDate(1); // Reset to the first day of the current month
  currentDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  renderCalendar();
});

// Navigate to the next month
nextMonthButton?.addEventListener("click", () => {
  currentDate.setDate(1); // Reset to the first day of the current month
  currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
  renderCalendar();
});

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

  const eventData = {
    date: dateKey,
    name: eventName,
    type: eventType.charAt(0).toUpperCase() + eventType.slice(1)
  };

  // Save event to Firestore
  await setDoc(doc(db, "events", dateKey), eventData);

  // Update local events object
  events[dateKey] = `${eventType.charAt(0).toUpperCase() + eventType.slice(1)}: ${eventName}`;

  // Re-render the calendar
  renderCalendar();

  // Clear the form
  document.getElementById("event-form").reset();
});

// Load events from Firestore and render the calendar
(async () => {
  events = await loadEventsFromFirestore();
  renderCalendar();
})();
