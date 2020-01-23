import React, { Component } from 'react'
import Avatar from '../avatar'

class UserCard extends Component {
    render() {
        const {name, avatar, subtitle} = this.props
        return (
            <div className={`${this.props.className ? this.props.className: '' } card__user`}>
                <Avatar className="card__avatar" name={name} url={avatar}/>
                <div className="d-flex flex-column">
                    <h2 className="card__name black m-0 ">{name}</h2>
                    <p className="role">{subtitle}</p>
                </div>
            </div>
        )
    }
}

export default UserCard