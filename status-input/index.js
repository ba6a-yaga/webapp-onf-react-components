import React, { Component } from 'react'
import PropTypes from 'prop-types';

import "./index.scss";
class StatusInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value:props.value,
            savedValue:props.value,
            isEditing:false
        }
    }
    /**
     * ссылка на поле ввода
     */
    inputRef = React.createRef()

    /**
     * обработчикк события нажатия на кнопку редактирования
     * @param {Event} e 
     */
    editHandler(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();
        // Устанавливаю фокус на инпут
        this.inputRef.current.focus()
    }

    /**
     * Обработчик события нажатия на кнопку применения
     * @param {Event} e - событие
     */
    applyHandler(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();
        this.setState( {
            value:this.state.value,
            savedValue:this.state.value,
        })
        // Заканчиваем редактирование, переводим на обычное состояние 
        this.setState({isEditing:false})

        // генерируем событие о том что текст был изменен        
        if (this.props.onChange) {
            this.props.onChange(this.state.value)
        }
    }

    /**
     * Обработчик события нажатия на кнопку отмены
     * @param {Event} e - событие
     */
    cancelHandler(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();
        // сбрасываем значение до последнего сохраненного
        this.setState({
            value:this.state.savedValue,
            savedValue:this.state.savedValue,
        })
        
        // Заканчиваем редактирование, переводим на обычное состояние 
        this.setState({isEditing:false})
    }

    /**
     * Обработчик события увода фокуса с инпута
     * @param {Event} e - событие
     */
    blurHandler(e) {
        // Применяем изменения в текстовом поле
        this.applyHandler(e)
    }

    /**
     * Обработчик события фокуса на инпуте
     * @param {Event} e - событие
     */
    focusHandler(e) {
        this.setState({isEditing:true})
    }

    /**
     * Обработчик события редактирования в инпуте
     * @param {Event} e - событие
     */
    onChange(newValue) {
        // Временно применяем текст, до завершения редактирования
        this.setState({value:newValue})
    }

    render() {
        const {name, index} = this.props
        const {isEditing, value} = this.state
        return (
            <div className={`card__list__item__object ${isEditing ?"active": ""} ${this.props.className ? this.props.className: '' } status-input`}>
                <input
                    className="flex-fill"
                    type="text" 
                    name={`${name}[${index}]`} 
                    ref={this.inputRef} 
                    value={value} 
                    onClick={e => {e.stopPropagation()}}
                    onChange={e => this.onChange(e.target.value)} 
                    onBlur={e => this.blurHandler(e)}
                    onFocus={e => this.focusHandler(e)}
                />
                <div className="edit"  onClick={e=> {this.editHandler(e)}}></div>
                <div className="yes" onClick={e=> {this.applyHandler(e)}}></div>
                <div className="no" onMouseDown={e=> {this.cancelHandler(e)}}></div>
            </div>
        )
    }
}

StatusInput.propTypes = {
    // Название параметра который будет отправлен на сервер
    name: PropTypes.string.isRequired,
    // Порядковый номер нужно для поля name
    index: PropTypes.number.isRequired,
    // Значение записанное в input
    value: PropTypes.string.isRequired,
    // колбек для примененных изменений в текстовом поле
    onChange:PropTypes.func,
}
export default StatusInput

