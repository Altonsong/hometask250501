
// 瀑布流布局函数 - 兼容老版本浏览器
function initMasonryLayout() {
  var container = document.querySelector('.freezers-container');
  var items = document.querySelectorAll('.freezer-box');
  
  if (!container || items.length === 0) return;
  
  // 检查屏幕宽度，700px以下使用单列布局
  if (window.innerWidth <= 700) {
    // 移动端单列布局
    var currentTop = 0;
    var gap = 15;
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.style.position = 'relative';
      item.style.left = '0';
      item.style.top = '0';
      item.style.width = '100%';
      item.style.marginBottom = gap + 'px';
    }
    
    container.style.height = 'auto';
    return;
  }
  
  // 桌面端两列瀑布流布局
  var columnHeights = [0, 0]; // 两列的高度
  var gap = 20;
  var columnWidth = 'calc(50% - 10px)';
  
  // 重置容器样式
  container.style.position = 'relative';
  
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    
    // 设置基本样式
    item.style.position = 'absolute';
    item.style.width = columnWidth;
    item.style.boxSizing = 'border-box';
    
    // 找到最短的列
    var shortestColumnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
    
    // 计算位置
    var left = shortestColumnIndex === 0 ? '0' : 'calc(50% + 10px)';
    var top = columnHeights[shortestColumnIndex];
    
    // 设置位置
    item.style.left = left;
    item.style.top = top + 'px';
    
    // 强制重新计算布局
    item.offsetHeight;
    
    // 获取项目实际高度并更新列高度
    var itemHeight = item.offsetHeight;
    columnHeights[shortestColumnIndex] += itemHeight + gap;
  }
  
  // 设置容器高度为最高列的高度
  var maxHeight = Math.max(columnHeights[0], columnHeights[1]) - gap;
  container.style.height = maxHeight + 'px';
}

// 页面加载后初始化布局
document.addEventListener('DOMContentLoaded', function() {
  // 延迟执行以确保所有内容都已渲染
  setTimeout(function() {
    initMasonryLayout();
  }, 100);
});

// 窗口大小改变时重新布局
window.addEventListener('resize', function() {
  setTimeout(function() {
    initMasonryLayout();
  }, 100);
});

// 当内容发生变化时重新布局
function refreshMasonryLayout() {
  setTimeout(function() {
    initMasonryLayout();
  }, 50);
}
