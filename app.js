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

const reservationForm = document.getElementById("reservationForm");
const roomForm = document.getElementById("roomForm");
const roomSelect = document.getElementById("room");
const dateInput = document.getElementById("date");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
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
const exportDataButton = document.getElementById("exportDataButton");
const importDataInput = document.getElementById("importDataInput");
const importBrowserDataButton = document.getElementById("importBrowserDataButton");
const tabButtons = [...document.querySelectorAll("[data-tab-target]")];
const tabPanels = [...document.querySelectorAll("[data-tab-panel]")];

let rooms = defaultRooms.map((room) => ({ ...room }));
let bookings = seedBookings();
let persistenceMode = "browser";

initializeReservationDefaults();
renderAll();
initializeApp();

reservationForm.addEventListener("submit", handleReservationSubmit);
roomForm.addEventListener("submit", handleRoomSubmit);
featureFilterInput.addEventListener("change", renderAll);
attendeesInput.addEventListener("input", renderAll);
dateInput.addEventListener("change", renderAll);
startTimeInput.addEventListener("change", renderAll);
endTimeInput.addEventListener("change", renderAll);
exportDataButton.addEventListener("click", handleExportData);
importDataInput.addEventListener("change", handleImportFile);
importBrowserDataButton.addEventListener("click", handleImportBrowserData);
tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget));
});

async function initializeApp() {
  const serverState = await loadServerState();
  if (serverState) {
    rooms = sanitizeRooms(serverState.rooms);
    bookings = sanitizeBookings(serverState.bookings);
    persistenceMode = "server";

    const hasDiskData = rooms.length > 0 || bookings.length > 0;
    if (!hasDiskData) {
      const migrated = loadLocalBrowserState();
      rooms = migrated.rooms;
      bookings = migrated.bookings;
      await persistState();
    }
  } else {
    const localState = loadLocalBrowserState();
    rooms = localState.rooms;
    bookings = localState.bookings;
    persistenceMode = "browser";
  }

  renderAll();
  showRoomMessage(getPersistenceMessage(), true);
}

function initializeReservationDefaults() {
  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const nextHourValue = Math.min(today.getHours() + 1, 18);
  const endHourValue = Math.min(nextHourValue + 1, 19);

  dateInput.value = currentDate;
  dateInput.min = currentDate;
  startTimeInput.value = `${String(nextHourValue).padStart(2, "0")}:00`;
  endTimeInput.value = `${String(endHourValue).padStart(2, "0")}:00`;
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

  try {
    const savedRooms = JSON.parse(window.localStorage.getItem(roomStorageKey) || "null");
    const savedBookings = JSON.parse(window.localStorage.getItem(bookingStorageKey) || "null");
    return {
      rooms: sanitizeRooms(savedRooms && savedRooms.length ? savedRooms : fallbackRooms),
      bookings: sanitizeBookings(savedBookings && savedBookings.length ? savedBookings : fallbackBookings),
    };
  } catch {
    return {
      rooms: fallbackRooms,
      bookings: fallbackBookings,
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
      body: JSON.stringify({ rooms, bookings }),
    });
    if (!response.ok) {
      throw new Error("State persistence unavailable");
    }
    window.localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
    window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    persistenceMode = "server";
    return true;
  } catch {
    window.localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
    window.localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
    persistenceMode = "browser";
    return false;
  }
}

function handleExportData() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    rooms,
    bookings,
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
    const hasData = (Array.isArray(savedRooms) && savedRooms.length > 0) || (Array.isArray(savedBookings) && savedBookings.length > 0);

    if (!hasData) {
      showRecoveryMessage("No browser-stored room or reservation data was found in this app origin.");
      return;
    }

    await applyImportedState({
      rooms: savedRooms,
      bookings: savedBookings,
    });
    showRecoveryMessage("Imported browser-stored rooms and reservations into disk-backed storage.", true);
  } catch {
    showRecoveryMessage("Browser-stored data could not be read.");
  }
}

async function applyImportedState(payload) {
  rooms = sanitizeRooms(payload.rooms);
  bookings = sanitizeBookings(payload.bookings);
  await persistState();
  renderAll();
}

async function handleReservationSubmit(event) {
  event.preventDefault();
  const data = new FormData(reservationForm);
  const reservation = Object.fromEntries(data.entries());
  reservation.roomId = reservation.room;
  delete reservation.room;
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
  if (reservation.requesterEmail) {
    const emailResult = await sendConfirmationEmail(reservation);
    showMessage(`${emailResult.message} Saved for ${formatLongDate(reservation.date)} from ${formatTime(reservation.startTime)} to ${formatTime(reservation.endTime)}.`, true);
  } else {
    const room = getRoom(reservation.roomId);
    const roomName = room ? room.name : "Unknown room";
    showMessage(`Reserved ${roomName} for ${reservation.purpose} on ${formatLongDate(reservation.date)} from ${formatTime(reservation.startTime)} to ${formatTime(reservation.endTime)}.`, true);
  }
  reservationForm.reset();
  initializeReservationDefaults();
  renderAll();
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
  updateNextReservation();
  updateRoomOptions();
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

  rooms.forEach((room, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".room-card");
    const status = fragment.querySelector(".room-status");
    const editButton = fragment.querySelector(".room-edit-button");
    const editForm = fragment.querySelector(".room-edit-form");
    const editMessage = fragment.querySelector(".room-edit-message");
    const available = !roomHasConflict(room.id);
    const filteredOut = !roomMatchesFilters(room);

    fragment.querySelector(".room-floor").textContent = room.floor;
    fragment.querySelector(".room-name").textContent = room.name;
    fragment.querySelector(".room-capacity").textContent = `${room.capacity} seats`;
    card.style.animationDelay = `${index * 60}ms`;

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

  const upcoming = sortBookings(bookings).filter(isUpcomingReservation);
  bookingList.classList.toggle("empty", upcoming.length === 0);

  upcoming.forEach((booking) => {
    const fragment = template.content.cloneNode(true);
    const room = getRoom(booking.roomId);
    const roomName = room ? room.name : "Unknown room";

    fragment.querySelector(".booking-time").textContent = `${formatDate(booking.date)} - ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}`;
    fragment.querySelector(".booking-title").textContent = booking.purpose;
    fragment.querySelector(".booking-meta").textContent = `${booking.organizer} reserved ${roomName} for ${booking.attendees} attendees${booking.requesterEmail ? ` - ${booking.requesterEmail}` : ""}${booking.notes ? ` - ${booking.notes}` : ""}`;

    const cancelButton = fragment.querySelector(".booking-cancel-button");
    cancelButton.addEventListener("click", async () => {
      await cancelBooking(booking.id);
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
    const disabled = !roomMatchesFilters(room) ? "disabled" : "";
    return `<option value="${room.id}" ${disabled}>${room.name}</option>`;
  }).join("");

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

function showMessage(message, success = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", success);
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
}
