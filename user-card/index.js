import React, { Component } from 'react'
import Avatar from '../avatar'

class UserCard extends Component {
    render() {
        const {fullname, photo_url, type_member} = this.props
        return (
            <div className={`${this.props.className ? this.props.className: '' } card__user`}>
                <Avatar className="card__avatar" fullname={fullname} photo_url={photo_url}/>
                <div className="d-flex flex-column">
                    <h2 className="card__name black m-0 ">{fullname}</h2>
                    <p className="role">{type_member}</p>
                </div>
            </div>
        )
    }
}

export default UserCard