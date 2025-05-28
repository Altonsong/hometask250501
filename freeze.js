// 页面加载时获取所有冷冻物品
window.onload = function () {
  getFreezeItems(function (items) {
    displayItems(items);
  });
};

// 数量控制函数
window.changeQuantity = function(change) {
  var quantityInput = document.getElementById('quantity');
  var currentValue = parseInt(quantityInput.value) || 1;
  var newValue = currentValue + change;

  if (newValue >= 1 && newValue <= 99) {
    quantityInput.value = newValue;
  }
}

// 添加物品到指定冷冻设备
window.addItem = function(freezerType) {
  var itemName = document.getElementById('itemName').value.trim();
  var quantity = parseInt(document.getElementById('quantity').value) || 1;

  if (!itemName) {
    alert('Please enter an item name');
    return;
  }

  // 检查是否已存在相同名称和冷冻设备的物品
  getFreezeItems(function(existingItems) {
    var existingItem = existingItems.find(function(item) {
      return item.item_name === itemName && item.freezer_type === freezerType;
    });

    if (existingItem) {
      // 如果物品已存在，更新数量
      var newQuantity = (existingItem.quantity || 1) + quantity;
      updateFreezeItemQuantity(existingItem.id, newQuantity, function(success) {
        if (success) {
          document.getElementById('itemName').value = '';
          document.getElementById('quantity').value = '1';
          // 局部更新显示
          updateItemDisplay(existingItem.id, newQuantity);
        } else {
          alert('Failed to update item quantity');
        }
      });
    } else {
      // 如果物品不存在，添加新物品
      var item = {
        item_name: itemName,
        freezer_type: freezerType,
        quantity: quantity
      };

      addFreezeItem(item, function(success) {
        if (success) {
          document.getElementById('itemName').value = '';
          document.getElementById('quantity').value = '1';
          // 重新加载数据（新增物品需要重新排序）
          getFreezeItems(function (items) {
            displayItems(items);
          });
        } else {
          alert('Failed to add item');
        }
      });
    }
  });
}

// 增加物品数量
window.increaseItem = function(itemId) {
  getFreezeItems(function(items) {
    var item = items.find(function(i) { return i.id === itemId; });
    if (!item) {
      alert('Item not found');
      return;
    }

    var currentQuantity = item.quantity || 1;
    var newQuantity = currentQuantity + 1;

    updateFreezeItemQuantity(itemId, newQuantity, function(success) {
      if (success) {
        // 局部更新显示
        updateItemDisplay(itemId, newQuantity);
      } else {
        alert('Failed to update item quantity');
      }
    });
  });
}

// 删除物品（数量递减）
window.deleteItem = function(itemId) {
  getFreezeItems(function(items) {
    var item = items.find(function(i) { return i.id === itemId; });
    if (!item) {
      alert('Item not found');
      return;
    }

    var currentQuantity = item.quantity || 1;

    if (currentQuantity > 1) {
      // 如果数量大于1，减少数量
      var newQuantity = currentQuantity - 1;
      updateFreezeItemQuantity(itemId, newQuantity, function(success) {
        if (success) {
          // 局部更新显示
          updateItemDisplay(itemId, newQuantity);
        } else {
          alert('Failed to update item quantity');
        }
      });
    } else {
      // 如果数量为1，确认删除整个物品
      if (confirm('This will completely remove "' + item.item_name + '" from ' + item.freezer_type + '. Are you sure?')) {
        deleteFreezeItem(itemId, function(success) {
          if (success) {
            // 删除DOM元素
            removeItemFromDisplay(itemId);
          } else {
            alert('Failed to delete item');
          }
        });
      }
    }
  });
}

// 局部更新item显示
function updateItemDisplay(itemId, newQuantity) {
  var itemElement = document.querySelector('[data-item-id="' + itemId + '"]');
  if (itemElement) {
    var itemNameSpan = itemElement.querySelector('.item-name');
    if (itemNameSpan) {
      var currentText = itemNameSpan.textContent;
      // 提取物品名称（去掉括号和数量部分）
      var itemName = currentText.replace(/\s*\(\d+\)$/, '');
      // 更新显示文本
      itemNameSpan.textContent = itemName + ' (' + newQuantity + ')';
    }
  }
}

// 从显示中移除item
function removeItemFromDisplay(itemId) {
  var itemElement = document.querySelector('[data-item-id="' + itemId + '"]');
  if (itemElement) {
    itemElement.remove();
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
      itemElement.setAttribute('data-item-id', item.id);

      // 格式化显示：物品名称 (数量)
      var quantity = item.quantity || 1;
      var displayText = item.item_name + ' (' + quantity + ')';

      itemElement.innerHTML = 
        '<span class="item-name">' + displayText + '</span>' +
        '<div class="item-buttons">' +
          '<button class="add-item-btn" onclick="increaseItem(' + item.id + ')">+</button>' +
          '<button class="delete-item-btn" onclick="deleteItem(' + item.id + ')">-</button>' +
        '</div>';
      container.appendChild(itemElement);
    }
  });

  // 重新布局瀑布流
  if (typeof refreshMasonryLayout === 'function') {
    refreshMasonryLayout();
  }
}