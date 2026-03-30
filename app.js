const defaultRooms = [
  {
    id: "atlas",
    name: "Atlas",
    floor: "Floor 2",
    capacity: 12,
    features: ["Video Conferencing", "Whiteboard Wall", "Accessible"],
  },
  {
    id: "harbor",
    name: "Harbor",
    floor: "Floor 3",
    capacity: 6,
    features: ["Dual Displays", "Whiteboard Wall"],
  },
  {
    id: "solstice",
    name: "Solstice",
    floor: "Floor 4",
    capacity: 20,
    features: ["Video Conferencing", "Dual Displays", "Accessible"],
  },
  {
    id: "nook",
    name: "Focus Nook",
    floor: "Floor 1",
    capacity: 4,
    features: ["Accessible"],
  },
];

const bookingStorageKey = "office-room-reservations";
const roomStorageKey = "office-room-directory";
const uploadStorageKey = "office-kpop-uploads";

const reservationForm = document.getElementById("reservationForm");
const roomForm = document.getElementById("roomForm");
const roomSelect = document.getElementById("room");
const dateInput = document.getElementById("date");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const startHourSelect = document.getElementById("startHour");
const startMinuteSelect = document.getElementById("startMinute");
const startMeridiemSelect = document.getElementById("startMeridiem");
const endHourSelect = document.getElementById("endHour");
const endMinuteSelect = document.getElementById("endMinute");
const endMeridiemSelect = document.getElementById("endMeridiem");
const attendeesInput = document.getElementById("attendees");
const featureFilterInput = document.getElementById("featureFilter");
const formMessage = document.getElementById("formMessage");
const roomFormMessage = document.getElementById("roomFormMessage");
const recoveryMessage = document.getElementById("recoveryMessage");
const roomGrid = document.getElementById("roomGrid");
const bookingList = document.getElementById("bookingList");
const heroMetrics = document.getElementById("heroMetrics");
const nextReservationTitle = document.getElementById("nextReservationTitle");
const nextReservationDetails = document.getElementById("nextReservationDetails");
const liveDateTime = document.getElementById("liveDateTime");
const liveWeatherDetails = document.getElementById("liveWeatherDetails");
const exportDataButton = document.getElementById("exportDataButton");
const importDataInput = document.getElementById("importDataInput");
const importBrowserDataButton = document.getElementById("importBrowserDataButton");
const bookingDateFilterInput = document.getElementById("bookingDateFilter");
const bookingRoomFilterInput = document.getElementById("bookingRoomFilter");
const exportBookingsButton = document.getElementById("exportBookingsButton");
const kpopUploadInput = document.getElementById("kpopUploadInput");
const kpopList = document.getElementById("kpopList");
const kpopMessage = document.getElementById("kpopMessage");
const next24Button = document.getElementById("next24Button");
const showAllButton = document.getElementById("showAllButton");
const historyButton = document.getElementById("historyButton");
const bookingPagination = document.getElementById("bookingPagination");
const calendarPrevButton = document.getElementById("calendarPrevButton");
const calendarNextButton = document.getElementById("calendarNextButton");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const tabButtons = [...document.querySelectorAll("[data-tab-target]")];
const tabPanels = [...document.querySelectorAll("[data-tab-panel]")];
const floorTabButtons = [...document.querySelectorAll("[data-floor-target]")];
const themeButtons = [...document.querySelectorAll("[data-theme]")];
const settingsMessage = document.getElementById("settingsMessage");

const themeDefinitions = {
  earth: { bg: "#f5efe6", panel: "rgba(255, 251, 245, 0.85)", panelStrong: "#fffaf2", text: "#112019", muted: "#5d6f67", line: "rgba(17, 32, 25, 0.08)", accent: "#0b6e4f", accentStrong: "#064e38", warm: "#d97d54", danger: "#9f3a2f", shadow: "0 20px 45px rgba(27, 43, 36, 0.12)" },
  ocean: { bg: "#eaf4f7", panel: "rgba(248, 252, 255, 0.86)", panelStrong: "#f9fdff", text: "#102333", muted: "#5c7382", line: "rgba(16, 35, 51, 0.08)", accent: "#0f7aa8", accentStrong: "#085c80", warm: "#4ca7c7", danger: "#9b3d38", shadow: "0 20px 45px rgba(16, 35, 51, 0.12)" },
  sunset: { bg: "#fbefe8", panel: "rgba(255, 249, 245, 0.88)", panelStrong: "#fffaf7", text: "#2a1a1f", muted: "#775860", line: "rgba(42, 26, 31, 0.08)", accent: "#c85b3c", accentStrong: "#9f4026", warm: "#e48d45", danger: "#9d3146", shadow: "0 20px 45px rgba(42, 26, 31, 0.12)" },
  forest: { bg: "#edf4ee", panel: "rgba(248, 252, 248, 0.88)", panelStrong: "#fbfffb", text: "#13261a", muted: "#617263", line: "rgba(19, 38, 26, 0.08)", accent: "#1d6b45", accentStrong: "#145334", warm: "#7aa36b", danger: "#8d3f35", shadow: "0 20px 45px rgba(19, 38, 26, 0.12)" },
  midnight: { bg: "#e9edf6", panel: "rgba(244, 247, 255, 0.86)", panelStrong: "#f9fbff", text: "#182238", muted: "#62708b", line: "rgba(24, 34, 56, 0.08)", accent: "#314a88", accentStrong: "#243867", warm: "#5c75b5", danger: "#a3464e", shadow: "0 20px 45px rgba(24, 34, 56, 0.12)" },
  rose: { bg: "#fbf0f4", panel: "rgba(255, 249, 251, 0.88)", panelStrong: "#fffdfd", text: "#2c1821", muted: "#7d5d6a", line: "rgba(44, 24, 33, 0.08)", accent: "#c04d73", accentStrong: "#973857", warm: "#e395aa", danger: "#9c314d", shadow: "0 20px 45px rgba(44, 24, 33, 0.12)" },
  mint: { bg: "#ecf8f4", panel: "rgba(248, 255, 252, 0.88)", panelStrong: "#fbfffd", text: "#142822", muted: "#5f7b73", line: "rgba(20, 40, 34, 0.08)", accent: "#2b8f7a", accentStrong: "#1f6f5f", warm: "#68bfa7", danger: "#9d4444", shadow: "0 20px 45px rgba(20, 40, 34, 0.12)" },
  amber: { bg: "#fbf4e7", panel: "rgba(255, 251, 242, 0.9)", panelStrong: "#fffdf7", text: "#2d2212", muted: "#7f6840", line: "rgba(45, 34, 18, 0.08)", accent: "#b86a17", accentStrong: "#8f5010", warm: "#e2ab3f", danger: "#9a4232", shadow: "0 20px 45px rgba(45, 34, 18, 0.12)" },
  slate: { bg: "#eef2f5", panel: "rgba(250, 252, 255, 0.88)", panelStrong: "#ffffff", text: "#18212b", muted: "#687482", line: "rgba(24, 33, 43, 0.08)", accent: "#526377", accentStrong: "#3f4d5e", warm: "#8d9db0", danger: "#93454a", shadow: "0 20px 45px rgba(24, 33, 43, 0.12)" },
  berry: { bg: "#f8edf3", panel: "rgba(255, 249, 252, 0.88)", panelStrong: "#fffdfd", text: "#2a1624", muted: "#77566f", line: "rgba(42, 22, 36, 0.08)", accent: "#8a2958", accentStrong: "#681d42", warm: "#c75b8a", danger: "#9a2e43", shadow: "0 20px 45px rgba(42, 22, 36, 0.12)" },
  sand: { bg: "#f7f1e7", panel: "rgba(255, 252, 245, 0.88)", panelStrong: "#fffdf9", text: "#2c2418", muted: "#7f7059", line: "rgba(44, 36, 24, 0.08)", accent: "#9b7b52", accentStrong: "#775d3d", warm: "#d0b287", danger: "#9d4b39", shadow: "0 20px 45px rgba(44, 36, 24, 0.12)" },
  lagoon: { bg: "#ebf9fa", panel: "rgba(247, 255, 255, 0.88)", panelStrong: "#fbffff", text: "#102629", muted: "#5c7b80", line: "rgba(16, 38, 41, 0.08)", accent: "#127a8a", accentStrong: "#0d5c68", warm: "#59bccc", danger: "#984444", shadow: "0 20px 45px rgba(16, 38, 41, 0.12)" },
  orchard: { bg: "#f6f5e8", panel: "rgba(255, 255, 247, 0.88)", panelStrong: "#fffffb", text: "#232713", muted: "#707756", line: "rgba(35, 39, 19, 0.08)", accent: "#7b9d2d", accentStrong: "#607b21", warm: "#d39a38", danger: "#974537", shadow: "0 20px 45px rgba(35, 39, 19, 0.12)" },
  copper: { bg: "#f7eee9", panel: "rgba(255, 249, 246, 0.88)", panelStrong: "#fffdfb", text: "#2c1d19", muted: "#80645c", line: "rgba(44, 29, 25, 0.08)", accent: "#8f4e35", accentStrong: "#703b27", warm: "#c87e59", danger: "#96383b", shadow: "0 20px 45px rgba(44, 29, 25, 0.12)" },
  aurora: { bg: "#eef2fb", panel: "rgba(248, 250, 255, 0.88)", panelStrong: "#fcfdff", text: "#182035", muted: "#676f88", line: "rgba(24, 32, 53, 0.08)", accent: "#0c7b93", accentStrong: "#0a5e70", warm: "#8b63d9", danger: "#9a3d66", shadow: "0 20px 45px rgba(24, 32, 53, 0.12)" },
  coral: { bg: "#fff0ec", panel: "rgba(255, 250, 248, 0.9)", panelStrong: "#fffdfc", text: "#2e1a18", muted: "#835f59", line: "rgba(46, 26, 24, 0.08)", accent: "#d86457", accentStrong: "#af4b40", warm: "#eda184", danger: "#a33e49", shadow: "0 20px 45px rgba(46, 26, 24, 0.12)" },
  graphite: { bg: "#eef0f2", panel: "rgba(248, 250, 252, 0.88)", panelStrong: "#fcfdff", text: "#1d242c", muted: "#69727b", line: "rgba(29, 36, 44, 0.08)", accent: "#3e4b5b", accentStrong: "#2f3946", warm: "#7c8b99", danger: "#94454f", shadow: "0 20px 45px rgba(29, 36, 44, 0.12)" },
  meadow: { bg: "#f0f7ea", panel: "rgba(251, 255, 247, 0.88)", panelStrong: "#fdfff9", text: "#1c2615", muted: "#6a7658", line: "rgba(28, 38, 21, 0.08)", accent: "#4c9444", accentStrong: "#397133", warm: "#9ac45e", danger: "#97423b", shadow: "0 20px 45px rgba(28, 38, 21, 0.12)" },
  ruby: { bg: "#faedf1", panel: "rgba(255, 249, 251, 0.88)", panelStrong: "#fffdfd", text: "#2c141c", muted: "#7b5563", line: "rgba(44, 20, 28, 0.08)", accent: "#a11f43", accentStrong: "#7f1835", warm: "#d95c7b", danger: "#8d2439", shadow: "0 20px 45px rgba(44, 20, 28, 0.12)" },
  sky: { bg: "#edf6ff", panel: "rgba(248, 252, 255, 0.9)", panelStrong: "#fcfeff", text: "#162334", muted: "#62788f", line: "rgba(22, 35, 52, 0.08)", accent: "#4f8edb", accentStrong: "#3b71b0", warm: "#83b5ee", danger: "#9a4750", shadow: "0 20px 45px rgba(22, 35, 52, 0.12)" },
  olive: { bg: "#f3f4e8", panel: "rgba(254, 255, 248, 0.88)", panelStrong: "#fffffb", text: "#232615", muted: "#70755b", line: "rgba(35, 38, 21, 0.08)", accent: "#6c7633", accentStrong: "#545d27", warm: "#adb86a", danger: "#92463a", shadow: "0 20px 45px rgba(35, 38, 21, 0.12)" },
  plum: { bg: "#f6eef8", panel: "rgba(252, 249, 255, 0.88)", panelStrong: "#fffdfd", text: "#29192f", muted: "#755f7b", line: "rgba(41, 25, 47, 0.08)", accent: "#6f3b79", accentStrong: "#552c5d", warm: "#b07ec2", danger: "#953c56", shadow: "0 20px 45px rgba(41, 25, 47, 0.12)" },
};

let rooms = defaultRooms.map((room) => ({ ...room }));
let bookings = seedBookings();
let uploads = [];
let persistenceMode = "browser";
let activeFloor = "Floor 1";
let activeTheme = loadThemePreference();
let bookingViewMode = "next24";
let bookingCurrentPage = 1;
let calendarMonth = getMonthStart(new Date());
let expandedCalendarDays = new Set();
let activeCalendarBookingId = "";

applyTheme(activeTheme);
populateTimeSelectors();
initializeReservationDefaults();
renderAll();
initializeApp();
startLiveClock();
startWeatherRefresh();

reservationForm.addEventListener("submit", handleReservationSubmit);
roomForm.addEventListener("submit", handleRoomSubmit);
featureFilterInput.addEventListener("change", renderAll);
attendeesInput.addEventListener("input", renderAll);
dateInput.addEventListener("change", renderAll);
[startHourSelect, startMinuteSelect, startMeridiemSelect].forEach((element) => {
  element.addEventListener("change", handleStartTimeChange);
});
[endHourSelect, endMinuteSelect, endMeridiemSelect].forEach((element) => {
  element.addEventListener("change", handleEndTimeChange);
});
exportDataButton.addEventListener("click", handleExportData);
importDataInput.addEventListener("change", handleImportFile);
importBrowserDataButton.addEventListener("click", handleImportBrowserData);
bookingDateFilterInput.addEventListener("input", handleBookingFilterChange);
bookingRoomFilterInput.addEventListener("input", handleBookingFilterChange);
exportBookingsButton.addEventListener("click", handleExportBookingsToExcel);
kpopUploadInput.addEventListener("change", handleKpopUpload);
next24Button.addEventListener("click", () => setBookingViewMode("next24"));
showAllButton.addEventListener("click", () => setBookingViewMode("all"));
historyButton.addEventListener("click", () => setBookingViewMode("history"));
calendarPrevButton.addEventListener("click", () => changeCalendarMonth(-1));
calendarNextButton.addEventListener("click", () => changeCalendarMonth(1));
tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget));
});
floorTabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveFloor(button.dataset.floorTarget));
});
themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});
document.addEventListener("click", handleDocumentClick);

async function initializeApp() {
  const serverState = await loadServerState();
  if (serverState) {
    rooms = sanitizeRooms(serverState.rooms);
    bookings = sanitizeBookings(serverState.bookings);
    uploads = sanitizeUploads(serverState.uploads);
    persistenceMode = "server";

    const hasDiskData = rooms.length > 0 || bookings.length > 0 || uploads.length > 0;
    if (!hasDiskData) {
      const migrated = loadLocalBrowserState();
      rooms = migrated.rooms;
      bookings = migrated.bookings;
      uploads = migrated.uploads;
      await persistState();
    }
  } else {
    const localState = loadLocalBrowserState();
    rooms = localState.rooms;
    bookings = localState.bookings;
    uploads = localState.uploads;
    persistenceMode = "browser";
  }

  renderAll();
  populateBookingRoomFilter();
  showRecoveryMessage(getPersistenceMessage(), true);
}

function initializeReservationDefaults() {
  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const roundedMinutes = Math.ceil(today.getMinutes() / 5) * 5;
  today.setSeconds(0, 0);
  if (roundedMinutes === 60) {
    today.setHours(today.getHours() + 1, 0, 0, 0);
  } else {
    today.setMinutes(roundedMinutes, 0, 0);
  }

  const startDate = new Date(today);
  startDate.setHours(Math.min(startDate.getHours() + 1, 18), startDate.getMinutes(), 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(Math.min(startDate.getHours() + 1, 19), startDate.getMinutes(), 0, 0);

  dateInput.value = currentDate;
  dateInput.min = currentDate;
  setTimeSelectors(startHourSelect, startMinuteSelect, startMeridiemSelect, toTwelveHourParts(startDate));
  setTimeSelectors(endHourSelect, endMinuteSelect, endMeridiemSelect, toTwelveHourParts(endDate));
  syncReservationTimeInputs();
}

function populateTimeSelectors() {
  const hourOptions = Array.from({ length: 12 }, (_, index) => {
    const hour = String(index + 1);
    return `<option value="${hour}">${hour}</option>`;
  }).join("");
  const minuteOptions = ["00", "15", "30", "45"].map((minute) => {
    return `<option value="${minute}">${minute}</option>`;
  }).join("");

  [startHourSelect, endHourSelect].forEach((element) => {
    element.innerHTML = hourOptions;
  });
  [startMinuteSelect, endMinuteSelect].forEach((element) => {
    element.innerHTML = minuteOptions;
  });
}

function handleStartTimeChange() {
  syncReservationTimeInputs();
  renderAll();
}

function handleEndTimeChange() {
  syncReservationTimeInputs();
  renderAll();
}

function syncReservationTimeInputs() {
  startTimeInput.value = toTwentyFourHourValue(
    startHourSelect.value,
    startMinuteSelect.value,
    startMeridiemSelect.value,
  );
  endTimeInput.value = toTwentyFourHourValue(
    endHourSelect.value,
    endMinuteSelect.value,
    endMeridiemSelect.value,
  );
}

function setTimeSelectors(hourElement, minuteElement, meridiemElement, parts) {
  hourElement.value = parts.hour;
  minuteElement.value = parts.minute;
  meridiemElement.value = parts.meridiem;
}

function toTwelveHourParts(date) {
  const hours = date.getHours();
  const minuteBuckets = ["00", "15", "30", "45"];
  const minute = minuteBuckets[Math.floor(date.getMinutes() / 15) % 4];
  const meridiem = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;

  return {
    hour: String(normalizedHour),
    minute,
    meridiem,
  };
}

function toTwentyFourHourValue(hour, minute, meridiem) {
  let normalizedHour = Number(hour) % 12;
  if (meridiem === "PM") {
    normalizedHour += 12;
  }

  return `${String(normalizedHour).padStart(2, "0")}:${minute}`;
}

function seedBookings() {
  return [
    {
      id: crypto.randomUUID(),
      organizer: "Avery Chen",
      requesterEmail: "avery.chen@company.com",
      purpose: "Q2 planning sync",
      date: getRelativeDate(1),
      startTime: "10:00",
      endTime: "11:00",
      attendees: 10,
      featureFilter: "Video Conferencing",
      notes: "Leadership team check-in",
      roomId: "atlas",
    },
    {
      id: crypto.randomUUID(),
      organizer: "Maya Patel",
      requesterEmail: "maya.patel@company.com",
      purpose: "Candidate interview loop",
      date: getRelativeDate(0),
      startTime: "14:00",
      endTime: "15:30",
      attendees: 5,
      featureFilter: "Dual Displays",
      notes: "Need screen share",
      roomId: "harbor",
    },
  ];
}

function getRelativeDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
}

function loadLocalBrowserState() {
  const fallbackRooms = defaultRooms.map((room) => ({ ...room }));
  const fallbackBookings = seedBookings();
  const fallbackUploads = [];

  try {
    const savedRooms = JSON.parse(window.localStorage.getItem(roomStorageKey) || "null");
    const savedBookings = JSON.parse(window.localStorage.getItem(bookingStorageKey) || "null");
    const savedUploads = JSON.parse(window.localStorage.getItem(uploadStorageKey) || "null");
    return {
      rooms: sanitizeRooms(savedRooms && savedRooms.length ? savedRooms : fallbackRooms),
      bookings: sanitizeBookings(savedBookings && savedBookings.length ? savedBookings : fallbackBookings),
      uploads: sanitizeUploads(savedUploads && savedUploads.length ? savedUploads : fallbackUploads),
    };
  } catch {
    return {
      rooms: fallbackRooms,
      bookings: fallbackBookings,
      uploads: fallbackUploads,
    };
  }
}

async function loadServerState() {
  try {
    const response = await window.fetch("/api/state");
    if (!response.ok) {
      throw new Error("State endpoint unavailable");
    }

    const payload = await response.json();
    return {
      rooms: Array.isArray(payload.rooms) ? payload.rooms : [],
      bookings: Array.isArray(payload.bookings) ? payload.bookings : [],
      uploads: Array.isArray(payload.uploads) ? payload.uploads : [],
    };
  } catch {
    return null;
  }
}

async function persistState() {
  try {
    const response = await window.fetch("/api/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rooms, bookings, uploads }),
    });
    if (!response.ok) {
      throw new Error("State persistence unavailable");
    }
    window.localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
    window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    window.localStorage.setItem(uploadStorageKey, JSON.stringify(uploads));
    persistenceMode = "server";
    return true;
  } catch {
    window.localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
    window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    window.localStorage.setItem(uploadStorageKey, JSON.stringify(uploads));
    persistenceMode = "browser";
    return false;
  }
}

function handleExportData() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    rooms,
    bookings,
    uploads,
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `room-reservations-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  showRecoveryMessage("Exported current rooms and reservations to a JSON file.", true);
}

function handleExportBookingsToExcel() {
  const rows = getFilteredBookings({ paginate: false }).map((booking) => {
    const room = getRoom(booking.roomId);
    return {
      date: formatLongDate(booking.date),
      start: formatTime(booking.startTime),
      end: formatTime(booking.endTime),
      room: room ? room.name : "Unknown room",
      floor: room ? room.floor : "Unknown floor",
      organizer: booking.organizer,
      requesterEmail: booking.requesterEmail || "",
      purpose: booking.purpose,
      attendees: booking.attendees,
      notes: booking.notes || "",
    };
  });

  const header = ["Date", "Start", "End", "Room", "Floor", "Organizer", "Requester Email", "Purpose", "Attendees", "Notes"];
  const csvLines = [
    header.join(","),
    ...rows.map((row) => [
      row.date,
      row.start,
      row.end,
      row.room,
      row.floor,
      row.organizer,
      row.requesterEmail,
      row.purpose,
      row.attendees,
      row.notes,
    ].map(escapeCsvValue).join(",")),
  ];

  const csvContent = "\uFEFF" + csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  showMessage("Exported bookings as an Excel-friendly CSV file.", true);
}

function handleBookingFilterChange() {
  bookingCurrentPage = 1;
  renderBookings();
}

async function handleImportFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    await applyImportedState(payload);
    importDataInput.value = "";
    showRecoveryMessage("Imported data from JSON and saved it to disk.", true);
  } catch {
    showRecoveryMessage("Could not import that file. Please choose a valid JSON export.");
  }
}

async function handleImportBrowserData() {
  try {
    const savedRooms = JSON.parse(window.localStorage.getItem(roomStorageKey) || "null");
    const savedBookings = JSON.parse(window.localStorage.getItem(bookingStorageKey) || "null");
    const savedUploads = JSON.parse(window.localStorage.getItem(uploadStorageKey) || "null");
    const hasData = (Array.isArray(savedRooms) && savedRooms.length > 0) || (Array.isArray(savedBookings) && savedBookings.length > 0) || (Array.isArray(savedUploads) && savedUploads.length > 0);

    if (!hasData) {
      showRecoveryMessage("No browser-stored room or reservation data was found in this app origin.");
      return;
    }

    await applyImportedState({
      rooms: savedRooms,
      bookings: savedBookings,
      uploads: savedUploads,
    });
    showRecoveryMessage("Imported browser-stored rooms and reservations into disk-backed storage.", true);
  } catch {
    showRecoveryMessage("Browser-stored data could not be read.");
  }
}

async function applyImportedState(payload) {
  rooms = sanitizeRooms(payload.rooms);
  bookings = sanitizeBookings(payload.bookings);
  uploads = sanitizeUploads(payload.uploads);
  await persistState();
  renderAll();
}

async function handleReservationSubmit(event) {
  event.preventDefault();
  const data = new FormData(reservationForm);
  const fields = Object.fromEntries(data.entries());
  const reservation = {
    organizer: fields.bookingOrganizerField || "",
    requesterEmail: fields.bookingRequesterField || "",
    purpose: fields.bookingPurposeField || "",
    date: fields.bookingDateField || "",
    startTime: fields.bookingStartTimeField || "",
    endTime: fields.bookingEndTimeField || "",
    roomId: fields.bookingRoomField || "",
    attendees: Number(fields.bookingAttendeesField || 0),
    featureFilter: fields.bookingFeatureField || "",
    notes: fields.bookingNotesField || "",
  };
  reservation.attendees = Number(reservation.attendees);
  reservation.id = crypto.randomUUID();

  const validationError = validateReservation(reservation);
  if (validationError) {
    showMessage(validationError);
    return;
  }

  bookings.push(reservation);
  bookings = sortBookings(bookings);
  await persistState();
  const room = getRoom(reservation.roomId);
  const roomName = room ? room.name : "Unknown room";
  const baseSuccessMessage = `Reserved ${roomName} for ${reservation.purpose} on ${formatLongDate(reservation.date)} from ${formatTime(reservation.startTime)} to ${formatTime(reservation.endTime)}.`;

  showMessage(baseSuccessMessage, true);

  let successMessage = baseSuccessMessage;
  if (reservation.requesterEmail) {
    const emailResult = await sendConfirmationEmail(reservation);
    successMessage = `${emailResult.message} Saved for ${formatLongDate(reservation.date)} from ${formatTime(reservation.startTime)} to ${formatTime(reservation.endTime)}.`;
  }

  reservationForm.reset();
  initializeReservationDefaults();
  renderAll();
  window.requestAnimationFrame(() => {
    showMessage(successMessage, true);
  });
}

async function handleRoomSubmit(event) {
  event.preventDefault();
  const data = new FormData(roomForm);
  const submittedRoom = Object.fromEntries(data.entries());
  const room = {
    id: createRoomId(submittedRoom.roomName),
    name: submittedRoom.roomName.trim(),
    floor: submittedRoom.roomFloor.trim(),
    capacity: Number(submittedRoom.roomCapacity),
    features: parseFeatures(submittedRoom.roomFeatures),
  };

  const validationError = validateRoom(room);
  if (validationError) {
    showRoomMessage(validationError);
    return;
  }

  rooms.push(room);
  await persistState();
  roomForm.reset();
  document.getElementById("roomCapacity").value = "8";
  showRoomMessage(`${room.name} is now available for reservation.`, true);
  renderAll();
}

async function handleRoomEditSubmit(event, roomId, messageElement, formElement, toggleButton) {
  event.preventDefault();
  const data = new FormData(formElement);
  const submittedRoom = Object.fromEntries(data.entries());
  const updatedRoom = {
    id: roomId,
    name: submittedRoom.roomName.trim(),
    floor: submittedRoom.roomFloor.trim(),
    capacity: Number(submittedRoom.roomCapacity),
    features: parseFeatures(submittedRoom.roomFeatures),
  };

  const validationError = validateRoom(updatedRoom, roomId);
  if (validationError) {
    showInlineMessage(messageElement, validationError);
    return;
  }

  rooms = rooms.map((room) => (room.id === roomId ? updatedRoom : room));
  await persistState();
  showRoomMessage(`${updatedRoom.name} was updated.`, true);
  toggleRoomEditor(formElement, toggleButton, false);
  renderAll();
}

function validateReservation(reservation) {
  if (reservation.requesterEmail && !isValidEmail(reservation.requesterEmail)) {
    return "Please enter a valid requester email address.";
  }

  if (reservation.startTime >= reservation.endTime) {
    return "End time must be later than the start time.";
  }

  const room = getRoom(reservation.roomId);
  if (!room) {
    return "Please select a valid room.";
  }

  if (reservation.attendees > room.capacity) {
    return `${room.name} seats ${room.capacity}. Please choose a larger room.`;
  }

  if (reservation.featureFilter && !room.features.includes(reservation.featureFilter)) {
    return `${room.name} does not include ${reservation.featureFilter}.`;
  }

  const conflict = bookings.find((booking) => (
    booking.roomId === reservation.roomId &&
    booking.date === reservation.date &&
    reservation.startTime < booking.endTime &&
    reservation.endTime > booking.startTime
  ));

  if (conflict) {
    return `${room.name} is already booked from ${formatTime(conflict.startTime)} to ${formatTime(conflict.endTime)}.`;
  }

  return "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function validateRoom(room, ignoreRoomId = "") {
  if (!room.name) {
    return "Room name is required.";
  }

  if (!room.floor) {
    return "Floor is required.";
  }

  if (!Number.isInteger(room.capacity) || room.capacity < 1) {
    return "Capacity must be at least 1.";
  }

  const duplicateByName = rooms.find((existingRoom) => (
    existingRoom.id !== ignoreRoomId &&
    existingRoom.name.toLowerCase() === room.name.toLowerCase()
  ));
  if (duplicateByName) {
    return `${room.name} already exists. Choose a different room name.`;
  }

  return "";
}

function renderAll() {
  renderMetrics();
  renderRooms();
  renderBookings();
  renderCalendar();
  renderKpopUploads();
  updateNextReservation();
  updateRoomOptions();
  populateBookingRoomFilter();
}

function renderMetrics() {
  const today = getRelativeDate(0);
  const todaysBookings = bookings.filter((booking) => booking.date === today).length;
  const availableRooms = rooms.filter((room) => roomMatchesFilters(room) && !roomHasConflict(room.id)).length;

  heroMetrics.innerHTML = [
    { label: "Rooms", value: rooms.length },
    { label: "Today", value: todaysBookings },
    { label: "Available now", value: availableRooms },
  ].map((metric) => `
    <div class="metric">
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
    </div>
  `).join("");
}

function renderRooms() {
  const template = document.getElementById("roomCardTemplate");
  roomGrid.innerHTML = "";
  syncFloorTabs();

  const visibleRooms = rooms
    .filter((room) => room.floor === activeFloor)
    .sort(compareRoomNames);

  visibleRooms.forEach((room, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".room-card");
    const status = fragment.querySelector(".room-status");
    const editButton = fragment.querySelector(".room-edit-button");
    const reserveButton = fragment.querySelector(".room-reserve-button");
    const editForm = fragment.querySelector(".room-edit-form");
    const editMessage = fragment.querySelector(".room-edit-message");
    const available = !roomHasConflict(room.id);
    const filteredOut = !roomMatchesFilters(room);

    fragment.querySelector(".room-floor").textContent = room.floor;
    fragment.querySelector(".room-name").textContent = room.name;
    fragment.querySelector(".room-capacity").textContent = `${room.capacity} seats`;
    card.style.animationDelay = `${index * 60}ms`;
    reserveButton.classList.remove("hidden");
    reserveButton.addEventListener("click", () => quickReserveRoom(room.id));

    if (filteredOut) {
      status.textContent = "Not a fit";
      status.className = "room-status filtered";
    } else if (available) {
      status.textContent = "Available";
      status.className = "room-status available";
    } else {
      status.textContent = "Busy";
      status.className = "room-status busy";
    }

    const featureWrap = fragment.querySelector(".room-features");
    room.features.forEach((feature) => {
      const pill = document.createElement("span");
      pill.className = "feature-pill";
      pill.textContent = feature;
      featureWrap.appendChild(pill);
    });

    if (room.features.length === 0) {
      const pill = document.createElement("span");
      pill.className = "feature-pill";
      pill.textContent = "No special features";
      featureWrap.appendChild(pill);
    }

    editForm.elements.roomName.value = room.name;
    editForm.elements.roomFloor.value = room.floor;
    editForm.elements.roomCapacity.value = String(room.capacity);
    editForm.elements.roomFeatures.value = room.features.join(", ");

    editButton.addEventListener("click", () => {
      const shouldOpen = editForm.classList.contains("hidden");
      toggleRoomEditor(editForm, editButton, shouldOpen);
      if (shouldOpen) {
        showInlineMessage(editMessage, "");
      }
    });

    editForm.addEventListener("submit", async (event) => {
      await handleRoomEditSubmit(event, room.id, editMessage, editForm, editButton);
    });

    fragment.querySelector(".room-cancel-button").addEventListener("click", () => {
      editForm.reset();
      editForm.elements.roomName.value = room.name;
      editForm.elements.roomFloor.value = room.floor;
      editForm.elements.roomCapacity.value = String(room.capacity);
      editForm.elements.roomFeatures.value = room.features.join(", ");
      showInlineMessage(editMessage, "");
      toggleRoomEditor(editForm, editButton, false);
    });

    roomGrid.appendChild(fragment);
  });
}

function renderBookings() {
  const template = document.getElementById("bookingItemTemplate");
  bookingList.innerHTML = "";

  syncBookingViewButtons();

  const filteredBookings = getFilteredBookings({ paginate: false });
  const upcoming = getFilteredBookings({ paginate: true });
  bookingList.classList.toggle("empty", upcoming.length === 0);

  upcoming.forEach((booking) => {
    const fragment = template.content.cloneNode(true);
    const room = getRoom(booking.roomId);
    const roomName = room ? room.name : "Unknown room";
    const actions = fragment.querySelector(".booking-actions");

    fragment.querySelector(".booking-time").textContent = `${formatDate(booking.date)} - ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}`;
    fragment.querySelector(".booking-title").textContent = `${roomName} - ${booking.purpose}`;
    fragment.querySelector(".booking-meta").textContent = `${booking.organizer} reserved for ${booking.attendees} attendees${booking.requesterEmail ? ` - ${booking.requesterEmail}` : ""}${booking.notes ? ` - ${booking.notes}` : ""}`;

    if (bookingViewMode === "history") {
      actions.remove();
      bookingList.appendChild(fragment);
      return;
    }

    const cancelButton = fragment.querySelector(".booking-cancel-button");
    cancelButton.addEventListener("click", async () => {
      const confirmed = await confirmBookingCancellation();
      if (confirmed) {
        await cancelBooking(booking.id);
      }
    });

    const emailButton = fragment.querySelector(".booking-email-button");
    if (booking.requesterEmail) {
      emailButton.addEventListener("click", async () => {
        const emailResult = await sendConfirmationEmail(booking);
        showMessage(emailResult.message, true);
      });
    } else {
      emailButton.disabled = true;
      emailButton.textContent = "No email on file";
    }

    bookingList.appendChild(fragment);
  });

  renderBookingPagination(filteredBookings.length);
}

function renderCalendar() {
  if (!calendarGrid || !calendarMonthLabel) {
    return;
  }

  const monthStart = getMonthStart(calendarMonth);
  const firstVisibleDay = new Date(monthStart);
  firstVisibleDay.setDate(firstVisibleDay.getDate() - firstVisibleDay.getDay());

  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const lastVisibleDay = new Date(monthEnd);
  lastVisibleDay.setDate(lastVisibleDay.getDate() + (6 - lastVisibleDay.getDay()));

  calendarMonthLabel.textContent = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(monthStart);

  calendarGrid.innerHTML = "";

  for (let cursor = new Date(firstVisibleDay); cursor <= lastVisibleDay; cursor.setDate(cursor.getDate() + 1)) {
    calendarGrid.appendChild(buildCalendarDay(new Date(cursor), monthStart));
  }
}

function buildCalendarDay(day, monthStart) {
  const cell = document.createElement("article");
  cell.className = "calendar-day";

  const dateKey = toDateKey(day);
  const isCurrentMonth = day.getMonth() === monthStart.getMonth() && day.getFullYear() === monthStart.getFullYear();
  const isToday = dateKey === toDateKey(new Date());
  const dayBookings = bookings
    .filter((booking) => booking.date === dateKey)
    .sort(compareCalendarBookings);
  const activeBooking = dayBookings.find((booking) => booking.id === activeCalendarBookingId);
  const expanded = expandedCalendarDays.has(dateKey);
  const visibleBookings = expanded ? dayBookings : dayBookings.slice(0, 6);

  if (!isCurrentMonth) {
    cell.classList.add("is-other-month");
  }

  if (isToday) {
    cell.classList.add("is-today");
  }

  if (activeBooking) {
    cell.classList.add("has-active-popup");
  }

  const dayNumber = document.createElement("span");
  dayNumber.className = "calendar-day-number";
  dayNumber.textContent = String(day.getDate());
  cell.appendChild(dayNumber);

  const bookingContainer = document.createElement("div");
  bookingContainer.className = "calendar-day-bookings";

  if (dayBookings.length === 0) {
    const empty = document.createElement("span");
    empty.className = "calendar-empty";
    empty.textContent = "No bookings";
    bookingContainer.appendChild(empty);
  } else {
    visibleBookings.forEach((booking) => {
      const room = getRoom(booking.roomId);
      const bookingItem = document.createElement("button");
      const isActive = activeCalendarBookingId === booking.id;
      bookingItem.className = "calendar-booking-pill";
      bookingItem.type = "button";
      bookingItem.classList.toggle("is-active", isActive);
      bookingItem.innerHTML = `
        <strong>${escapeHtml(room ? room.name : "Unknown room")}</strong>
        <span>${escapeHtml(formatTime(booking.startTime))} - ${escapeHtml(booking.purpose)}</span>
      `;
      bookingItem.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleCalendarBookingDetails(booking.id);
      });
      bookingContainer.appendChild(bookingItem);
    });

    if (dayBookings.length > 6) {
      const moreButton = document.createElement("button");
      moreButton.type = "button";
      moreButton.className = "calendar-more-button";
      moreButton.textContent = expanded ? "Show less" : `${dayBookings.length - 6} more`;
      moreButton.addEventListener("click", () => toggleCalendarDay(dateKey));
      bookingContainer.appendChild(moreButton);
    }
  }

  cell.appendChild(bookingContainer);

  if (activeBooking) {
    const room = getRoom(activeBooking.roomId);
    const detail = buildCalendarBookingDetails(activeBooking, room);
    positionCalendarDetailInCell(detail, cell);
    cell.appendChild(detail);
  }

  return cell;
}

function buildCalendarBookingDetails(booking, room) {
  const detail = document.createElement("div");
  detail.className = "calendar-detail-popover";
  detail.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  detail.innerHTML = `
    <p class="card-label">${escapeHtml(formatLongDate(booking.date))}</p>
    <h4>${escapeHtml((room ? room.name : "Unknown room"))} - ${escapeHtml(booking.purpose)}</h4>
    <div class="calendar-detail-grid">
      <p><strong>Time</strong><br>${escapeHtml(formatTime(booking.startTime))} - ${escapeHtml(formatTime(booking.endTime))}</p>
      <p><strong>Floor</strong><br>${escapeHtml(room ? room.floor : "Unknown floor")}</p>
      <p><strong>By</strong><br>${escapeHtml(booking.organizer)}</p>
      <p><strong>Size</strong><br>${escapeHtml(String(booking.attendees))} attendees</p>
      <p class="calendar-detail-full"><strong>Email</strong><br>${escapeHtml(booking.requesterEmail || "None")}</p>
    </div>
    ${booking.notes ? `<div class="calendar-detail-notes"><strong>Notes</strong><br>${escapeHtml(booking.notes)}</div>` : ""}
  `;
  return detail;
}

function updateNextReservation() {
  const next = sortBookings(bookings).find(isUpcomingReservation);

  if (!next) {
    nextReservationTitle.textContent = "No upcoming reservations";
    nextReservationDetails.textContent = "Create a booking to populate your office schedule.";
    return;
  }

  const room = getRoom(next.roomId);
  const roomName = room ? room.name : "Unknown room";
  nextReservationTitle.textContent = `${next.purpose} in ${roomName}`;
  nextReservationDetails.textContent = `${formatDate(next.date)} from ${formatTime(next.startTime)} to ${formatTime(next.endTime)} with ${next.organizer}`;
}

function updateRoomOptions() {
  const currentValue = roomSelect.value;

  roomSelect.innerHTML = rooms.map((room) => {
    const available = roomMatchesFilters(room) && !roomHasConflict(room.id);
    const disabled = available ? "" : "disabled";
    return `<option value="${room.id}" ${disabled}>${room.name}</option>`;
  }).join("");

  [...roomSelect.options].forEach((option) => {
    if (option.disabled) {
      option.style.color = "rgba(17, 32, 25, 0.4)";
      option.style.fontWeight = "500";
    } else {
      option.style.color = "rgba(17, 32, 25, 0.95)";
      option.style.fontWeight = "700";
    }
  });

  const currentStillValid = [...roomSelect.options].some((option) => option.value === currentValue && !option.disabled);
  if (currentStillValid) {
    roomSelect.value = currentValue;
    return;
  }

  const firstEnabled = [...roomSelect.options].find((option) => !option.disabled);
  if (firstEnabled) {
    roomSelect.value = firstEnabled.value;
  }
}

function populateBookingRoomFilter() {
  const currentValue = bookingRoomFilterInput.value;
  const sortedRooms = [...rooms].sort(compareRoomNames);

  bookingRoomFilterInput.innerHTML = [
    '<option value="">All rooms</option>',
    ...sortedRooms.map((room) => `<option value="${room.id}">${room.name}</option>`),
  ].join("");

  const stillExists = [...bookingRoomFilterInput.options].some((option) => option.value === currentValue);
  bookingRoomFilterInput.value = stillExists ? currentValue : "";
}

function parseFeatures(rawValue) {
  return rawValue
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function createRoomId(name) {
  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    return `room-${crypto.randomUUID()}`;
  }

  const normalized = trimmedName.normalize("NFKC");
  const compact = normalized
    .split("")
    .map((character) => {
      if (/\s/.test(character)) {
        return "-";
      }

      const encoded = encodeURIComponent(character);
      return encoded.length > 1 ? encoded.replace(/%/g, "") : encoded;
    })
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (!compact) {
    return `room-${crypto.randomUUID()}`;
  }

  return `room-${compact}-${crypto.randomUUID().slice(0, 8)}`;
}

function roomMatchesFilters(room) {
  const attendees = Number(attendeesInput.value || 0);
  const requiredFeature = featureFilterInput.value;
  const capacityMatch = !attendees || room.capacity >= attendees;
  const featureMatch = !requiredFeature || room.features.includes(requiredFeature);
  return capacityMatch && featureMatch;
}

function roomHasConflict(roomId) {
  if (!dateInput.value || !startTimeInput.value || !endTimeInput.value) {
    return false;
  }

  return bookings.some((booking) => (
    booking.roomId === roomId &&
    booking.date === dateInput.value &&
    startTimeInput.value < booking.endTime &&
    endTimeInput.value > booking.startTime
  ));
}

async function cancelBooking(id) {
  bookings = bookings.filter((booking) => booking.id !== id);
  await persistState();
  renderAll();
  showMessage("Reservation cancelled.", true);
}

async function handleKpopUpload(event) {
  const selectedFiles = [...(event.target.files || [])];
  if (!selectedFiles.length) {
    return;
  }

  const uploadedItems = [];
  for (const file of selectedFiles) {
    const dataUrl = await readFileAsDataUrl(file);
    uploadedItems.push({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      dataUrl,
    });
  }

  uploads = sortUploads([...uploadedItems, ...uploads]);
  await persistState();
  renderKpopUploads();
  event.target.value = "";
  showKpopMessage(`Uploaded ${uploadedItems.length} file${uploadedItems.length === 1 ? "" : "s"}.`, true);
}

function renderKpopUploads() {
  if (!kpopList) {
    return;
  }

  kpopList.innerHTML = "";

  if (!uploads.length) {
    kpopList.innerHTML = '<div class="upload-empty">No shared files yet. Upload something to get started.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();

  uploads.forEach((upload) => {
    const card = document.createElement("article");
    card.className = "upload-card";

    if (upload.type.startsWith("image/")) {
      const previewImage = document.createElement("img");
      previewImage.className = "upload-preview";
      previewImage.src = upload.dataUrl;
      previewImage.alt = upload.name;
      card.appendChild(previewImage);
    } else {
      const fileIcon = document.createElement("div");
      fileIcon.className = "upload-file-icon";
      fileIcon.textContent = getFileExtensionLabel(upload.name);
      card.appendChild(fileIcon);
    }

    const body = document.createElement("div");
    body.className = "upload-body";

    const title = document.createElement("h3");
    title.textContent = upload.name;
    body.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "upload-meta";
    meta.textContent = `${formatFileSize(upload.size)} · ${formatUploadDate(upload.uploadedAt)}`;
    body.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "upload-actions";

    if (upload.type.startsWith("image/")) {
      const viewLink = document.createElement("a");
      viewLink.className = "ghost-button";
      viewLink.href = upload.dataUrl;
      viewLink.target = "_blank";
      viewLink.rel = "noreferrer";
      viewLink.textContent = "View";
      actions.appendChild(viewLink);
    }

    const downloadLink = document.createElement("a");
    downloadLink.className = "primary-button";
    downloadLink.href = upload.dataUrl;
    downloadLink.download = upload.name;
    downloadLink.textContent = "Download";
    actions.appendChild(downloadLink);

    body.appendChild(actions);
    card.appendChild(body);
    fragment.appendChild(card);
  });

  kpopList.appendChild(fragment);
}

function confirmBookingCancellation() {
  const template = document.getElementById("confirmDialogTemplate");
  const fragment = template.content.cloneNode(true);
  const overlay = fragment.querySelector(".confirm-overlay");
  const yesButton = fragment.querySelector(".confirm-yes-button");
  const noButton = fragment.querySelector(".confirm-no-button");

  return new Promise((resolve) => {
    const close = (result) => {
      overlay.remove();
      resolve(result);
    };

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close(false);
      }
    });

    yesButton.addEventListener("click", () => close(true));
    noButton.addEventListener("click", () => close(false));

    document.body.appendChild(overlay);
  });
}

function getRoom(roomId) {
  return rooms.find((room) => room.id === roomId);
}

function sortBookings(items) {
  return [...items].sort((a, b) => {
    const first = `${a.date}T${a.startTime}`;
    const second = `${b.date}T${b.startTime}`;
    return first.localeCompare(second);
  });
}

function isUpcomingReservation(booking) {
  const now = new Date();
  const end = new Date(`${booking.date}T${booking.endTime}`);
  return end >= now;
}

function getFilteredBookings(options = {}) {
  const { paginate = true } = options;
  const dateFilter = bookingDateFilterInput.value;
  const roomFilter = bookingRoomFilterInput.value;

  const filtered = sortBookings(bookings).filter((booking) => {
    if (dateFilter && booking.date !== dateFilter) {
      return false;
    }

    if (roomFilter && booking.roomId !== roomFilter) {
      return false;
    }

    if (bookingViewMode === "history") {
      return isPastReservation(booking);
    }

    if (bookingViewMode === "all") {
      return isUpcomingReservation(booking);
    }

    return isWithinNext24Hours(booking);
  });

  if (!paginate) {
    return filtered;
  }

  const startIndex = (bookingCurrentPage - 1) * 10;
  return filtered.slice(startIndex, startIndex + 10);
}

function isWithinNext24Hours(booking) {
  const now = new Date();
  const start = new Date(`${booking.date}T${booking.startTime}`);
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return start >= now && start <= twentyFourHoursFromNow;
}

function isPastReservation(booking) {
  const now = new Date();
  const end = new Date(`${booking.date}T${booking.endTime}`);
  return end < now;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatLongDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatTime(timeString) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2025-01-01T${timeString}`));
}

function buildConfirmationEmail(reservation) {
  const room = getRoom(reservation.roomId);
  const roomName = room ? room.name : "Unknown room";
  const roomFloor = room ? room.floor : "Unknown floor";
  const subject = `Room reservation confirmed: ${reservation.purpose}`;
  const lines = [
    `Hi ${reservation.organizer},`,
    "",
    "Your room reservation is confirmed.",
    "",
    `Room: ${roomName}`,
    `Floor: ${roomFloor}`,
    `Date: ${formatDate(reservation.date)}`,
    `Time: ${formatTime(reservation.startTime)} to ${formatTime(reservation.endTime)}`,
    `Attendees: ${reservation.attendees}`,
    `Purpose: ${reservation.purpose}`,
  ];

  if (reservation.notes) {
    lines.push(`Notes: ${reservation.notes}`);
  }

  lines.push("", "See you there.");

  return {
    to: reservation.requesterEmail,
    subject,
    body: lines.join("\n"),
  };
}

function openConfirmationEmail(reservation) {
  if (!reservation.requesterEmail) {
    return;
  }

  const email = buildConfirmationEmail(reservation);
  const mailtoUrl = `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
  window.location.href = mailtoUrl;
}

async function sendConfirmationEmail(reservation) {
  const room = getRoom(reservation.roomId);
  const roomName = room ? room.name : "Unknown room";

  try {
    const response = await window.fetch("/api/send-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...buildConfirmationEmail(reservation),
        roomName,
        floor: room ? room.floor : "",
        organizer: reservation.organizer,
        purpose: reservation.purpose,
      }),
    });

    if (!response.ok) {
      throw new Error("Email service unavailable");
    }

    return {
      sent: true,
      message: `Reserved ${roomName} for ${reservation.purpose}. Confirmation email sent to ${reservation.requesterEmail}.`,
    };
  } catch {
    openConfirmationEmail(reservation);
    return {
      sent: false,
      message: `Reserved ${roomName} for ${reservation.purpose}. Outlook service was unavailable, so a draft was opened for ${reservation.requesterEmail}.`,
    };
  }
}

function sanitizeRooms(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return defaultRooms.map((room) => ({ ...room }));
  }

  return items.map((room) => ({
    id: String(room.id || createRoomId(room.name || crypto.randomUUID())),
    name: String(room.name || "Untitled Room"),
    floor: String(room.floor || "Unknown floor"),
    capacity: Number(room.capacity || 1),
    features: Array.isArray(room.features) ? room.features.map((feature) => String(feature)) : [],
  }));
}

function sanitizeBookings(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return seedBookings();
  }

  return items.map((booking) => ({
    id: String(booking.id || crypto.randomUUID()),
    organizer: String(booking.organizer || "Unknown organizer"),
    requesterEmail: String(booking.requesterEmail || ""),
    purpose: String(booking.purpose || "Meeting"),
    date: String(booking.date || getRelativeDate(0)),
    startTime: String(booking.startTime || "09:00"),
    endTime: String(booking.endTime || "10:00"),
    attendees: Number(booking.attendees || 1),
    featureFilter: String(booking.featureFilter || ""),
    notes: String(booking.notes || ""),
    roomId: String(booking.roomId || ""),
  }));
}

function sanitizeUploads(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return sortUploads(items.map((upload) => ({
    id: String(upload.id || crypto.randomUUID()),
    name: String(upload.name || "Untitled file"),
    type: String(upload.type || "application/octet-stream"),
    size: Number(upload.size || 0),
    uploadedAt: String(upload.uploadedAt || new Date().toISOString()),
    dataUrl: String(upload.dataUrl || ""),
  })).filter((upload) => upload.dataUrl));
}

function showMessage(message, success = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", success);

  if (message) {
    formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function showRoomMessage(message, success = false) {
  roomFormMessage.textContent = message;
  roomFormMessage.classList.toggle("success", success);
}

function showInlineMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

function showRecoveryMessage(message, success = false) {
  recoveryMessage.textContent = message;
  recoveryMessage.classList.toggle("success", success);
}

function showKpopMessage(message, success = false) {
  kpopMessage.textContent = message;
  kpopMessage.classList.toggle("success", success);
}

function toggleRoomEditor(formElement, buttonElement, isOpen) {
  formElement.classList.toggle("hidden", !isOpen);
  buttonElement.textContent = isOpen ? "Editing..." : "Edit room";
  buttonElement.disabled = isOpen;
}

function getPersistenceMessage() {
  if (persistenceMode === "server") {
    return "Server-backed storage is active for this deployment.";
  }

  return "Browser storage is active. For shared online data, connect a server-backed store.";
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === tabName);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tabName);
  });

  if (tabName === "calendar") {
    renderCalendar();
  }
}

function quickReserveRoom(roomId) {
  setActiveTab("reserve");
  roomSelect.value = roomId;
  formMessage.textContent = "";
  formMessage.classList.remove("success");
  roomSelect.focus();
}

function setActiveFloor(floorName) {
  activeFloor = floorName;
  renderRooms();
}

function syncFloorTabs() {
  const availableFloors = [...new Set(rooms.map((room) => room.floor))];
  if (!availableFloors.includes(activeFloor)) {
    activeFloor = availableFloors[0] || "Floor 1";
  }

  floorTabButtons.forEach((button) => {
    const floorName = button.dataset.floorTarget;
    const available = availableFloors.includes(floorName);
    button.classList.toggle("active", floorName === activeFloor);
    button.disabled = !available;
    button.hidden = !available;
  });
}

function compareRoomNames(firstRoom, secondRoom) {
  return firstRoom.name.localeCompare(secondRoom.name, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function compareCalendarBookings(firstBooking, secondBooking) {
  const firstRoom = getRoom(firstBooking.roomId);
  const secondRoom = getRoom(secondBooking.roomId);
  const roomComparison = compareRoomNames(
    firstRoom || { name: "Unknown room" },
    secondRoom || { name: "Unknown room" },
  );

  if (roomComparison !== 0) {
    return roomComparison;
  }

  if (firstBooking.startTime !== secondBooking.startTime) {
    return firstBooking.startTime.localeCompare(secondBooking.startTime);
  }

  return firstBooking.purpose.localeCompare(secondBooking.purpose, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

function setBookingViewMode(mode) {
  bookingViewMode = mode;
  bookingCurrentPage = 1;
  renderBookings();
}

function changeCalendarMonth(offset) {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + offset, 1);
  expandedCalendarDays = new Set();
  renderCalendar();
}

function toggleCalendarDay(dateKey) {
  if (expandedCalendarDays.has(dateKey)) {
    expandedCalendarDays.delete(dateKey);
  } else {
    expandedCalendarDays.add(dateKey);
  }

  renderCalendar();
}

function toggleCalendarBookingDetails(bookingId) {
  activeCalendarBookingId = activeCalendarBookingId === bookingId ? "" : bookingId;
  renderCalendar();
}

function handleDocumentClick(event) {
  if (!activeCalendarBookingId) {
    return;
  }

  if (event.target.closest(".calendar-booking-pill") || event.target.closest(".calendar-detail-popover")) {
    return;
  }

  activeCalendarBookingId = "";
  renderCalendar();
}

function positionCalendarDetailInCell(detailElement, cellElement) {
  detailElement.style.top = "40px";

  const cellRect = cellElement.getBoundingClientRect();
  const estimatedWidth = Math.min(280, window.innerWidth - 32);
  if (cellRect.left + estimatedWidth > window.innerWidth - 16) {
    detailElement.style.right = "8px";
    detailElement.style.left = "auto";
  } else {
    detailElement.style.left = "8px";
    detailElement.style.right = "auto";
  }
}

function syncBookingViewButtons() {
  next24Button.classList.toggle("active", bookingViewMode === "next24");
  showAllButton.classList.toggle("active", bookingViewMode === "all");
  historyButton.classList.toggle("active", bookingViewMode === "history");
}

function renderBookingPagination(totalItems) {
  bookingPagination.innerHTML = "";

  if (bookingViewMode === "next24") {
    return;
  }

  const totalPages = Math.ceil(totalItems / 10);
  if (totalPages <= 1) {
    return;
  }

  if (bookingCurrentPage > totalPages) {
    bookingCurrentPage = totalPages;
  }

  bookingPagination.appendChild(createBookingPaginationButton("â†", bookingCurrentPage === 1, () => {
    bookingCurrentPage -= 1;
    renderBookings();
  }));

  for (let page = 1; page <= totalPages; page += 1) {
    const button = createBookingPaginationButton(String(page), false, () => {
      bookingCurrentPage = page;
      renderBookings();
    });
    button.classList.toggle("active", page === bookingCurrentPage);
    bookingPagination.appendChild(button);
  }

  bookingPagination.appendChild(createBookingPaginationButton("â†’", bookingCurrentPage === totalPages, () => {
    bookingCurrentPage += 1;
    renderBookings();
  }));
}

function createBookingPaginationButton(label, disabled, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "page-button";
  button.textContent = label;
  button.disabled = disabled;

  if (!disabled) {
    button.addEventListener("click", onClick);
  }

  return button;
}

function setTheme(themeName) {
  activeTheme = themeName;
  applyTheme(themeName);
  saveThemePreference(themeName);
  showSettingsMessage(`Theme changed to ${capitalize(themeName)}.`, true);
}

function applyTheme(themeName) {
  const theme = themeDefinitions[themeName] || themeDefinitions.earth;
  document.body.dataset.theme = themeName;
  document.documentElement.style.setProperty("--bg", theme.bg);
  document.documentElement.style.setProperty("--panel", theme.panel);
  document.documentElement.style.setProperty("--panel-strong", theme.panelStrong);
  document.documentElement.style.setProperty("--text", theme.text);
  document.documentElement.style.setProperty("--muted", theme.muted);
  document.documentElement.style.setProperty("--line", theme.line);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-strong", theme.accentStrong);
  document.documentElement.style.setProperty("--warm", theme.warm);
  document.documentElement.style.setProperty("--danger", theme.danger);
  document.documentElement.style.setProperty("--shadow", theme.shadow);
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === themeName);
  });
}

function loadThemePreference() {
  const savedTheme = window.localStorage.getItem("room-booking-theme") || "earth";
  return themeDefinitions[savedTheme] ? savedTheme : "earth";
}

function saveThemePreference(themeName) {
  window.localStorage.setItem("room-booking-theme", themeName);
}

function showSettingsMessage(message, success = false) {
  settingsMessage.textContent = message;
  settingsMessage.classList.toggle("success", success);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function sortUploads(items) {
  return [...items].sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt));
}

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
}

function formatUploadDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getFileExtensionLabel(fileName) {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase().slice(0, 4) : "FILE";
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function startLiveClock() {
  updateLiveDateTime();
  window.setInterval(updateLiveDateTime, 1000);
}

function startWeatherRefresh() {
  loadCentrevilleWeather();
  window.setInterval(loadCentrevilleWeather, 5 * 60 * 1000);
}

function updateLiveDateTime() {
  const now = new Date();
  liveDateTime.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/New_York",
  }).format(now);
}

async function loadCentrevilleWeather() {
  try {
    const response = await window.fetch("https://api.open-meteo.com/v1/forecast?latitude=38.840349&longitude=-77.428901&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York");
    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const payload = await response.json();
    const current = payload.current || {};
    const temperature = current.temperature_2m;
    const weatherCode = current.weather_code;
    liveWeatherDetails.textContent = `${getWeatherLabel(weatherCode)} - ${temperature}\u00B0F`;
  } catch {
    liveWeatherDetails.textContent = "Weather unavailable right now.";
  }
}

function getWeatherLabel(weatherCode) {
  const labels = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Heavy showers",
    82: "Violent showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm",
  };

  return labels[weatherCode] || "Current conditions";
}

