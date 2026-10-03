let reportForm = document.querySelector("#report");
let reportsContainer = document.querySelector("#container");
let reportCount = document.querySelector("#reportCount");
let filter = document.querySelector("#filter");
let imageInput = document.querySelector("#image");
let editModal = document.querySelector("#editModal");
let editDescription = document.querySelector("#editDescription");
let editLocation = document.querySelector("#editLocation");
let saveEdit = document.querySelector("#saveEdit");
let cancelEdit = document.querySelector("#cancelEdit");

let savedReports =
    JSON.parse(localStorage.getItem("cityPulseReports")) || [];

let currentReport = null;


/* REPORT CLASS */

class Report {

    constructor(problem, description, location, image) {
    this.id = "CP-" + Date.now();
    this.problem = problem;
    this.description = description;
    this.location = location;
    this.image = image;
    this.status = "Reported";
    this.date = new Date().toLocaleString();
}

    showDetails() {
        console.log(
            "Problem: " + this.problem +
            "\nDescription: " + this.description +
            "\nLocation: " + this.location
        );
    }
}


/* DISPLAY REPORT */

function displayReport(report) {

    let card = document.createElement("div");

    card.className = "report-card";
    card.dataset.problem = report.problem;
    card.dataset.id = report.id;


    let heading = document.createElement("h3");
    heading.textContent = report.problem;


    let description = document.createElement("p");
    description.textContent =
        "Description: " + report.description;


    let location = document.createElement("p");
    location.textContent =
        "Location: " + report.location;


    let id = document.createElement("p");
    id.textContent =
        "Report ID: " + report.id;


    let date = document.createElement("p");
    date.textContent =
        "Reported on: " + report.date;


    let status = document.createElement("span");
    status.className = "status";
    status.textContent = report.status;

    /* IMAGE */

if (report.image) {

    let image = document.createElement("img");

    image.src = report.image;
    image.alt = "Report image";
    image.className = "report-image";

    card.append(image);
}


    /* EDIT BUTTON */

let editButton = document.createElement("button");

editButton.type = "button";
editButton.textContent = "Edit Report";
editButton.className = "edit-button";

editButton.addEventListener("click", function() {

    currentReport = report;

    editDescription.value = report.description;
    editLocation.value = report.location;

    editModal.style.display = "flex";
});


    /* DELETE BUTTON */

    let deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Delete Report";
    deleteButton.className = "delete-button";


    deleteButton.addEventListener("click", function() {

        let confirmDelete = confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmDelete) {
            return;
        }


        card.remove();


        savedReports = savedReports.filter(function(item) {

            return item.id !== report.id;

        });


        localStorage.setItem(
            "cityPulseReports",
            JSON.stringify(savedReports)
        );


        updateCount();

    });


    /* BUTTON CONTAINER */

    let buttonContainer = document.createElement("div");

    buttonContainer.className = "button-container";

    buttonContainer.append(editButton);
    buttonContainer.append(deleteButton);


    /* ADD EVERYTHING TO CARD */

    card.append(heading);
    card.append(description);
    card.append(location);
    card.append(id);
    card.append(date);
    card.append(status);
    card.append(buttonContainer);


    reportsContainer.append(card);
}


/* UPDATE COUNT */

function updateCount() {

    let visibleReports = document.querySelectorAll(
        ".report-card:not([style*='display: none'])"
    );

    reportCount.textContent = visibleReports.length;
}


/* FILTER */

function applyFilter() {

    let selectedProblem = filter.value;

    let cards = document.querySelectorAll(".report-card");


    cards.forEach(function(card) {

        if (
            selectedProblem === "All" ||
            card.dataset.problem === selectedProblem
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });


    updateCount();
}


filter.addEventListener("change", function() {

    applyFilter();

});


/* LOAD SAVED REPORTS */

savedReports.forEach(function(report) {

    displayReport(report);

});


updateCount();

/* SUBMIT REPORT */

reportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let problem = document.querySelector("#problems");
    let description = document.querySelector("#description");
    let location = document.querySelector("#location");
    let image = imageInput.files[0];


    if (
        description.value.trim() === "" ||
        location.value.trim() === ""
    ) {

        alert("Please fill in all the required fields.");

        return;
    }


    /* CREATE REPORT WITHOUT IMAGE FIRST */

    if (image) {

        let reader = new FileReader();

        reader.onload = function(event) {

            let report = new Report(
                problem.value,
                description.value.trim(),
                location.value.trim(),
                event.target.result
            );

            saveReport(report);

        };

        reader.readAsDataURL(image);

    } else {

        let report = new Report(
            problem.value,
            description.value.trim(),
            location.value.trim(),
            ""
        );

        saveReport(report);

    }

});


/* SAVE REPORT */

function saveReport(report) {

    report.showDetails();


    savedReports.push(report);


    localStorage.setItem(
        "cityPulseReports",
        JSON.stringify(savedReports)
    );


    displayReport(report);


    reportForm.reset();


    applyFilter();

}

/* SAVE EDIT */

saveEdit.addEventListener("click", function() {

    if (currentReport === null) {
        return;
    }

    let newDescription = editDescription.value.trim();
    let newLocation = editLocation.value.trim();

    if (newDescription === "" || newLocation === "") {
        alert("Description and location cannot be empty.");
        return;
    }

    currentReport.description = newDescription;
    currentReport.location = newLocation;


    /* UPDATE LOCAL STORAGE */

    savedReports = savedReports.map(function(item) {

        if (item.id === currentReport.id) {
            return currentReport;
        }

        return item;
    });

    localStorage.setItem(
        "cityPulseReports",
        JSON.stringify(savedReports)
    );


    /* CLOSE MODAL */

    editModal.style.display = "none";

    currentReport = null;


    /* REDRAW REPORTS */

    reportsContainer.innerHTML = "";

    savedReports.forEach(function(report) {
        displayReport(report);
    });

    applyFilter();

});



/* CANCEL EDIT */

cancelEdit.addEventListener("click", function() {

    editModal.style.display = "none";

    currentReport = null;

});