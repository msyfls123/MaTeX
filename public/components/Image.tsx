import React, { Component, ChangeEventHandler } from 'react'

import './Image.styl'

type ImageProps = {
  dataURL?: string
  setImage: (dataURL?: string) => void
}

export default class Image extends Component<ImageProps> {
  parseImage: ChangeEventHandler = (e) => {
    const { setImage } = this.props
    const file = (e.target as HTMLInputElement).files[0]
    const fr = new FileReader()
    if (file) {
      fr.onload = () => {
        setImage(fr.result as string)
      }
      fr.readAsDataURL(file)
    }
  }
  render() {
    const { dataURL, setImage } = this.props
    return <div className="image-selector">
      {!dataURL && <div className="image-input">
        插图
        <input
          type="file"
          accept="image/*"
          onChange={this.parseImage}
        />
      </div>}
      {dataURL && <div
        className="image-preview"
      >
        <img className="image" src={dataURL}/>
        <a className="remove" onClick={() => {
          if(window.confirm('删除该图片？')) {
            setImage()
          }
        }}>×</a>
      </div>}
    </div>
  }
}
