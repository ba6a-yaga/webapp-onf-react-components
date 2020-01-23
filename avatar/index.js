import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";
class Avatar extends Component {
    initialsFor(name) {
        return name ? name.split(/\s+/).map(word => {return word.length > 0 ? word[0] : ''}).join('').slice(0,2) : ''
    }
    
    render() {
        const {name, url} = this.props
        return (
            <span className="card__avatar">{url ?<img src={url}/> : this.initialsFor(name)}</span>
        )
    }
}

Avatar.propTypes = {
    // Ссылка на аватарку
    url: PropTypes.string,
    // Имя пользователя
    name: PropTypes.string.isRequired,
}
export default Avatar

