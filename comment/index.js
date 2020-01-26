import React, { Component } from 'react'
import Avatar from '../avatar'
import CommentInput from '../comment-input'
import "./index.scss";
import utils from '../comments/utils';

export class Comment extends Component {
    deleteButtonRef = React.createRef()
    constructor(props) {
        super(props)
        this.state = {
            isEditing:false,
            isDeleting:false,
        }
    }

    statusColors = [
        "red",
        "orange",
        "green"
    ]
    

    getOffenceTitle(isOffence) {
        return isOffence ? "Есть нарушения" : "Нет нарушений";
    }

    getOffenceColor(isOffence) {
        return isOffence ? "red" : "green";
    }

    getStatusColors(status) {
        if (this.statusColors.length > status) {
            return this.statusColors[status]
        }
    }
    
    getAttachment(url, i) {
        const videoId = utils.youtubeParser(url)
        return (
            videoId ? 
            <div key={i} className="video">
                <a href={url} target="_blank"><img src={`http://img.youtube.com/vi/${videoId}/1.jpg`} alt="" /></a>
            </div> :
            <div key={i} className="image">
                 <a href={url} target="_blank"><img src={url} alt="" /></a>
            </div>
        )
    }

    editClickHandler(e) {
        this.setState({isEditing:!this.state.isEditing, isDeleting:false})
    }


    deleteClickHandler(e) {
        this.setState({isDeleting:true, isEditing:false})
    }
    
    onDeleteSubmit(e) {
        if (this.props.onDelete) {
            this.props.onDelete()
        }
    }

    onDeleteConfirm() {
        this.deleteButtonRef.current.click()
    }


    onDeleteCancel() {
        this.setState({isDeleting:false, isEditing:false})
    }
    render() {
        const {isEditing, isDeleting} = this.state
        const {item, extended, currentUser, quality, terms} = this.props
        
        return (
            <div className={`card__list__item__comment ${isEditing ? 'editing':'' }`}>
                <div className="card__list__item__comment__header">
                    <div className="card__list__item__comment__card">
                        <Avatar className="card__avatar" fullname={item.user.fullname} photo_url={item.user.photo_url}/>
                        <div className="card__list__item__comment__name">
                            <h2>{item.user.fullname}</h2>
                            <span className="card__subtitle">{item.created_at}</span>
                        </div>
                    </div>
                    <div className="card__list__item__comment__tag__container">
                        {!extended
                            ? <span className={`card__list__item__comment__tag ${this.getOffenceColor(item.isOffence)}`}>
                                    {this.getOffenceTitle(item.isOffence)}
                                </span> 
                            : null
                        }
                        {extended && item.quality !== undefined 
                            ? <span className={`card__list__item__comment__tag ${this.getStatusColors(item.quality.status)}`}>{item.quality.title}</span> 
                            : null
                        }
                        {extended && item.terms !== undefined 
                            ? <span className={`card__list__item__comment__tag ${this.getStatusColors(item.terms.status)}`}>{item.terms.title}</span> 
                            : null
                        }
                    </div>
                </div>
                <div className="card__list__item__comment__body">
                    <div className="card__list__item__comment__text__control">
                        <div className="card__list__item__comment__text__edit" onClick={e => {this.editClickHandler(e)}} ></div>
                        <div className="card__list__item__comment__text__delete" onClick={e => {this.deleteClickHandler(e)}} ></div>
                    </div>
                    {
                        isEditing
                            ? <CommentInput action={`/comments/${item.id}`} quality={quality} terms={terms} extended={extended} currentUser={currentUser} isEditing={true} item={item}/> 
                            : <div className="card__list__item__comment__text">
                                {item.message}
                                {item.attachments.length > 0 && <div className="card__list__item__comment__attach">
                                    {item.attachments.map((attachment, i) => {
                                        return this.getAttachment(attachment, i)
                                    })}
                                </div>
                                }
                            </div>
                    }
                </div>
                    {isDeleting && <span className="card__list__item__comment__text__confirm">
                            <span>Вы точно хотите удалить комментарий?</span>
                            <form 
                                action={`comments/${item.id}`} 
                                method="delete" 
                                data-remote="true" 
                                style={{display:"none"}}
                                onSubmit={this.onDeleteSubmit.bind(this)}
                            >
                                <input ref={this.deleteButtonRef} type="submit" />
                            </form>
                            <div className="yes" onClick={this.onDeleteConfirm.bind(this)}></div>
                            <div className="no" onClick={this.onDeleteCancel.bind(this)}></div>
                    </span> }
            </div>
        )
    }
}

export default Comment
