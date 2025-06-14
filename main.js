window.onload = function () {
  getTasks(function (tasks) {
    // 按完成时间升序排序
    tasks.sort(function(a, b) {
      return new Date(a.due_date) - new Date(b.due_date);
    });
    
    var html = "";
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];

      html += "<div class='task'>";
      html += "<div><div class='task-name " + (t.status || 'pending') + "'>" + t.name + "</div>";
      html += "<div class='task-date'>" + formatDate(t.due_date) + "</div></div>";
      html += "<div class='owner-icon'><img src='images/" + t.owner + ".png' width='40'></div>";
      html += "<div class='task-buttons'>";
      html += "<button onclick='toggleStatus(this)' class='status' data-status='" + (t.status || 'pending') + "' data-id='" + t.id + "'><img src='images/" + (t.status || 'pending') + ".png' width='60' height='60'></button>";
      html += "<button onclick='deleteTask(this)' class='delete-btn' data-id='" + t.id + "'><img src='images/delete.png' width='60' height='60'></button>";
      html += "</div></div>";
    }
    document.getElementById("taskList").innerHTML = html;
  });
};

// ✅ 点击切换状态并更新 Supabase
function toggleStatus(btn) {
  var status = btn.getAttribute("data-status");
  var nextStatus = status === "pending" ? "completed" : (status === "completed" ? "rework" : "pending");
  var taskId = btn.getAttribute("data-id");

  // 更新按钮外观和任务名称样式
  btn.dataset.status = nextStatus;
  btn.innerHTML = `<img src="images/${nextStatus}.png" width="60" height="60">`;
  var taskNameElement = btn.closest('.task').querySelector('.task-name');
  taskNameElement.classList.remove('pending', 'completed', 'rework');
  taskNameElement.classList.add(nextStatus);

  // 更新数据库
  updateTaskStatus(taskId, nextStatus, function(success) {
    if (!success) {
      alert("Failed to update status.");
    }
  });
}

// ✅ 删除任务
function deleteTask(btn) {
  var taskId = btn.getAttribute("data-id");
  var taskDiv = btn.closest('.task');
  var status = taskDiv.querySelector('.status').getAttribute('data-status');
  
  if (status === 'completed') {
    // 如果是已完成状态,直接删除
    deleteTaskFromSupabase(taskId, function(success) {
      if (success) {
        taskDiv.parentNode.removeChild(taskDiv);
      } else {
        alert("Failed to delete task.");
      }
    });
  } else {
    // 如果是未完成状态,弹出确认框
    if (confirm("This task is not completed yet. Are you sure you want to delete it?")) {
      deleteTaskFromSupabase(taskId, function(success) {
        if (success) {
          taskDiv.parentNode.removeChild(taskDiv);
        } else {
          alert("Failed to delete task.");
        }
      });
    }
  }
}

// ✅ 日期格式化
function formatDate(isoString) {
  var d = new Date(isoString);
  return d.toLocaleString();
}