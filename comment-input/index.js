import React, { Component } from 'react'
import Avatar from '../avatar'
import PropTypes from 'prop-types';
import UserCard from '../user-card'
import "./index.scss";
import utils from '../comments/utils';
import Dropdown from '../dropdown';

export class CommentInput extends Component {
    textareaRef = React.createRef()
    fileInputRef = React.createRef()
    youtubeInputRef = React.createRef()
    timer

    constructor(props) {
        super(props)
        this.state = {
            message:(props.item && props.item.message) ? props.item.message : '' ,
            youtubeLink:"", 
            height:"0", 
            isYoutubeInputShow:props.isEditing,
            attachments:(props.item && props.item.attachments) ? props.item.attachments : []
        }
    }

    onSubmit = (e) => {
        e.stopPropagation();
        let data = new FormData(e.target)
        // TODO тут возможно нужна будет дополнительная какая-то логика по обновлению списка
        return false
    } 

    componentWillReceiveProps() {
        this.setState({
            message:this.props.message ? this.props.message : '' ,
        }, this.autoGrow)
    }
    
    componentDidMount(){
        this.autoGrow()
    }

    onCommentSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * Обработчик события редактирования текста в комментарии
     * @param {Event} e - событие
     */
    onChange(e) {
        // применяем текст
        this.setState({message:e.target.value})
        this.autoGrow(e.target)
    }

    onImageInputClick(e) {
        this.fileInputRef.current.click();
    }
    
    onVideoInputClick() {
        this.setState({isYoutubeInputShow:!this.state.isYoutubeInputShow})
    }
    onYoutubeInputChange(e) {
        const value = e.target.value
        const videoId = utils.youtubeParser(value)
        this.setState({youtubeLink:e.target.value})
        clearTimeout(this.timer)
        this.timer = setTimeout(()=> {
            if (videoId.length == 11) {
                let attachments = this.state.attachments.filter(item=> {
                    return !utils.youtubeParser(item)
                })
                attachments.push(value);  
                this.setState({attachments:attachments})
            }
        }, 1000)
    }

    onYoutubeLinkSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const value = this.youtubeInputRef.current.value
        const videoId = utils.youtubeParser(value)
        if (!videoId) {
            alert("Ссылка должна вести на youtube.com")
        } else {
            this.youtubeInputRef.current.blur()
        }
        return false
    }

    onImagesChange(e) {
        const files = [...this.fileInputRef.current.files];
        files.forEach((file) => {
            var reader = new FileReader();  
            reader.onload = (e) => {
                this.state.attachments.push(reader.result);  
                this.setState({attachments:this.state.attachments})
            }
            reader.readAsDataURL(file);
        });
    }

    onAttachmentDelete(item, index) {
        this.state.attachments.splice(index, 1);  
        this.setState({attachments:this.state.attachments})
    }

    getAttachment(url, i) {
        const videoId = utils.youtubeParser(url)
        return (
            videoId
            ? <div key={i} className="video" onClick={(e)=>{this.onAttachmentDelete(url, i)}}>
                <img src={`http://img.youtube.com/vi/${videoId}/1.jpg`} alt="" />
            </div>
            : <div key={i} className="image"  onClick={(e)=>{this.onAttachmentDelete(url, i)}}>
                <img src={url} alt="" />
            </div>
        )
    }
    
    autoGrow() {    
        if (this.textareaRef.current.style.height === "0px") {
            this.textareaRef.current.classList.add("notransition")
            var scrollHeight = this.textareaRef.current.scrollHeight + 2;
            this.textareaRef.current.style.height = "auto"
            this.setState({height:(scrollHeight + 2)  + "px"})
            setTimeout(()=> {
                this.textareaRef.current.classList.remove("notransition")
            }, 20)

        } else {
            this.setState({height:(this.textareaRef.current.scrollHeight + 2)  + "px"})
        }
    }

    render() {
        const {message, attachments, youtubeLink, isYoutubeInputShow} = this.state
        const {extended, currentUser, isEditing, quality, terms} = this.props
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="file"  accept="image/*" onChange={this.onImagesChange.bind(this)} ref={this.fileInputRef} hidden />
                <div className={`card__list__item__comment__add ${isEditing ? 'editing' : ''} ${extended ? 'extended' : 'simple'}`}>
                    {!isEditing && <Avatar className="card__avatar" name={currentUser.name} url={currentUser.avatar}/>}
                    <div className="card card__list__item__comment__text_container">
                        <div className="card card__list__item__comment__text edit">
                            <span className="input_form textarea_form">
                                {!isEditing && <label id="txt2" htmlFor="message" className={`label form-input__label ${message !== '' ? 'full' : ''}`}>Добавьте комментарий</label>}
                                <textarea 
                                    ref={this.textareaRef}
                                    className="card__list__item__comment__textarea" 
                                    type="text"
                                    id="message"
                                    onChange={this.onChange.bind(this)}
                                    name="message"
                                    value={message}
                                    style={{height:this.state.height}}
                                ></textarea>
                            </span>
                            
                            {extended && !isEditing && <div className="attach_button">
                                <span className="images"onClick={this.onImageInputClick.bind(this)}></span>
                                <span className="video" onClick={this.onVideoInputClick.bind(this)}></span>
                            </div>
                            }

                            {extended && (isEditing || attachments.length > 0) && <div className="card__list__item__comment__attach">
                                {attachments.map((attachment, i) => {
                                    return this.getAttachment(attachment, i)
                                })}
                                <div className="image_add" onClick={this.onImageInputClick.bind(this)}></div>
                            </div>}

                            {extended && isYoutubeInputShow&& <span className="input_form card__list__item__comment__edit_form youtube">
                                <input onChange={this.onYoutubeInputChange.bind(this)} type="text" ref={this.youtubeInputRef} placeholder="Cсылка на YouTube" value={youtubeLink} />
                            </span>}
                            
                            {extended && <div className="card__list__item__comment__selectors">
                                <Dropdown options={quality} selected={0}></Dropdown>
                                <Dropdown options={terms} selected={0}></Dropdown>
                            </div>}
                            {!extended && <label className="checkbox_container">Есть нарушения
                                <input type="checkbox" name="offence" />
                                <span className="checkmark"></span>
                            </label>}
                        </div>
                    </div>
                    <button type="submit" className={`btn btn-main btn-small ${isEditing ? 'btn-check' : "btn-send"} ml-3`}></button>
                </div>
                
            </form>
        )
    }
}

export default CommentInput