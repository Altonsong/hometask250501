
// 页面加载时获取所有冷冻物品
window.onload = function () {
  getFreezeItems(function (items) {
    displayItems(items);
  });
};

// 添加物品到指定冷冻设备
function addItem(freezerType) {
  var itemName = document.getElementById('itemName').value.trim();
  
  if (!itemName) {
    alert('Please enter an item name');
    return;
  }

  var item = {
    item_name: itemName,
    freezer_type: freezerType
  };

  addFreezeItem(item, function(success) {
    if (success) {
      document.getElementById('itemName').value = '';
      // 重新加载数据
      getFreezeItems(function (items) {
        displayItems(items);
      });
    } else {
      alert('Failed to add item');
    }
  });
}

// 删除物品
function deleteItem(itemId) {
  if (confirm('Are you sure you want to remove this item?')) {
    deleteFreezeItem(itemId, function(success) {
      if (success) {
        // 重新加载数据
        getFreezeItems(function (items) {
          displayItems(items);
        });
      } else {
        alert('Failed to delete item');
      }
    });
  }
}

// 显示物品到各个冷冻设备框中
function displayItems(items) {
  // 清空所有容器
  var freezerTypes = ['LG', 'Hisense', 'Danny', 'Cold Room'];
  freezerTypes.forEach(function(type) {
    document.getElementById(type + '-items').innerHTML = '';
  });

  // 按冷冻设备分组显示
  items.forEach(function(item) {
    var container = document.getElementById(item.freezer_type + '-items');
    if (container) {
      var itemElement = document.createElement('div');
      itemElement.className = 'item';
      itemElement.innerHTML = 
        '<span class="item-name">' + item.item_name + '</span>' +
        '<button class="delete-item-btn" onclick="deleteItem(' + item.id + ')">×</button>';
      container.appendChild(itemElement);
    }
  });
}
