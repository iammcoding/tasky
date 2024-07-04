$(document).ready(() => {
    $("form#login").submit((event) => {
      event.preventDefault();
  
      // Client-side validation
      const username = $("#username").val().trim();
      const password = $("#password").val().trim();
  
      if (!username || !password) {
        $("#alert").addClass("bg-red-100");
        $("#alert").html(`<span class="font-medium">Error!</span> Username and password are required.`);
        $("#alert").show();
        return;
      }
  
      var $submitButton = $("button[type='submit']");
      $submitButton.attr("disabled", true);
      $submitButton.hide();
      $("#alert").hide();
      $("#alert").removeClass("bg-green-100 bg-red-100");
  
      $.ajax({
        type: "POST",
        url: "/authenticate/",
        data: {
          username: username,
          password: password,
          csrfmiddlewaretoken: $("#token").val(),
        },
        success: function (response) {
          // Handle successful response
          $("#alert").html(
            `<span class="font-medium">Success!</span> ${response.message}`
          );
          $("#alert").addClass("bg-green-100");
          setTimeout(() => {
            window.location.href = "/dash";
          }, 1000);
        },
        error: function (response) {
          $("#alert").addClass("bg-red-100");
          // Handle error response
          $("#alert").html(
            `<span class="font-medium">Error!</span> ${response.responseJSON.message}`
          );
        },
        complete: function () {
          $submitButton.show();
          $submitButton.attr("disabled", false);
          $("#alert").show();
        },
      });
    });
  });
  
  $(document).ajaxStart(function () {
    $("#loader").css({ display: "inline-flex" });
  });
  
  $(document).ajaxComplete(function () {
    $("#loader").hide();
  });
  