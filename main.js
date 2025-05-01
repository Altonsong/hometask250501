window.onload = function () {
  getTasks(function (tasks) {
    var html = "";
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];

      var statusSymbol = getStatusSymbol(t.status);
      var statusColor = getStatusColor(t.status);

      html += "<div class='task'>";
      html += "<div><div class='task-name'>" + t.name + "</div>";
      html += "<div class='task-date'>" + formatDate(t.due_date) + "</div></div>";
      html += "<div><img src='images/" + t.owner + ".png' width='40'></div>";
      html += "<div>";
      html += "<button onclick='toggleStatus(this)' class='status' style='background-color:" + statusColor + "' data-status='" + t.status + "' data-id='" + t.id + "'>" + statusSymbol + "</button> ";
      html += "<button onclick='deleteTask(this)' class='delete-btn' data-id='" + t.id + "'>❌</button>";
      html += "</div></div>";
    }
    document.getElementById("taskList").innerHTML = html;
  });
};

// ✅ 获取状态图标
function getStatusSymbol(status) {
  if (status === "completed") return "✔";
  if (status === "rework") return "↻";
  return "⭘"; // pending
}

// ✅ 获取状态颜色
function getStatusColor(status) {
  if (status === "completed") return "green";
  if (status === "rework") return "yellow";
  return "gray"; // pending
}

// ✅ 点击切换状态并更新 Supabase
function toggleStatus(btn) {
  var status = btn.getAttribute("data-status");
  var nextStatus = status === "pending" ? "completed" : (status === "completed" ? "rework" : "pending");
  var taskId = btn.getAttribute("data-id");

  // 更新按钮外观
  btn.setAttribute("data-status", nextStatus);
  btn.innerHTML = getStatusSymbol(nextStatus);
  btn.style.backgroundColor = getStatusColor(nextStatus);

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
  var taskDiv = btn.parentNode.parentNode;

  deleteTaskFromSupabase(taskId, function(success) {
    if (success) {
      taskDiv.parentNode.removeChild(taskDiv);
    } else {
      alert("Failed to delete task.");
    }
  });
}

// ✅ 日期格式化
function formatDate(isoString) {
  var d = new Date(isoString);
  return d.toLocaleString();
}
