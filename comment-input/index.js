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

        
        let attachments = []
        if (props.photo_url !== undefined) {
            if (typeof props.photo_url === "string") {
                if (props.photo_url) {
                    attachments.push(props.photo_url)
                }
            } else {
                props.photo_url.forEach(element => {
                    attachments.push(element)
                });
            }
        }
        if (props.video_url !== undefined) {
            if (typeof props.video_url === "string") {
                if (props.video_url) {
                    attachments.push(props.video_url)
                }
            } else {
                props.video_url.forEach(element => {
                    attachments.push(element)
                });
            }
        }

        console.log(attachments)
        this.state = {
            text:(props.item && props.item.text) ? props.item.text : '' ,
            youtubeLink:"", 
            height:"0", 
            isYoutubeInputShow:props.isEditing,
            attachments:attachments
        }
    }

    onSubmit = (e) => {
        // console.log(this.props.token)
        e.stopPropagation();
        let data = new FormData(e.target)
        // TODO тут возможно нужна будет дополнительная какая-то логика по обновлению списка
        return false
    } 

    componentWillReceiveProps() {
        this.setState({
            text:this.props.text ? this.props.text : '' ,
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
                <input name="photo_url[]" type="text" value={url}  hidden readOnly/>
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
        const {text, attachments, youtubeLink, isYoutubeInputShow} = this.state
        const {procurement_id, work_id, type_evaluation, extended, currentUser, isEditing, quality, terms, action} = this.props
        return (
            <form action={action} data-remote="true" method="post" >
                <input name="file" type="file"  accept="image/*" onChange={this.onImagesChange.bind(this)} ref={this.fileInputRef} hidden />
                <input name="procurement_id" type="text" value={procurement_id}  hidden />
                {work_id !== undefined 
                    ?
                    <input name="work_id" type="text" value={work_id}  hidden />
                    :
                    <input name="type_evaluation" type="text" value={type_evaluation} hidden />
                }
                <div className={`card__list__item__comment__add ${isEditing ? 'editing' : ''} ${extended ? 'extended' : 'simple'}`}>
                    {!isEditing && <Avatar className="card__avatar" fullname={currentUser.fullname} photo_url={currentUser.photo_url}/>}
                    <div className="card card__list__item__comment__text_container">
                        <div className="card card__list__item__comment__text edit">
                            <span className="input_form textarea_form">
                                {!isEditing && <label id="txt2" htmlFor="message" className={`label form-input__label ${text !== '' ? 'full' : ''}`}>Добавьте комментарий</label>}
                                <textarea 
                                    ref={this.textareaRef}
                                    className="card__list__item__comment__textarea" 
                                    type="text"
                                    id="message"
                                    onChange={this.onChange.bind(this)}
                                    name="text"
                                    value={text}
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
                                <input onChange={this.onYoutubeInputChange.bind(this)} type="text" name="video_url" ref={this.youtubeInputRef} placeholder="Cсылка на YouTube" value={youtubeLink} />
                            </span>}
                            
                            {extended && <div className="card__list__item__comment__selectors">
                                <Dropdown options={quality} selected={0}></Dropdown>
                                <Dropdown options={terms} selected={0}></Dropdown>
                            </div>}
                            {!extended && <label className="checkbox_container">Есть нарушения
                                <input type="checkbox" name="is_propblem" />
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
