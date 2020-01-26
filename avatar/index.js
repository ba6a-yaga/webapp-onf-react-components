import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";
class Avatar extends Component {
    initialsFor(name) {
        return name ? name.split(/\s+/).map(word => {return word.length > 0 ? word[0] : ''}).join('').slice(0,2) : ''
    }
    
    render() {
        const {fullname, photo_url} = this.props
        return (
            <span className="card__avatar">{photo_url ?<img src={photo_url}/> : this.initialsFor(fullname)}</span>
        )
    }
}

Avatar.propTypes = {
    // Ссылка на аватарку
    photo_url: PropTypes.string,
    // Имя пользователя
    fullname: PropTypes.string.isRequired,
}
export default Avatar

