// 从 GitHub Raw 加载数据
fetch('https://raw.githubusercontent.com/你的用户名/仓库名/main/data/questions.json')
  .then(res => res.json())
  .then(questions => {
    const container = document.getElementById('quiz-container');
    
    // 渲染题目
    questions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.innerHTML = `
        <h3>${q.question}</h3>
        <div class="options">
          ${Object.entries(q.options).map(([key, val]) => `
            <div class="option">
              <input type="radio" name="${q.id}" id="${q.id}-${key}">
              <label for="${q.id}-${key}">${key}. ${val}</label>
            </div>
          `).join('')}
        </div>
        <button class="show-answer" data-id="${q.id}">显示答案</button>
        <div class="answer" id="answer-${q.id}"></div>
      `;
      container.appendChild(card);
    });

    // 答案显示交互
    document.querySelectorAll('.show-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.id;
        const answer = questions.find(q => q.id === qid).metadata.answerText;
        document.getElementById(`answer-${qid}`).innerHTML = `
          <div class="correct-answer">✅ 正确答案：${answer}</div>
        `;
      });
    });
  });
