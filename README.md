GitHub 题库配置与维护指南
题库文件结构
Youyuuuu.github.io/
├── data/
│   ├── questions.json   # 题库数据文件
│   └── config.json      # AnswererWrapper配置
└── README.md            # 本说明文档
题库数据规范
题目ID格式

{
  "id": "类型前缀-序号",  // 示例: single-1 / multi-56 / judge-191
  "type": "题目类型",     // single/multiple/judgement
  "title": "题目标题",
  "options": ["选项A", "选项B"],
  "answer": "答案"
}

类型对照表 | ID前缀 | 类型字段 | 说明 | | ---- | ---- | ---- | | single | single - choice | 单选题 | | multi | multiple | 多选题 | | judge | judgement | 判断题 |

AnswererWrapper配置
基础配置 (config.json)
[
{
  "name": "地理知识题库",
  "url": "https://raw.githubusercontent.com/Youyuuuu/Youyuuuu.github.io/main/data/questions.json",
  "method": "get",
  "contentType": "json",
  "handler": "return res.map(q => [q.title, formatAnswer(q)])"
}
]
答案处理逻辑
// 多选答案处理示例
function formatAnswer(question) {
  return question.type === 'multiple' ? 
         question.answer.join('#') : 
         question.answer
}

特殊占位符使用
可用占位符
占位符	替换内容
${title}	题目标题
${type}	题目类型
${options}	选项（换行分隔）
配置示例	  

{
  "data": {
    "question": "${title}",
    "formatType": {
      "handler": "return env.type === 'single' ? 1 : 2"
    }
  }
}

维护指南
添加新题目 编辑 questions.json 文件，按规范添加条目：
{
  "id": "multi - 57",
  "type": "multiple",
  "title": "2.青海省的国家级非物质文化遗产包括哪些？",
  "options": ["A.热贡艺术", "B.土族盘绣", "C.湟中堆绣"],
  "answer": ["A", "B", "C"]
}
更新配置
// 修改handler逻辑示例
"handler": "return res.map(q => ({ 
  id: q.id,
  answer: q.type === 'judgement' ? 
         (q.answer === 'A' ? '正确' : '错误') : 
         q.answer
}))"
重要注意事项
跨域配置 在油猴脚本头部添加：
// ==UserScript==
// @connect     raw.githubusercontent.com
// ==/UserScript==
多选题规范 答案必须用 # 分隔： "answer": ["B", "C", "D"] → 解析为 "B#C#D"
自动化校验 GitHub Actions 将检查：
ID格式合法性
答案与选项匹配性
题目类型有效性
测试方法
接口验证
curl https://raw.githubusercontent.com/Youyuuuu/Youyuuuu.github.io/main/data/questions.json
OCS脚本调用
new AnswererWrapper(
  {
    elements: document.querySelectorAll('.quiz - item'),
    request: {
      url: 'https://raw.githubusercontent.com/Youyuuuu/Youyuuuu.github.io/main/data/config.json'
    }
  },
  results => console.log(results)
)
本配置完全遵循 OCS题库规范，如需更多技术细节，请参考官方文档。

