import React, { FunctionComponent } from 'react'
import cloneDeep from 'lodash/cloneDeep'

import './Header.styl'

type Description = [string, string, string, string]
export const emptyDescription: Description =
  process.env.NODE_ENV === 'production' ?
  ['', '', '', ''] :
  ['1.1.1.1', '张全蛋工程师', '20190302', '发动机主体设计，优化点火方式']

export type HeaderProps = {
  title: string
  description: Description[]
  onChangeTitle: (text: string) => void
  onChangeDescription: (desc: Description[]) => void
}

const placeholders = [
  '版本号',
  'PM',
  '时间',
  '内容',
]

const Header: FunctionComponent<HeaderProps> = ({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}) => {
  return (
    <div className="matex-header">
      <div className="title">
        <input
          className="input-title"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="文档标题"
        />
      </div>
      <ul className="description">
        {description.map((line, i) => <li key={i}>
          {line.map((value, d) => (
            <input
              key={d}
              className="input-description"
              value={value}
              onChange={(e) => {
                const clonedDescription = cloneDeep(description)
                clonedDescription[i][d] = e.target.value
                onChangeDescription(clonedDescription)
              }}
              placeholder={placeholders[d]}
            />
          ))}
          <a
            onClick={() => {
              const clonedDescription = cloneDeep(description)
              clonedDescription.splice(i+1, 0, emptyDescription)
              onChangeDescription(clonedDescription)
            }}
          >+</a>
          {description.length > 1 && <a
            onClick={() => {
              const clonedDescription = cloneDeep(description)
              clonedDescription.splice(i, 1)
              onChangeDescription(clonedDescription)
            }}
          >-</a>}
        </li>)}
      </ul>
    </div>
  )
}

export default Header
