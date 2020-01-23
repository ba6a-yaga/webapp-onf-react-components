import React, { Component } from 'react'
import "./index.scss"
export class ImageInput extends Component {
    inputField = React.createRef()
    
    constructor(props) {
        super(props)
        
        this.state = {
            value: '',
            attachment:this.props.value
        }
    }
    onImagesChange(e) {

    }
    onImageInputClick(e) {
        e.preventDefault();
        this.inputField.current.click();
        return false
    }

    onImagesChange(e) {
        const files = [...this.inputField.current.files];
        files.forEach((file) => {
            var reader = new FileReader();  
            reader.onload = (e) => {
                this.setState({attachment:reader.result})
            }
            reader.readAsDataURL(file);
        });
    }

    render() {
        const {value, attachment} = this.state
        return (
            <div className={`image-input ${attachment ? 'image-input_loaded' : ''}`}>
                <input type="file" accept="image/*" onChange={this.onImagesChange.bind(this)} ref={this.inputField} hidden />
                {attachment 
                    ? <div className="image-input__content content">
                        <img src={attachment} alt="" />
                        <div className="change_button" onClick={this.onImageInputClick.bind(this)}>Изменить фото</div>
                    </div>
                    : <div className="image-input__photo-load photo_load">
                        <p>Вы можете добавить фото объемом максимум 5 Мб. в формате .jpg или .png</p>
                        <a className="mt-1" onClick={this.onImageInputClick.bind(this)}  href="/">Загрузить фото</a>
                    </div>
                }
            </div>
        )
    }
}

export default ImageInput
