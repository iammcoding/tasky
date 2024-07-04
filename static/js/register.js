/**
 * Sets up form submission handling for the registration form using AJAX.
 * Disables the submit button, sends a POST request to the server with form data,
 * and displays success or error messages accordingly.
 * Also shows and hides loader during AJAX requests.
 * @returns None
 */
$(document).ready(() => {
    $("form#register").submit((event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Client-side validation
      const email = $("#email").val().trim();
      const name = $("#username").val().trim();
      const password = $("#password").val().trim();
  
      if (!email || !name || !password) {
        $("#alert").addClass("bg-red-100");
        $("#alert").html(`<span class="font-medium">Error!</span> All fields are required.`);
        $("#alert").show();
        return;
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $("#alert").addClass("bg-red-100");
        $("#alert").html(`<span class="font-medium">Error!</span> Invalid email format.`);
        $("#alert").show();
        return;
      }
  
      var $submitButton = $("button[type='submit']");
      $submitButton.hide(); // Hide submit button
      $submitButton.attr("disabled", true); // Disable submit button
      $("#alert").hide(); // Hide alert
      $("#alert").removeClass("bg-green-100 bg-red-100"); // Remove previous alert classes
      $.ajax({
        type: "POST",
        url: "/register/",
        data: {
          email: email,
          name: name,
          password: password,
          csrfmiddlewaretoken: $("#token").val(),
        },
        success: function (response) {
          // Handle successful response
          $("#alert").html(
            `<span class="font-medium">Success!</span> ${response.message}`
          );
          $("#alert").addClass("bg-green-100"); // Add green background to alert
          setTimeout(() => {
            window.location.href = "/dash"; // Redirect to dashboard after 1 second
          }, 1000);
        },
        error: function (response) {
          // Handle error response
          $("#alert").addClass("bg-red-100"); // Add red background to alert
          $("#alert").html(
            `<span class="font-medium">Error!</span> ${response.responseJSON.message}`
          );
        },
        complete: function () {
          $submitButton.show(); // Show submit button
          $submitButton.attr("disabled", false); // Enable submit button
  
          $("#alert").show(); // Show alert
        },
      });
    });
  });
  
  $(document).ajaxStart(function () {
    $("#loader").css({ display: "inline-flex" }); // Show loader on AJAX start
  });
  
  $(document).ajaxComplete(function () {
    $("#loader").hide(); // Hide loader on AJAX complete
  });
  