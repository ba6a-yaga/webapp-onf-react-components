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
            list:props.list
        }
    }

    showAllClickHandler(e) {
        this.setState({showAll:true})
    }
    onDelete(item, index) {
        
        this.state.list.splice(index, 1)
        this.setState({list:this.state.list})
    }
    render() {
        const {showAll, list} = this.state
        const {procurement_id, work_id, type_evaluation, type_comment, extended, className, currentUser, quality, terms, token} = this.props
        const comments = showAll ? list : list.slice(0, 2);
        return (
                <div className={`${className ? className: '' } card__list__item__comments`}>
                    <div id="wrapper__comments">
                        {comments && comments.map((item, index)=> {
                            return (
                                <Comment quality={quality} terms={terms} extended={extended} key={item.id} item={item} onDelete={(e) => {this.onDelete(item, index)}}></Comment>
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
                    <CommentInput action="/comments/create" procurement_id={procurement_id} work_id={work_id} type_evaluation={type_evaluation} type_comment={type_comment} token={token} quality={quality} terms={terms} extended={extended} currentUser={currentUser} />
                </div>
        )
    }
}

Comments.propTypes = {
    currentUser: PropTypes.object.isRequired
}

export default Comments

