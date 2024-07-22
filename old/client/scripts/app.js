const baseURL = "http://localhost:3000/api";

$(document).ready(() => {
  const token = localStorage.token;
  if (!token) {
    $("#loginAndRegister").show(1000);
    $("#logoutButton").hide();
    $(".userComponent").hide();
  }
  else {
    Todo.getTasks();
    $("#logoutButton").show(1000);
    $("#loginAndRegister").hide();
  }

  // USER SECTION
  $(document).on("click", "#registerButton", User.register);
  $(document).on("click", "#loginButton", User.login);
  $(document).on("click", "#logoutButton", User.logout);

  // TODO SECTION
  $(document).on("click", "#taskCreateButton", Todo.createTask);
  $(document).on("click", "#taskEditButton", Todo.editTask);
  $(document).on("click", "#taskDeleteButton", Todo.deleteTask);
  $(document).on("click", "#modalCancelButton", Todo.buttonCancel);
  $(document).on("click", "#taskDoneButton", Todo.doneTask);
});
