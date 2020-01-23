import React, { Component } from 'react'
import "./index.scss"
import Avatar from '../avatar'
export class MemberCard extends Component {

    contentPreloader = [
        {width:"60%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:1},
        {width:"55%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:7},
    ]

    onDelete(e) {
        if (this.props.isDelete) {
            this.props.isDelete(this.props.index)
        }
    }

    render() {
        const {
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
                {!isLoading && <Avatar className="card__avatar" name={name} url={avatar}/>}
                {!isLoading && <h2 class="card__name m-0">{name}</h2>}
                {!isLoading && <div class="edit"></div>}
                {!isLoading && <div class="delete" onDelete={this.onDelete.bind(this)}></div>}
                {isLoading &&
                    <div className="member-card__preloader">
                        <div className="member-card__preloader-circle"></div>
                        {this.contentPreloader.map((item)=>{
                            return <div className="member-card__preloader-line" style={{...item}}></div>
                        })}
                    </div> 
                }
            </div>
        )
    }
}

export default MemberCard
