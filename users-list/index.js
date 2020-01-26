import React, { Component } from 'react'
import Expandable from '../expandable'
import UserCard from '../user-card'
import './index.scss'

export class UsersList extends Component {
    render() {
        const {title, className, data} = this.props
        return (
            <div className={`${className ? className: '' } users-list`}>
                <h2>{title}</h2>
                <div className="card card__list mb-5">
                    <Expandable>
                        <Expandable.Header>
                            <span>Пользователи</span>
                        </Expandable.Header>
                        <Expandable.Content>
                            <div className="card__list__item__block d-flex flex-column">
                                <div className="card__list__users">
                                    {data.map((item, index)=>{
                                        return <UserCard
                                            key={index}
                                            className="d-inline-flex flex-row card__text mb-2 align-items-center" 
                                            fullname={item.fullname} 
                                            photo_url={item.photo_url} 
                                            type_member={item.type_member}
                                            user_id={item.id}
                                        />
                                    })}
                                </div>
                            </div>
                        </Expandable.Content>
                    </Expandable>
                </div>
            </div>
        )
    }
}

export default UsersList
