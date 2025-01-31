// Existing checkbox logic
function check() {
  if (
    document.forms[0].elements[0].checked == true &&
    document.forms[0].elements[1].checked == true &&
    document.forms[0].elements[2].checked == true
  ) {
    if (!$('.wrapper').hasClass('throb')) {
      // Do things on Nav Close
      $('.wrapper').addClass('throb');
    }
  } else {
    if ($('.wrapper').hasClass('throb')) {
      // Do things on Nav Close
      $('.wrapper').removeClass('throb');
    }
  }
}

// Calendar functionality
const events = {
  "2023-01-15": "Visited the Eiffel Tower",
  "2023-02-10": "Ate at the best sushi restaurant",
  "2023-03-22": "Attended a concert",
  // Add more events here
};

let currentDate = new Date();
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

  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    const emptyDay = document.createElement("div");
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (events[dateKey]) {
      dayElement.style.backgroundColor = "#ffcccc";
      dayElement.style.color = "#fff";
      dayElement.title = events[dateKey];
    }

    dayElement.addEventListener("click", () => {
      eventInfo.textContent = events[dateKey] || "No events on this day.";
    });

    calendarDays.appendChild(dayElement);
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

if (calendarDays) renderCalendar();
