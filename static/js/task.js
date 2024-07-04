/**
 * Formats a given date string into a format suitable for an input field.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string in the format 'YYYY-MM-DDTHH:MM'.
 */
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Generates a task card HTML element with the provided details.
 * @param {string} id - The unique identifier of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} status - The status of the task.
 * @param {string} priority - The priority level of the task.
 * @param {string} due_date - The due date of the task.
 * @param {string} category - The category of the task.
 * @returns {string} - HTML representation of the task card.
 */

function taskCard(
  id,
  title,
  description,
  status,
  priority,
  due_date,
  category
) {
  due_date = formatDateForInput(due_date); // Format due_date using formatDateForInput function
  let priorityClass =
    priority.toLowerCase() === "high"
      ? "bg-red-500"
      : priority.toLowerCase() === "medium"
      ? "bg-yellow-500"
      : priority.toLowerCase() === "low"
      ? "bg-green-500"
      : "bg-gray-500"; // Determine priority class based on priority level

  return `
      <div data-id="${id}" data-status="${status}" class="dragDiv max-w-sm mt-4 mx-auto bg-white rounded-xl border shadow-md overflow-hidden md:max-w-2xl">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <span id="card-priority" class="${priorityClass} text-white text-sm font-bold px-2 py-1 rounded">${priority}</span>
            <div class="flex items-center space-x-2"> 
              <span class="bg-purple-200 text-purple-800 text-sm font-bold px-2 py-1 rounded" id="card-category">${category}</span>
            </div>
          </div>
          <div class="mt-4">
            <h2 class="text-xl font-bold text-gray-900" id="card-title">${title}</h2>
            <p class="mt-2 text-gray-600" id="card-des">${description}</p>
            <div class="mt-4 flex items-center">
              <span class="text-gray-600 text-sm" id="card-due_date">${due_date}</span>
              <div class="ml-auto flex space-x-2 text-gray-400">
                <button onclick="editTask('${id}','${title}','${description}','${status}','${priority}','${due_date}','${category}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="2em" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M25 4.031c-.766 0-1.516.297-2.094.875L13 14.781l-.219.219l-.062.313l-.688 3.5l-.312 1.468l1.469-.312l3.5-.688l.312-.062l.219-.219l9.875-9.906A2.968 2.968 0 0 0 25 4.03zm0 1.938c.234 0 .465.12.688.343c.445.446.445.93 0 1.375L16 17.376l-1.719.344l.344-1.719l9.688-9.688c.222-.222.453-.343.687-.343zM4 8v20h20V14.812l-2 2V26H6V10h9.188l2-2z"/>
                  </svg>
                </button>
                <button onclick="deleteTask('${id}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="2em" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M216 50h-42V40a22 22 0 0 0-22-22h-48a22 22 0 0 0-22 22v10H40a6 6 0 0 0 0 12h10v146a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V62h10a6 6 0 0 0 0-12M94 40a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v10H94Zm100 168a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V62h132Zm-84-104v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0m48 0v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
}

/**
 * Retrieves tasks data from the server and updates the UI with the task information.
 * Makes an AJAX GET request to "/taskDatas/" endpoint to fetch task data.
 * Updates the UI elements based on the received task data.
 * If there are no tasks in progress, completed, or overdue, displays a message.
 * If there are tasks, hides the empty data message and populates the UI with task cards.
 * Handles the case of a failed AJAX request by showing an alert to reload the browser.
 * @returns None
 */
function getTasks() {
  $.get("/taskDatas/")
    .done((res) => {
      var response = res.data;

      // Show or hide empty data message based on counts
      if (
        res.data.inprogress_count == 0 &&
        res.data.completed_count == 0 &&
        res.data.overdue_count == 0
      ) {
        $("#emptydata").css({ display: "flex" });
      } else {
        $("#emptydata").hide();
      }

      // Update counts
      $("#inprogress_count").html(res.data.inprogress_count);
      $("#completed_count").html(res.data.completed_count);
      $("#overdue_count").html(res.data.overdue_count);

      // Clear existing task lists
      $("#inprogress").html("");
      $("#overdue").html("");
      $("#completed").html("");

      // Populate in-progress tasks
      response.inprogress.map((data) => {
        $("#inprogress").append(
          taskCard(
            data.id,
            data.title,
            data.description,
            data.status,
            data.priority,
            data.due_date,
            data.category
          )
        );
      });

      // Populate completed tasks
      response.completed.map((data) => {
        $("#completed").append(
          taskCard(
            data.id,
            data.title,
            data.description,
            data.status,
            data.priority,
            data.due_date,
            data.category
          )
        );
      });

      // Populate overdue tasks
      response.overdue.map((data) => {
        $("#overdue").append(
          taskCard(
            data.id,
            data.title,
            data.description,
            data.status,
            data.priority,
            data.due_date,
            data.category
          )
        );
      });

      // Initialize draggable functionality
      loadDraggable();
    })
    .fail(() => {
      alert("Something went wrong, reload your browser!");
    });
}

/**
 * Executes various functions when the document is ready.
 * - Retrieves tasks from the server and displays them based on their status.
 * - Handles form submission for filtering tasks, editing tasks, and adding new tasks.
 * - Updates task cards based on the response from the server.
 * - Shows success or error messages when editing or adding tasks.
 * @returns None
 */
$(document).ready(() => {
  // Function to fetch tasks on document ready
  function getTasks() {
    $.get("/taskDatas/")
      .done((res) => {
        var response = res.data;

        // Show or hide empty data message based on counts
        if (
          res.data.inprogress_count == 0 &&
          res.data.completed_count == 0 &&
          res.data.overdue_count == 0
        ) {
          $("#emptydata").css({ display: "flex" });
        } else {
          $("#emptydata").hide();
        }

        // Update counts
        $("#inprogress_count").html(res.data.inprogress_count);
        $("#completed_count").html(res.data.completed_count);
        $("#overdue_count").html(res.data.overdue_count);

        // Clear existing task lists
        $("#inprogress").html("");
        $("#overdue").html("");
        $("#completed").html("");

        // Populate in-progress tasks
        response.inprogress.map((data) => {
          $("#inprogress").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Populate completed tasks
        response.completed.map((data) => {
          $("#completed").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Populate overdue tasks
        response.overdue.map((data) => {
          $("#overdue").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Initialize draggable functionality
        loadDraggable();
      })
      .fail(() => {
        alert("Something went wrong, reload your browser!");
      });
  }

  // Initial call to getTasks() on document ready
  getTasks();

  // Submit handler for filter form
  $("#filter-data").submit((event) => {
    event.preventDefault();
    var formData = $("#filter-data").serialize();

    $.post("/taskDatas/", formData)
      .done((res) => {
        var response = res.data;

        // Show or hide empty data message based on counts
        if (
          res.data.inprogress_count == 0 &&
          res.data.completed_count == 0 &&
          res.data.overdue_count == 0
        ) {
          $("#emptydata").css({ display: "flex" });
        } else {
          $("#emptydata").hide();
        }

        // Update counts
        $("#inprogress_count").html(res.data.inprogress_count);
        $("#completed_count").html(res.data.completed_count);
        $("#overdue_count").html(res.data.overdue_count);

        // Clear existing task lists
        $("#inprogress").html("");
        $("#overdue").html("");
        $("#completed").html("");

        // Populate in-progress tasks
        response.inprogress.map((data) => {
          $("#inprogress").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Populate completed tasks
        response.completed.map((data) => {
          $("#completed").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Populate overdue tasks
        response.overdue.map((data) => {
          $("#overdue").append(
            taskCard(
              data.id,
              data.title,
              data.description,
              data.status,
              data.priority,
              data.due_date,
              data.category
            )
          );
        });

        // Initialize draggable functionality
        loadDraggable();
        /**
         * Hides the modal with the specified ID.
         * @param {string} modalId - The ID of the modal to hide.
         * @returns None
         */
        hideModal("filter-modal");
      })
      .fail(() => {
        alert("Something went wrong, reload your browser!");
      });
  });

  // Submit handler for edit task form
  $("#editTask").submit((event) => {
    event.preventDefault();

    var $submitButton = $("#editTask button[type='submit']");
    $submitButton.hide();

    $("#alert-edit").hide().removeClass("bg-green-100 bg-red-100");

    // Client-side validation
    const title = $("#etitle").val().trim();
    const id = $("#id").val().trim();
    const description = $("#edescription").val().trim();
    const status = $("#estatus").find(":selected").val().trim();
    const priority = $("#epriority").find(":selected").val().trim();
    const due_date = $("#edue_date").val().trim();
    const category = $("#ecategory").val().trim();

    if (
      !title ||
      !id ||
      !description ||
      !status ||
      !priority ||
      !due_date ||
      !category
    ) {
      $("#alert-edit").html(
        "<span class='font-medium'>Error!</span> All fields are required."
      );
      $("#alert-edit").addClass("bg-red-100").show();
      $submitButton.show();
      return;
    }

    $.ajax({
      type: "POST",
      url: "/edit-task/", // Replace with your endpoint URL
      data: {
        title: title,
        id: id,
        description: description,
        status: status,
        priority: priority,
        due_date: due_date,
        category: category,
        csrfmiddlewaretoken: $("#token").val(), // Ensure your CSRF token field is properly named
      },
      success: function (response) {
        // Handle successful response
        $("#alert-edit")
          .html(`<span class="font-medium">Success!</span> ${response.message}`)
          .addClass("bg-green-100")
          .show();

        // Fetch updated tasks after edit
        getTasks();

        /**
         * Sets a timer that will hide the "edit-task-modal" modal after 800 milliseconds.
         */
        setTimeout(() => {
          hideModal("edit-task-modal");
        }, 800);
      },
      error: function (response) {
        // Handle error response
        $("#alert-edit")
          .html(
            `<span class="font-medium">Error!</span> ${response.responseJSON.message}`
          )
          .addClass("bg-red-100")
          .show();
      },
      complete: function () {
        setTimeout(() => {
          $("#alert-edit").hide();
        }, 800);
        $submitButton.show();
      },
    });
  });

  // Submit handler for new task form
  $("#newTask").submit((event) => {
    event.preventDefault();

    var $submitButton = $("#newTask button[type='submit']");
    $submitButton.hide();

    $("#alert-new").hide().removeClass("bg-green-100 bg-red-100");

    // Client-side validation
    const title = $("#title").val().trim();
    const description = $("#description").val().trim();
    const status = $("#status").find(":selected").val().trim();
    const priority = $("#priority").find(":selected").val().trim();
    const due_date = $("#due_date").val().trim();
    const category = $("#category").val().trim();

    if (
      !title ||
      !description ||
      !status ||
      !priority ||
      !due_date ||
      !category
    ) {
      $("#alert-new").html(
        "<span class='font-medium'>Error!</span> All fields are required."
      );
      $("#alert-new").addClass("bg-red-100").show();
      $submitButton.show();
      return;
    }

    $.ajax({
      type: "POST",
      url: "/submit-task/", // Replace with your endpoint URL
      data: {
        title: title,
        description: description,
        status: status,
        priority: priority,
        due_date: due_date,
        category: category,
        csrfmiddlewaretoken: $("#token").val(), // Ensure your CSRF token field is properly named
      },
      success: function (response) {
        // Handle successful response
        $("#alert-new")
          .html(`<span class="font-medium">Success!</span> ${response.message}`)
          .addClass("bg-green-100")
          .show();

        // Fetch updated tasks after adding new task
        getTasks();

        /**
         * Sets a timer that executes a function to hide the modal with the specified ID after 800 milliseconds.
         * @param {string} modalId - The ID of the modal to hide.
         * @returns None
         */
        setTimeout(() => {
          hideModal("add-task-modal");
        }, 800);

        $("#newTask").trigger("reset");
      },
      error: function (response) {
        // Handle error response
        $("#alert-new")
          .html(
            `<span class="font-medium">Error!</span> ${response.responseJSON.message}`
          )
          .addClass("bg-red-100")
          .show();
      },
      complete: function () {
        setTimeout(() => {
          $("#alert-new").hide();
        }, 800);
        $submitButton.show();
      },
    });
  });
});

/**
 * Initializes the draggable and droppable functionality for elements on the page.
 * Allows elements with the class 'dragDiv' to be draggable and elements with the class 'dropDiv' to be droppable.
 * Handles various drag and drop events such as start, over, out, dragstop, dropover, and drop.
 * @returns None
 */
function loadDraggable() {
  var outside = 0;

  var drag = $(".dragDiv").draggable({
    revert: true, // revert to original position if not dropped properly
    start: function (event, ui) {
      $(".dropDiv").fadeIn(); // show all drop zones when dragging starts
      var statusdrop = ui.helper[0].attributes["data-status"].value;
      var statusdropelement = $(`[data-drop-status="${statusdrop}"]`);
      statusdropelement.hide();

      ui.helper[0].style.transform = "rotate(4deg)";
    },
  });

  // Control if the draggable is outside the droppable area
  $(".dropDiv").droppable({
    accept: ".dragDiv",
    out: function (event, ui) {
      outside = 1;
    },
    over: function () {
      outside = 0;
    },
  });

  // Prevent default behaviors for drag and drop events on HTML element
  $("html").on("dragover dragleave drop", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragover" || event.type === "drop") {
      $(this).toggleClass("dragging", event.type === "dragover");
    }
  });

  // Action when dragging stops
  $(".dragDiv").on("dragstop", function (event, ui) {
    var parentElement = ui.helper[0].parentElement;
    ui.helper[0].style.transform = "rotate(0deg)";

    if ($(parentElement).hasClass("dropDiv")) {
      console.log("Parent element contains the class dropDiv");
    } else {
      console.log("Parent element does not contain the class dropDiv");
      $(".dropDiv").fadeOut();
    }
  });

  // Action when dropping on dropDiv
  $(".dropDiv").on("drop", function (event, ui) {
    var draggable = ui.draggable;

    var draggableDivStatus = ui.helper[0].attributes[1].value;
    var draggableDivID = ui.helper[0].attributes[0].value;
    var dropDivStatus = $(this)[0].attributes[0].value;

    // Perform POST request to move task

    // Adjust elements after dropping
    var dropDiv = $(this);
    var offset = dropDiv.offset();
    var x1 = offset.left;
    var y1 = offset.top;
    var x2 = x1 + dropDiv.outerWidth();
    var y2 = y1 + dropDiv.outerHeight();

    var draggableOffset = draggable.offset();
    var draggableX = draggableOffset.left + draggable.outerWidth() / 2;
    var draggableY = draggableOffset.top + draggable.outerHeight() / 2;

    // Check if the center of the draggable is within the dropDiv
    if (
      draggableX >= x1 &&
      draggableX <= x2 &&
      draggableY >= y1 &&
      draggableY <= y2
    ) {
      $.post("/moveTask/", {
        draggableDivID,
        draggableDivStatus,
        dropDivStatus,
        csrfmiddlewaretoken: $("#token").val(),
      })
        .done((res) => {})
        .fail(() => {
          alert("Something Went Wrong");
        })
        .always(() => {
          getTasks();
        });

      // Remove margin-top from dragged element
      draggable.css("margin-top", "0");

      // Optional: Adjust drop zone styles after dropping
      $(".dropDiv").hide();
      $(this).css({ height: "unset" });
      $(".dropDiv").html("");

      $(this).css({ height: "13rem" });
    }
  });
}

/**
 * Displays a modal of the specified type.
 * @param {string} type - The type of modal to display.
 * @returns None
 */
function showModal(type) {
  var modal = $(`#${type}`)[0];
  modal = new Modal(modal, {});
  modal.show();
}

/**
 * Hides a modal of the specified type.
 * @param {string} type - The type of modal to hide.
 * @returns None
 */
function hideModal(type) {
  var modal = $(`#${type}`)[0];
  modal = new Modal(modal, {});
  modal.hide();
}

/**
 * Edit a task with the provided details.
 * @param {number} id - The ID of the task to edit.
 * @param {string} title - The new title of the task.
 * @param {string} desc - The new description of the task.
 * @param {string} status - The new status of the task.
 * @param {string} priority - The new priority of the task.
 * @param {string} due_date - The new due date of the task.
 * @param {string} category - The new category of the task.
 * @returns None
 */
function editTask(id, title, desc, status, priority, due_date, category) {
  showModal("edit-task-modal");

  // Set values for edit modal fields
  $("#id").val(id);
  $("#etitle").val(title);
  $("#edescription").val(desc);
  $("#estatus").val(status);
  $("#epriority").val(priority);
  $("#edue_date").val(due_date);
  $("#ecategory").val(category);
}

/**
 * Displays a modal to confirm deletion of a task and sets the value of the modal's input field to the task ID.
 * @param {string} id - The ID of the task to be deleted.
 * @returns None
 */
function deleteTask(id) {
  showModal("deleteModal");
  $("#id").val(id);
}

/**
 * Deletes a task by sending a POST request to the server to delete the task with the given ID.
 * Hides the delete button during the AJAX request, shows it again after completion.
 * @returns None
 */
function deletetask() {
  var $submitButton = $("#deleteBtns");
  $submitButton.hide();

  $.ajax({
    type: "POST",
    url: "/delete-task/", // Replace with your endpoint URL for deleting tasks
    data: {
      id: $("#id").val(), // Task ID to be deleted
      csrfmiddlewaretoken: $("#token").val(), // CSRF token
    },
    success: function (response) {
      hideModal("deleteModal"); // Hide delete confirmation modal
      getTasks(); // Reload tasks after deletion
    },
    error: function (response) {
      alert("Something went wrong"); // Handle error scenario
    },
    complete: function () {
      $submitButton.show(); // Show submit button after request completes
    },
  });
}

/**
 * Attach a function to be executed whenever an AJAX request begins.
 * This function displays the loader element by setting its CSS display property to "inline-flex".
 * @returns None
 */

$(document).ajaxStart(function () {
  $("#loader").css({ display: "inline-flex" });
});

/**
 * Hides the loader element when an AJAX request is completed.
 * This function is triggered after every AJAX request is completed.
 * @returns None
 */
$(document).ajaxComplete(function () {
  $("#loader").hide();
});
