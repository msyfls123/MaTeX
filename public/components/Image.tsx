import './Image.styl'

import React, { ChangeEventHandler, Component } from 'react'

import {
  addImage,
  getImage,
  removeImage,
} from '../helpers/image'

type ImageProps = {
  imgId?: number
  setImage: (imgId?: number) => void
}

export default class Image extends Component<ImageProps> {
  parseImage: ChangeEventHandler = (e) => {
    const { setImage } = this.props
    const file = (e.target as HTMLInputElement).files?.[0]
    const fr = new FileReader()
    if (file) {
      fr.onload = () => {
        addImage(fr.result as string).then((id) => {
          setImage(id)
        })
      }
      fr.readAsDataURL(file)
    }
  }
  render() {
    const { imgId, setImage } = this.props
    const hasImage = typeof imgId !== 'undefined'
    return <div className="image-selector">
      {!hasImage && <div className="image-input">
        插图
        <input
          type="file"
          accept="image/*"
          onChange={this.parseImage}
        />
      </div>}
      {hasImage && <div
        className="image-preview"
      >
        <img className="image" src={getImage(imgId)}/>
        <a className="remove" onClick={() => {
          if(window.confirm('删除该图片？')) {
            removeImage(imgId)
            setImage()
          }
        }}>×</a>
      </div>}
    </div>
  }
}
