const noteCreator_box = document.querySelector('.noteCreator_box'); // Selects the element with the class 'noteCreator_box'
const closeNote_btn = document.querySelector('.closeNote_btn'); // Selects the element with the class 'closeNote_btn'
const CreateNote_btn = document.querySelector('.CreateNote_btn'); // Selects the element with the class 'CreateNote_btn'

// Function to clear input fields
function clearInputFields() {
    document.querySelector('.noteTitle').value = ''; // Clears the value of the input field with the class 'noteTitle'
    document.querySelector('.moreInfo').value = ''; // Clears the value of the input field with the class 'moreInfo'
}

// Event listener for the CreateNote_btn button
CreateNote_btn.addEventListener('click', () => {
    noteCreator_box.style.display = 'block'; // Displays the content box element
    clearInputFields(); // Calls the function to clear input fields
});

// Event listener for the closeNote_btn button
closeNote_btn.addEventListener('click', () => {
    noteCreator_box.style.display = 'none'; // Hides the content box element
    clearInputFields(); // Calls the function to clear input fields
});

const addBox = document.querySelector(".CreateNote_btn"), // Selects the element with the class 'CreateNote_btn' and assigns it to the variable 'addBox'
    popupBox = document.querySelector(".noteCreator_box"), // Selects the element with the class 'noteCreator_box' and assigns it to the variable 'popupBox'
    popupTitle = document.querySelector(".noteCreator_box .noteTitle"), // Selects the element with the class 'noteTitle' inside the element with the class 'noteCreator_box' and assigns it to the variable 'popupTitle'
    closeIcon = document.querySelector(".closeNote_btn"), // Selects the element with the class 'closeNote_btn' and assigns it to the variable 'closeIcon'
    titleTag = document.querySelector(".noteCreator_box .noteTitle"), // Selects the element with the class 'noteTitle' inside the element with the class 'noteCreator_box' and assigns it to the variable 'titleTag'
    descTag = document.querySelector(".noteCreator_box .moreInfo"), // Selects the element with the class 'moreInfo' inside the element with the class 'noteCreator_box' and assigns it to the variable 'descTag'
    addBtn = document.querySelector(".noteCreator_box .AddNote_btn"); // Selects the element with the class 'AddNote_btn' inside the element with the class 'noteCreator_box' and assigns it to the variable 'addBtn'

const months = ["January", "February", "March", "April", "May", "June", "July", // Defines an array containing the names of months
                "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]"); // Retrieves the notes from local storage or initializes an empty array if there are no notes
let isUpdate = false, updateId; // Initializes variables used for updating notes

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note"; // Sets the text content of popupTitle to "Add a new Note"
    addBtn.innerText = "Add Note"; // Sets the text content of addBtn to "Add Note"
    popupBox.classList.add("show"); // Adds the class "show" to popupBox element
    document.querySelector("body").style.overflow = "hidden"; // Sets the overflow style property of the body element to "hidden"
    if (window.innerWidth > 660) titleTag.focus(); // Sets the focus on the titleTag element if the window width is greater than 660 pixels
});

closeIcon.addEventListener("click", () => {
    isUpdate = false; // Sets the isUpdate variable to false
    titleTag.value = descTag.value = ""; // Sets the value of titleTag and descTag elements to an empty string
    popupBox.classList.remove("show"); // Removes the class "show" from popupBox element
    document.querySelector("body").style.overflow = "auto"; // Sets the overflow style property of the body element to "auto"
});

function showNotes() {
    const noteContainer = document.querySelector('.note-container'); // Selects the element with the class 'note-container'

    // Clear existing notes
    if (noteContainer) {
        noteContainer.innerHTML = ''; // Clears the inner HTML content of the noteContainer element
    }

    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>'); // Replaces newline characters in the description with '<br/>' to maintain line breaks
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                            <div class="action-buttons">
                                <button class="edit-button" onclick="updateNote(${id}, '${note.title}', '${filterDesc}')">Edit</button>
                                <button class="delete-button" onclick="deleteNote(${id})">Delete</button>
                            </div>
                        </div>
                    </li>`;
        // The 'liTag' variable stores the HTML code for a single note item, including its title, description, date, and action buttons.

        // Append the note to the note container
        if (noteContainer) {
            noteContainer.insertAdjacentHTML('beforeend', liTag); // Inserts the liTag HTML at the end of the note container
        }
    });
}
showNotes(); // Calls the showNotes function to display the notes on the page

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        // If the clicked target is not an <i> element or is not the same as the target element, remove the 'show' class from the parent element
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    // Asks for confirmation before deleting the note
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return; // If user cancels, return without deleting
    notes.splice(noteId, 1); // Removes the note from the 'notes' array
    localStorage.setItem("notes", JSON.stringify(notes)); // Updates the notes in localStorage
    showNotes(); // Refreshes the display of notes
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n'); // Replaces '<br/>' with newline characters for editing
    updateId = noteId; // Sets the ID of the note to update
    isUpdate = true; // Indicates that an update is in progress
    addBox.click(); // Triggers the click event on the addBox to show the update form
    titleTag.value = title; // Sets the title input value to the current note title
    descTag.value = description; // Sets the description input value to the current note description
    popupTitle.innerText = "Update a Note"; // Sets the title of the popup box to indicate update mode
    addBtn.innerText = "Update Note"; // Sets the text of the add button to indicate update mode
}

addBtn.addEventListener("click", e => {
    e.preventDefault(); // Prevents the default form submission behavior
    let title = titleTag.value.trim(), // Gets the trimmed value of the title input
        description = descTag.value.trim(); // Gets the trimmed value of the description input

    if (title || description) { // Checks if either the title or description is not empty
        let currentDate = new Date(), // Gets the current date
            month = months[currentDate.getMonth()], // Gets the current month
            day = currentDate.getDate(), // Gets the current day
            year = currentDate.getFullYear(); // Gets the current year

        let noteInfo = { title, description, date: `${month} ${day}, ${year}` }; // Creates an object with note information
        if (!isUpdate) { // If not in update mode, add a new note
            notes.push(noteInfo); // Adds the new note to the 'notes' array
        } else { // If in update mode, update the existing note
            isUpdate = false; // Resets the update flag
            notes[updateId] = noteInfo; // Updates the note at the specified index
        }
        localStorage.setItem("notes", JSON.stringify(notes)); // Updates the notes in localStorage
        showNotes(); // Refreshes the display of notes
        closeIcon.click(); // Simulates a click on the close icon to close the popup box
    }
});