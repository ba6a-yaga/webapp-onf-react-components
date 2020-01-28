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
    
    onCommentSubmit(e, data) {
        data.id = this.props.item.id
        data.user = this.props.item.user
        if (this.props.onCommentEditSubmit) {
            this.props.onCommentEditSubmit(e, data)
            this.setState({isEditing:false})
        }
    }

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

    getPhoto(url, i) {
        return (
            <div key={i} className="image">
                 <a href={url} target="_blank"><img src={url} alt="" /></a>
            </div>
        )
    }

    getVideo(url, i) {
        const videoId = utils.youtubeParser(url)
        if (videoId) {
            return (
                <div key={i} className="video">
                    <a href={url} target="_blank"><img src={`http://img.youtube.com/vi/${videoId}/1.jpg`} alt="" /></a>
                </div> 
            )
        } 
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
        console.log("[LOG]"+item.tag_quality)
        console.log(quality)
        console.log(terms)
        return (
            <div className={`card__list__item__comment ${isEditing ? 'editing':'' }`}>
                <div className="card__list__item__comment__header">
                    <div className="card__list__item__comment__card">
                        <Avatar className="card__avatar" fullname={item.user && item.user.fullname} photo_url={item.user && item.user.photo_url}/>
                        <div className="card__list__item__comment__name">
                            <h2>{item.user && item.user.fullname}</h2>
                            <span className="card__subtitle">{item.created_at}</span>
                        </div>
                    </div>
                    <div className="card__list__item__comment__tag__container">
                        {!extended
                            ? <span className={`card__list__item__comment__tag ${this.getOffenceColor(item.is_propblem)}`}>
                                    {this.getOffenceTitle(item.is_propblem)}
                                </span> 
                            : null
                        }
                        {extended && item.tag_quality !== undefined 
                            ? <span className={`card__list__item__comment__tag ${this.getStatusColors(item.tag_quality)}`}>{quality[item.tag_quality+ 1].name}</span> 
                            : null
                        }
                        {extended && item.tag_terms !== undefined 
                            ? <span className={`card__list__item__comment__tag ${this.getStatusColors(item.tag_terms)}`}>{terms[item.tag_terms+ 1].name}</span> 
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
                            ? <CommentInput
                                onCommentSubmit={this.onCommentSubmit.bind(this)}
                                action={`/comments/${item.id}`}
                                quality={quality} 
                                terms={terms} 
                                extended={extended} 
                                currentUser={currentUser} 
                                isEditing={true} 
                                item={item}
                                photo_url={item.photo_url}
                                video_url={item.video_url}
                            /> 
                            : <div className="card__list__item__comment__text">
                                {item.text}
                                {
                                    (item.photo_url && item.photo_url.length > 0 || item.video_url && item.video_url.length > 0) && 
                                    <div className="card__list__item__comment__attach">
                                        {item.photo_url && ((typeof item.photo_url === "string") ?
                                            this.getPhoto(item.photo_url, "photo_" + 0) :
                                            item.photo_url.map((attachment, i) => {
                                                return this.getPhoto(attachment, "photo_" + (i + 1))
                                            })
                                        )}
                                        {item.video_url && ((typeof item.video_url === "string") ?
                                            this.getVideo(item.video_url, "video_" + 0) :
                                            item.video_url.map((attachment, i) => {
                                                return this.getVideo(attachment,  "video_" + (i + 1))
                                            })
                                        )}
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
