
// 瀑布流布局函数
function initMasonryLayout() {
  const container = document.querySelector('.freezers-container');
  const items = document.querySelectorAll('.freezer-box');
  
  if (!container || items.length === 0) return;
  
  // 初始化列高度
  const columnHeights = [0, 0]; // 两列
  const gap = window.innerWidth > 700 ? 20 : 15;
  
  items.forEach((item, index) => {
    // 找到最短的列
    const shortestColumnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
    
    // 计算位置
    const left = shortestColumnIndex === 0 ? 0 : `calc(50% + ${gap/2}px)`;
    const top = columnHeights[shortestColumnIndex];
    
    // 设置位置
    item.style.left = left;
    item.style.top = top + 'px';
    
    // 获取项目高度并更新列高度
    const itemHeight = item.offsetHeight;
    columnHeights[shortestColumnIndex] += itemHeight + gap;
  });
  
  // 设置容器高度
  const maxHeight = Math.max(...columnHeights) - gap;
  container.style.height = maxHeight + 'px';
}

// 页面加载后初始化布局
document.addEventListener('DOMContentLoaded', function() {
  // 延迟执行以确保所有内容都已渲染
  setTimeout(initMasonryLayout, 100);
});

// 窗口大小改变时重新布局
window.addEventListener('resize', function() {
  setTimeout(initMasonryLayout, 100);
});

// 当内容发生变化时重新布局
function refreshMasonryLayout() {
  setTimeout(initMasonryLayout, 50);
}
