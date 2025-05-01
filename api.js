var SUPABASE_URL = "https://ykedmefwkrkhjvfkmccd.supabase.co";
var API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZWRtZWZ3a3JraGp2ZmttY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjk0ODIsImV4cCI6MjA2MTYwNTQ4Mn0.oqA2SRUIIFihplmuasQ5qSmSsysNqsoTT42j1F9cy90";

// ✅ 获取所有任务
function getTasks(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", SUPABASE_URL + "/rest/v1/tasks?select=*", true);
  xhr.setRequestHeader("apikey", API_KEY);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      if (callback) callback(data);
    } else {
      alert("Failed to fetch tasks. Status: " + xhr.status);
      if (callback) callback([]);
    }
  };
  xhr.send();
}

// ✅ 添加任务
function addTask(task, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", SUPABASE_URL + "/rest/v1/tasks", true);
  xhr.setRequestHeader("apikey", API_KEY);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Prefer", "return=representation");
  xhr.onload = function () {
    if (xhr.status === 201) {
      if (callback) callback(true);
    } else {
      alert("Add task failed: " + xhr.responseText);
      if (callback) callback(false);
    }
  };
  xhr.send(JSON.stringify(task));
}

// ✅ 登录验证码检查
function checkPasscode(code, callback) {
  var xhr = new XMLHttpRequest();
  var url = SUPABASE_URL + "/rest/v1/passcode?code=eq." + encodeURIComponent(code);
  xhr.open("GET", url, true);
  xhr.setRequestHeader("apikey", API_KEY);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      if (callback) callback(data.length > 0);
    } else {
      alert("Login check failed. Status: " + xhr.status);
      if (callback) callback(false);
    }
  };
  xhr.send();
}

// ✅ 删除任务
function deleteTaskFromSupabase(taskId, callback) {
  var xhr = new XMLHttpRequest();
  var url = SUPABASE_URL + "/rest/v1/tasks?id=eq." + encodeURIComponent(taskId);
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader("apikey", API_KEY);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Prefer", "return=representation");
  xhr.onload = function () {
    if (xhr.status === 204) {
      if (callback) callback(true);
    } else {
      alert("Delete task failed. Status: " + xhr.status);
      if (callback) callback(false);
    }
  };
  xhr.send();
}

// ✅ 更新任务状态
function updateTaskStatus(taskId, newStatus, callback) {
  var xhr = new XMLHttpRequest();
  var url = SUPABASE_URL + "/rest/v1/tasks?id=eq." + encodeURIComponent(taskId);
  xhr.open("PATCH", url, true);
  xhr.setRequestHeader("apikey", API_KEY);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Prefer", "return=representation");
  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 204) {
      if (callback) callback(true);
    } else {
      alert("Update status failed. Status: " + xhr.status);
      if (callback) callback(false);
    }
  };
  xhr.send(JSON.stringify({ status: newStatus }));
}
