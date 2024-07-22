class Todo {
  static getTasks() {
    $("#app").empty();
    $("#taskListTableBody").empty();
    $("#taskList").hide();
    $.ajax({
      type: "GET",
      url: `${baseURL}/todos`,
      headers: {
        token: localStorage.token
      }
    })
      .done(tasks => {
        tasks.forEach((task, index) => {
          let taskData = "<tr>";
          taskData += `<td>${index + 1}</td>`;
          taskData += `<td>${task.id}</td>`;
          taskData += `<td>${task.title}</td>`;
          taskData += `<td>${task.description}</td>`;

          if (task.status) {
            taskData += `<td>Done</td>`;
          } else {
            taskData += `<td>Undone</td>`;
          }

          taskData += `<td>${Date(task.due_date)}</td>`;

          if (task.status) {
            taskData += `<td>
        <button onclick="Todo.beforeDeleteTask(${task.id})" type="button" class="taskDeleteButton btn btn-danger" data-toggle="modal" data-target="#deleteModal">Delete</button>
        </td>`;
          } else {
            taskData += `<td>
        <button onclick="Todo.beforeEditTask(${task.id})" type="button" class="taskEditButton btn btn-warning" data-toggle="modal" data-target="#editModal">Edit</button>
        <button onclick="Todo.beforeDoneTask(${task.id})" type="button" class="taskDoneButton btn btn-primary" data-toggle="modal" data-target="#doneModal">Done</button>
        </td>`;
          }
          taskData += "</tr>";
          $("#taskListTableBody").append(taskData);
        });
        $("#app").append($("#taskList").html());
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.log({
          jqXHR,
          textStatus,
          errorThrown
        });
      });
  }

  static beforeCreateTask() {
    $("#createModal").modal("show");
  }

  static createTask(e) {
    e.preventDefault();
    const taskData = $("#createForm").serialize();
    console.log(taskData);
    $.ajax({
      type: "POST",
      url: `${baseURL}/todos`,
      headers: {
        token: localStorage.token
      },
      data: taskData,
      dataType: "json"
    })
      .done(task => {
        $("#createModal").modal("toggle");
        Todo.getTasks();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.log({
          jqXHR,
          textStatus,
          errorThrown
        });
      });
  }

  static beforeEditTask(taskId) {
    $("#editModal").modal("hide");
    $.ajax({
      type: "GET",
      url: `${baseURL}/todos/${taskId}`,
      headers: {
        token: localStorage.token
      }
    })
      .done(task => {
        $("#taskEditTitle").val(task.title);
        $("#taskEditDescription").text(task.description);
        $("#taskEditDueDate").val(task.due_date.split("T")[0]);
        $("#editModal").modal("show");
        localStorage.task_id = task.id;
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.log({
          jqXHR,
          textStatus,
          errorThrown
        });
      });
  }

  static editTask(e) {
    e.preventDefault();
    const taskData = $("#editForm").serialize();
    $.ajax({
      method: "PUT",
      url: `${baseURL}/todos/${localStorage.task_id}`,
      headers: {
        token: localStorage.token
      },
      data: taskData,
      dataType: "json"
    })
      .done(result => {
        $("#editModal").modal("toggle");
        localStorage.removeItem("task_id");
        Todo.getTasks();
      })
      .fail(err => {
        console.log(err);
      });
  }

  static beforeDeleteTask(taskId) {
    $("#deleteModal").modal("show");
    localStorage.task_id = taskId;
  }

  static deleteTask(e) {
    e.preventDefault();
    $.ajax({
      type: "DELETE",
      headers: {
        token: localStorage.token
      },
      url: `${baseURL}/todos/${localStorage.task_id}`
    })
      .done(deletedTask => {
        $("#deleteModal").modal("toggle");
        localStorage.removeItem("task_id");
        Todo.getTasks();
      })
      .fail(err => {
        console.log(err);
      });
  }

  static buttonCancel(e) {
    e.preventDefault();
    localStorage.removeItem("task_id");
  }

  static beforeDoneTask(taskId) {
    $("#doneModal").modal("show");
    localStorage.task_id = taskId;
  }

  static doneTask(e) {
    e.preventDefault();
    let task = null;
    $.ajax({
      type: "GET",
      headers: {
        token: localStorage.token
      },
      url: `${baseURL}/todos/${localStorage.task_id}`
    })
      .done(foundTask => {
        task = foundTask;
        task.status = true;
        return $.ajax({
          type: "PUT",
          headers: {
            token: localStorage.token
          },
          url: `${baseURL}/todos/${localStorage.task_id}`,
          data: task
        });
      })
      .done(doneTaskResult => {
        Todo.getTasks();
        $("#doneModal").modal("toggle");
        localStorage.removeItem("task_id");
      })
      .fail(err => {
        console.log(err);
      });
  }
}
