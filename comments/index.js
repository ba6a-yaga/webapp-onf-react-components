import React, { Component,} from 'react'
import Avatar from '../avatar'
import PropTypes from 'prop-types';
import UserCard from '../user-card'
import "./index.scss";
import Comment from '../comment';
import CommentInput from '../comment-input';

class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAll:false,
            list:props.list, 
            newComments:[]
        }
    }

    /**
     * Метод окончания редактирования компонента
     * @param {*} e 
     * @param {*} data 
     */
    onCommentEditSubmit(e, data) {
        let comments = [...this.state.list, ...this.state.newComments] 
        let currentComment = comments.find(item => {
            return item.id == data.id
        })
        
        for (let key in currentComment) {
            currentComment[key] = data[key]
            console.log(key, data[key])
        }
        this.setState({newComments:this.state.newComments, list:this.state.list})

        // Сюда запихни фетч и примени сущность от сервера
        setTimeout(()=>{ 
            this.setState({newComments:this.state.newComments})
        }, 1000)

    }

    onCommentSubmit(e, data) {
        // Это временное решение 
        let comments = [...this.state.list, ...this.state.newComments] 
        var maxId = comments.reduce((accumulator, current)=> {
            return Math.max(accumulator, current.id ?? 0)
        }, 0)
        data.id = maxId + 1 // Это какой то временный id
        // Все дальше твоя логика только maxId это твой id от сервера
        this.state.newComments.push(data);
        this.setState({newComments:this.state.newComments})

        // Сюда запихни фетч и примени id
        setTimeout(()=>{ 
            data.id = maxId + 1
            this.setState({newComments:this.state.newComments})
        }, 1000)

    }

    showAllClickHandler(e) {
        this.setState({showAll:true})
    }

    /**
     * Обработка удаления комментария
     * @param {*} item 
     * @param {*} index 
     */
    onDelete(item, index) {
        this.state.list = this.state.list.filter(el => {
            return el.id !== item.id
        })
        this.state.newComments = this.state.newComments.filter(el => {
            return el.id !== item.id
        })

        this.setState({list:this.state.list, newComments:this.state.newComments})
    }

    render() {
        const {showAll, list, newComments} = this.state
        const {procurement_id, work_id, type_evaluation, type_comment, extended, className, currentUser, quality, terms, token} = this.props
        let comments = showAll ? list : list.slice(0, 2)
        comments = [...comments, ...newComments] 
        return (
                <div className={`${className ? className: '' } card__list__item__comments`}>
                    <div id="wrapper__comments">
                        {comments && comments.map((item, index)=> {
                            return (
                                <Comment 
                                    onCommentEditSubmit={this.onCommentEditSubmit.bind(this)}
                                    quality={quality} 
                                    terms={terms} 
                                    extended={extended}
                                    key={item.id} 
                                    item={item} 
                                    onDelete={(e) => {this.onDelete(item, index)}} 
                                />
                            )
                        })}
                    </div>
                    {list.length > 2 
                        && !showAll 
                        && <button 
                                type="button" 
                                className="btn btn-third card__list__item__comment__button"
                                onClick={this.showAllClickHandler.bind(this)}
                            >Показать все комментарии</button>}
                    <CommentInput 
                        onCommentSubmit={this.onCommentSubmit.bind(this)}
                        action="/comments/create" 
                        procurement_id={procurement_id} 
                        work_id={work_id} 
                        tag_quality={0}
                        tag_terms={0}
                        type_evaluation={type_evaluation} 
                        type_comment={type_comment} 
                        token={token} 
                        quality={quality} 
                        terms={terms} 
                        extended={extended} 
                        currentUser={currentUser} 
                    />
                </div>
        )
    }
}

Comments.propTypes = {
    currentUser: PropTypes.object.isRequired
}

export default Comments

