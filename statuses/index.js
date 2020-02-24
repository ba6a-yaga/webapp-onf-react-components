import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";
import Category from '../category';
import CategoryObject from '../category-object';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import StatusInput from '../status-input';
class Statuses extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            list:props.data ? props.data : []
        }
    }
    
    /**
     * 
     * @param {object} item - ссылка на сущность в которой нужно изменить название 
     * @param {string} value - новое название
     */
    changeValue(item, value) {
        let action = this.props.name
        let id = item.id
        let body
        switch (action) {
            case 'qualities':
                body = JSON.stringify({'quality': {'name': value}})
                break
            case 'terms':
                body = JSON.stringify({'term': {'name': value}})
                break
            default:
                console.log('Данного экшена не существует')
                return
        }
        let url = new URL(`http://localhost:3000/${action}/${id}`)
        
        fetch(url, {
            method: 'PATCH',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            // console.log(response)
            return response.json()
        })
        .then(data => {
            if (data !== null && data !== undefined) {
                // console.log(data)
                item.name = value
                this.setState({list:this.state.list})      
            }
        })
    }

    render() {
        const {title, name} = this.props
        return (
            <div className={`${this.props.className ? this.props.className: '' } statuses`}>
                <div>
                    <h2>{title}</h2>
                    <div className="card card__list object_list mb-3">
                        <div className="card__list__item__block object_list single_list">
                        {this.state.list.map((status, index) => {
                            return (
                                <StatusInput 
                                    key={index}
                                    name={name} 
                                    value={status.name} 
                                    index={index}
                                    onChange={(value) => this.changeValue(status, value)}
                                />
                            )}
                        )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Statuses.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.array
}
export default Statuses

