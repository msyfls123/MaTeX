import { DocumentBlock } from '.'
import { addImage } from '../helpers/image'

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
  - 嵌套1
  - 嵌套2
  1. 有序嵌套1
  1. 有序嵌套2
  1. 有序嵌套3
  - 嵌套3
    换行文本
    - 三重嵌套1
    - 三重嵌套2
- 无序列表3

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
    image: addImage(image),
  }
]
