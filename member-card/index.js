import React, { Component } from 'react'
import "./index.scss"
import Avatar from '../avatar'
export class MemberCard extends Component {

    contentPreloader = [
        {width:"60%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:8},
        {width:"55%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:7},
    ]

    onDelete(e) {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.index)
        }
    }

    render() {
        const {
            id, 
            name, 
            avatar,
            className,
            isLoading
        } = this.props
        return (
            <div 
                className={[
                    'member-card',
                    'user',
                    'card',
                    'card__text',
                    'card__small',
                    className ? className: '',
                ].filter(item=>item).join(' ')}
            >   
                {!isLoading
                ? [
                    <Avatar className="card__avatar" name={name} url={avatar}/>,
                    <h2 className="card__name m-0">{name}</h2>,
                    <a href={`article/edit/${id}`}  className="edit" ></a>,
                    <div className="delete" onClick={this.onDelete.bind(this)}></div>,
                ]
                : <div className="member-card__preloader">
                        <div className="member-card__preloader-circle"></div>
                        <div>
                            {this.contentPreloader.map((item)=>{
                                return <div className="member-card__preloader-line" style={{...item}}></div>
                            })}
                        </div>  
                    </div> 
                }
            </div>
        )
    }
}

export default MemberCard
