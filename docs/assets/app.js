// 从 GitHub 加载题库数据
async function loadQuestions() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Youyuuuu/Youyuuuu.github.io/main/data/questions.json');
    if (!response.ok) throw new Error('题库加载失败');
    return await response.json();
  } catch (error) {
    console.error('题库加载错误:', error);
    return [];
  }
}

// 渲染题目列表
function renderQuestions(questions) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  
  if (questions.length === 0) {
    container.innerHTML = '<div class="no-results">没有找到匹配的题目</div>';
    return;
  }
  
  questions.forEach(q => {
    const card = document.createElement('div');
    card.className = `question-card ${q.type}`;
    card.dataset.id = q.id;

    
    // 生成选项HTML
    const optionsHtml = q.options.map(opt => {
      const isCorrect = Array.isArray(q.answer) 
        ? q.answer.some(a => opt.startsWith(a))
        : opt.startsWith(q.answer);
      
      return `<div class="option ${isCorrect ? 'correct' : ''}">${opt}</div>`;
    }).join('');
    
    card.innerHTML = `
      <div class="question-header">
        <span class="question-id">${q.id}</span>
        <span class="question-type">${getTypeLabel(q.type)}</span>
      </div>
      <h3 class="question-title">${q.title}</h3>
      <div class="options">${optionsHtml}</div>
      <div class="answer-info">
        <strong>正确答案：</strong>
        <span class="correct-answer">${formatAnswer(q.answer, q.type)}</span>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // 更新最后修改时间
  document.getElementById('last-updated').textContent = new Date().toLocaleString();
}

// 辅助函数：获取题型标签
function getTypeLabel(type) {
  const labels = {
    'single': '单选题',
    'multiple': '多选题',
    'judgement': '判断题'
  };
  return labels[type] || type;
}

// 辅助函数：格式化答案显示
function formatAnswer(answer, type) {
  if (type === 'multiple') {
    return answer.join('、');
  }
  return answer;
}

// 初始化页面
async function init() {
  const questions = await loadQuestions();
  window.allQuestions = questions; // 保存到全局变量
  
  // 初始渲染
  renderQuestions(questions);
  
  // 设置搜索功能
  document.getElementById('search').addEventListener('input', filterQuestions);
  document.getElementById('type-filter').addEventListener('change', filterQuestions);
}

// 题目过滤
function filterQuestions() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const type = document.getElementById('type-filter').value;
  
  const filtered = window.allQuestions.filter(q => {
    // 分类过滤
    
    // 类型过滤
    if (type && q.type !== type) return false;
    
    // 搜索过滤
    if (searchTerm) {
      const inTitle = q.title.toLowerCase().includes(searchTerm);
      const inOptions = q.options.some(opt => opt.toLowerCase().includes(searchTerm));
      return inTitle || inOptions;
    }
    
    return true;
  });
  
  renderQuestions(filtered);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
