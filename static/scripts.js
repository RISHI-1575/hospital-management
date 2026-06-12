// Base URL of the Flask app
const BASE_URL = "http://localhost:5000";

/** ====================================
 * ADMIN: Manage Beds
 ==================================== */
async function addBeds() {
    const hospitalName = document.getElementById('hospital_name').value;
    const numBeds = document.getElementById('num_beds').value;

    const response = await fetch(`${BASE_URL}/beds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_name: hospitalName, num_beds: numBeds }),
    });

    if (response.ok) {
        alert(`Successfully added ${numBeds} beds to ${hospitalName}`);
        document.getElementById('hospital_name').value = "";
        document.getElementById('num_beds').value = "";
    } else {
        alert("Failed to add beds. Please try again.");
    }
}

async function fetchBeds() {
    const hospitalName = document.getElementById('search_hospital').value;

    const response = await fetch(`${BASE_URL}/beds?hospital_name=${hospitalName}`);
    const beds = await response.json();

    const bedList = document.getElementById('bed_list');
    bedList.innerHTML = beds.length > 0 
        ? beds.map(bed => `<p>Bed ID: ${bed.id} - Status: ${bed.status}</p>`).join("")
        : "<p>No available beds found for this hospital.</p>";
}

/** ====================================
 * ADMIN: Manage Inventory
 ==================================== */
async function addInventoryItem() {
    const itemName = document.getElementById('item_name').value;
    const quantity = document.getElementById('quantity').value;
    const expiryDate = document.getElementById('expiry_date').value;

    const response = await fetch(`${BASE_URL}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_name: itemName, quantity, expiry_date: expiryDate }),
    });

    if (response.ok) {
        alert(`Item "${itemName}" added to inventory.`);
        document.getElementById('item_name').value = "";
        document.getElementById('quantity').value = "";
        document.getElementById('expiry_date').value = "";
        fetchInventory();
    } else {
        alert("Failed to add inventory item. Please try again.");
    }
}

async function fetchInventory() {
    const response = await fetch(`${BASE_URL}/inventory`);
    const data = await response.json();

    const inventoryList = document.getElementById('inventory_list');
    inventoryList.innerHTML = data.inventory.map(item => `
        <p>${item.item_name}: ${item.quantity} (Expiry: ${item.expiry_date})</p>
    `).join("");

    const alerts = document.getElementById('inventory_alerts');
    alerts.innerHTML = `
        <h4>Alerts:</h4>
        ${data.alerts.near_expiry.length ? '<p>Near Expiry Items:</p>' : ''}
        ${data.alerts.near_expiry.map(item => `<p>${item.item_name} (Expiry: ${item.expiry_date})</p>`).join("")}
        ${data.alerts.low_stock.length ? '<p>Low Stock Items:</p>' : ''}
        ${data.alerts.low_stock.map(item => `<p>${item.item_name}: ${item.quantity} remaining</p>`).join("")}
    `;
}

/** ====================================
 * ADMIN: Manage Appointments
 ==================================== */
async function fetchAppointments() {
    const response = await fetch(`${BASE_URL}/appointments`);
    const appointments = await response.json();

    const appointmentList = document.getElementById('appointment_list');
    appointmentList.innerHTML = appointments.map(app => `
        <p>${app.name} - Slot: ${new Date(app.slot_time).toLocaleString()} - Status: ${app.status}</p>
    `).join("");
}

/** ====================================
 * USER: Check Beds
 ==================================== */
async function checkAvailableBeds() {
    const hospitalName = document.getElementById('user_hospital_search').value;

    const response = await fetch(`${BASE_URL}/beds?hospital_name=${hospitalName}`);
    const beds = await response.json();

    const userBedList = document.getElementById('user_bed_list');
    userBedList.innerHTML = beds.length > 0 
        ? beds.map(bed => `<p>Bed ID: ${bed.id} - Status: ${bed.status}</p>`).join("")
        : "<p>No available beds found for this hospital.</p>";
}

/** ====================================
 * USER: Book Appointment
 ==================================== */
async function bookAppointment() {
    const name = document.getElementById('appointment_name').value;
    const contact = document.getElementById('appointment_contact').value;
    const slotTime = document.getElementById('appointment_slot').value;

    const response = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, slot_time: slotTime }),
    });

    if (response.ok) {
        alert("Appointment booked successfully!");
        document.getElementById('appointment_name').value = "";
        document.getElementById('appointment_contact').value = "";
        document.getElementById('appointment_slot').value = "";
    } else {
        alert("Failed to book appointment. Please try again.");
    }
}

/** ====================================
 * Utility: Logout
 ==================================== */
function logout() {
    window.location.href = "/logout";
}
