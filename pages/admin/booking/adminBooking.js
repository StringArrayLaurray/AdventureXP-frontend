const seeAllButton = document.querySelector("#see-all-button");
const addButton = document.querySelector("#add-button");
const calendarButton = document.querySelector("#calendar-button");

const content = document.querySelector(".p-content");

document.addEventListener("DOMContentLoaded", async () => {
    renderContent("list", await getAllBookings())
});

seeAllButton.addEventListener("click",async () => {
    renderContent("list", await getAllBookings())
})

calendarButton.addEventListener("click", async () => {
    renderContent("calendar", await getAllBookings())
})

content.addEventListener("click", async (event) => {
    if (event.target.classList.contains("booking-link")) {

        const bookingId = event.target.dataset.id;
        const booking = await getBookingById(bookingId);
        console.log(booking)

        renderContent("details", booking);
    }
})

addButton.addEventListener("click", () => {
    renderContent("create-form")
})

async function getAllBookings() {
    const response = await fetch(`http://localhost:8080/bookings/all`);

    if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
    }

    return await response.json();
}

async function getBookingById(id){
    const response = await fetch(`http://localhost:8080/bookings/${id}`)

    if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
    }

    return await response.json();
}

async function addBooking(booking){
    const response = await fetch(`http://localhost:8080/bookings/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(booking)
    });

    if (!response.ok) {
        throw new Error(`Failed to create booking: ${response.status}`);
    }

    return response;
}

async function deleteBookingById(id){
    const response = await fetch(`http://localhost:8080/bookings/delete/${id}`, {
        method: "DELETE"
    })

    if (!response.ok){
        throw new Error("Error: " + response.status)
    }

    return response;
}

async function updateBooking(id, booking){
    const response = await fetch(`http://localhost:8080/bookings/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(booking)
    })

    if (!response.ok){
        throw new Error("Error: " + response.status)
    }

    return response;

}

function renderContent(type, data) {

    switch (type) {
        case "calendar":
            content.innerHTML = `
            <div id="calendar"></div>
            `
            fetch("http://localhost:8080/bookings/all")
                .then(response => response.json())
                .then(bookings => {
                    const events = bookings.map(booking => {
                        return {
                            title: booking.activities.map(activity => activity.name).join(", "),
                            start: `${booking.date}T${booking.time}`,
                            extendedProps: {
                                id: booking.id,
                                participants: booking.participants,
                                businessBooking: booking.businessBooking,
                                date: booking.date,
                                time: booking.time
                            }
                        };
                    });

                    let calendarEl = document.getElementById("calendar");
                    let calendar = new FullCalendar.Calendar(calendarEl, {
                        initialView: "dayGridMonth",
                        events: events,
                        eventClick: function(bookingInfo) {
                            const booking = bookingInfo.event.extendedProps;
                            changeModal(bookingInfo.event.title, `Booking ID: ${booking.id}
                            Date: ${booking.date}
                            Time: ${booking.time}
                            Participants: ${booking.participants}
                            Business booking: ${booking.businessBooking ? "Yes" : "No"}
                            `);
                            showModal();
                        }
                    });
                    calendar.render();
                });
            break;

        case "list":
            content.innerHTML = `
            <table class="booking-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Activities</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(booking => `
                        <tr>
                            <td>
                            ${booking.id}
                            </td>
                            <td>
                                <a href="#" class="booking-link" data-id="${booking.id}">
                                    ${booking.activities.map(element => element.name).join(", ")}
                                </a>
                            </td>
                            <td>${booking.date}</td>
                            <td>${booking.time}</td>
                            <td>
                                <button class="table-button" id="edit-booking-button" data-id="${booking.id}">Edit</button>
                                <button class="table-button" id="delete-booking-button" data-id="${booking.id}">Delete</button>
                            </td>
                        </tr>`
            ).join("")}
                </tbody>
            </table>
        `;

            document.querySelectorAll(".table-button#delete-booking-button").forEach(button => {
                button.addEventListener("click", async (event) => {
                    const buttonId = event.target.dataset.id;
                    deleteBookingById(buttonId).then( async () => {
                            renderContent("list", await getAllBookings())
                        }
                    );
                })
            })

            document.querySelectorAll(".table-button#edit-booking-button").forEach(button => {
                button.addEventListener("click", async (event) => {
                    fetchActivities().then(activityData => {
                        content.innerHTML = `
                        <form id="create-booking-form">
                        <label>Select Booking Type:</label><br>
                        <input type="radio" id="privateBooking" name="bookingType" value="private" checked>
                        <label for="privateBooking">Private Booking</label><br>
                        
                        <input type="radio" id="businessBooking" name="bookingType" value="business">
                        <label for="businessBooking">Business Booking</label><br>
                        <br>
                        
                        <label>Select activities:</label><br>
                        ${activityData.map(activity => `
                        <input type="checkbox" id="activity-${activity.id}" name="activityCheckbox" value="${activity.id}">
                        <label for="activity-${activity.id}">${activity.name}</label><br>
                        `).join("")}
                            <br><label for="date">Date:</label>
                            <input type="date" id="date" name="date" required><br>
            
                            <label for="time">Time:</label>
                            <input type="time" id="time" name="time" required><br>
            
                            <label for="participants">Participants (comma-separated):</label>
                            <input type="text" id="participants" name="participants" required><br>
            
                            <button type="button" id="updateBookingButton">Update Booking</button>
                        </form>
                        `
                        const buttonId = event.target.dataset.id;
                        getBookingById(buttonId).then((bookingThatIsGoingToBeUpdated) => {
                            if (bookingThatIsGoingToBeUpdated.businessBooking){
                                document.querySelector("#privateBooking").checked = false;
                                document.querySelector("#businessBooking").checked = true;
                            }

                            const selectedActivitiesOnBookingThatIsGoingToBeUpdated = bookingThatIsGoingToBeUpdated.activities.map((activity => activity.id));
                            document.querySelectorAll("input[name='activityCheckbox']").forEach(checkbox => {
                                if (selectedActivitiesOnBookingThatIsGoingToBeUpdated.includes(parseInt(checkbox.value))) {
                                    checkbox.checked = true;
                                }
                            })
                            document.querySelector("#date").value = bookingThatIsGoingToBeUpdated.date;
                            document.querySelector("#time").value = bookingThatIsGoingToBeUpdated.time;
                            document.querySelector("#participants").value = bookingThatIsGoingToBeUpdated.participants;
                        });

                        document.querySelector("#updateBookingButton").addEventListener("click", () => {
                            const selectedActivities = document.querySelectorAll("input[name='activityCheckbox']:checked");
                            const activityPromises = Array.from(selectedActivities).map(activity =>
                                fetchActivityById(activity.value)
                            );
                            Promise.all(activityPromises).then(activitiesToPutIn => {
                                const updatedBooking = {
                                    activities: activitiesToPutIn,
                                    businessBooking: document.querySelector("#businessBooking").checked, //*
                                    date:document.querySelector("#date").value,
                                    time:document.querySelector("#time").value,
                                    participants: document.querySelector("#participants").value.split(",")
                                };

                                if (document.querySelector("#privateBooking").checked && activitiesToPutIn.length > 1){
                                    alert("Chose private and added more than one activity.")
                                    return;
                                }
                                updateBooking(buttonId, updatedBooking).then(async () => {
                                    renderContent("list", await getAllBookings());
                                });
                            })
                        })
                    })
                })
            })
            break;

        case "details":
            changeModal(`${data.activities.map(element => element.name).join(", ")}`,
                `<p class="detail-h2">Booking ID: ${data.id}</p>
                        <p class="detail-p">Activities: ${data.activities.map(element => element.name).join(", ")}</p>
                        <p class="detail-p">Business booking: ${data.businessBooking ? "Yes" : "No"}</p>
                        <p class="detail-p">Date: ${data.date}</p>
                        <p class="detail-p">Time: ${data.time}</p>
                        <p class="detail-p">Participants: ${data.participants.join(", ")}</p>
                        `,
                "html");
            showModal();
        break;

        case "create-form":
            fetchActivities().then(activityData => {
                content.innerHTML = `
                <form id="create-booking-form">
                <label>Select Booking Type:</label><br>
                <input type="radio" id="privateBooking" name="bookingType" value="private" checked>
                <label for="privateBooking">Private Booking</label><br>
                
                <input type="radio" id="businessBooking" name="bookingType" value="business">
                <label for="businessBooking">Business Booking</label><br>
                <br>
                <label>Select activities:</label><br>
                ${activityData.map(activity => `
                <input type="checkbox" id="activity-${activity.id}" name="activityCheckbox" value="${activity.id}">
                <label for="activity-${activity.id}">${activity.name}</label><br>
                `).join("")}
                    <br><label for="date">Date:</label>
                    <input type="date" id="date" name="date" required><br>
    
                    <label for="time">Time:</label>
                    <input type="time" id="time" name="time" required><br>
    
                    <label for="participants">Participants (comma-separated):</label>
                    <input type="text" id="participants" name="participants" required><br>
    
                    <button type="button" id="createBookingButton">Create Booking</button>
                </form>
                `

                document.querySelector("#createBookingButton").addEventListener("click", () => {
                    const selectedActivities = document.querySelectorAll("input[name='activityCheckbox']:checked");
                    const activityPromises = Array.from(selectedActivities).map(activity =>
                        fetchActivityById(activity.value)
                    );

                    Promise.all(activityPromises).then(activitiesToPutIn => {
                        const bookingToSave = {
                        activities: activitiesToPutIn,
                        businessBooking: document.querySelector("#businessBooking").checked,
                        date:document.querySelector("#date").value,
                        time:document.querySelector("#time").value,
                        participants: document.querySelector("#participants").value.split(",")
                        };

                        if (document.querySelector("#privateBooking").checked && activitiesToPutIn.length > 1){
                            alert("chose private and added more than one activity.")
                            return;
                        }
                        addBooking(bookingToSave).then(async() => {
                            renderContent("list", await getAllBookings())
                        });
                    })
                })
            })
            break;
}}