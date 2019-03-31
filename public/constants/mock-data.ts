import { DocumentBlock } from '.'

const image = require('!url-loader!../../media/arkdome.jpg')

const markdown = `
示例文本，
**加粗**，
_下划线_，
***下划线加粗***，
\`颜色\`，
\`\`\`
var a = 1;
var b = 2;
\`\`\`

# 标题1
## 标题2
### 标题3
#### 标题4

> 引用文本
> 引用文本

- 无序列表1
- 无序列表2

1. 有序列表
1. 有序列表

|表头1|表头2|
|---|---|
|表项1|表项2|
|表项3|表项4|

[链接](https://taobao.com)

-----

翻页啦！
`

export const mockedDocuments: DocumentBlock[] = [
  {
    markdown: markdown,
    image: image,
  }
]
