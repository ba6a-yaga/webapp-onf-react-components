import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";

class CategoryObject extends Component {

    inputRef = React.createRef() 
    constructor(props) {
        super(props)
        this.state = {
            value:props.data.name,
            savedValue:props.data.name,
            isEditing:false,
        }
    }

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

    /**
     * Устанавливаем элемент как выделенный (не знаю зачем нужно, так было в верстке)
     * @param {Event} e - событие
     */
    toggleActive(e) {
        // Переключаем класс active
        e.target.classList.toggle('active')
    }

    render() {
        const { index, categoryIndex} = this.props
        const {isEditing, value} = this.state
        const onDelete = (e)=> {this.props.onDelete && this.props.onDelete(e, index, categoryIndex)}
        return (
            <div className="category-object card__list__item__object" onClick={this.toggleActive}>
                <input 
                    className="flex-fill"
                    type="text" 
                    ref={this.inputRef} 
                    name={`categories[${categoryIndex}][${index}]`}
                    value={value} 
                    onClick={e => {e.stopPropagation()}}
                    onChange={e => this.onChange(e.target.value)} 
                    onBlur={e => this.blurHandler(e)}
                    onFocus={e => this.focusHandler(e)}
                />
                {!isEditing && <div className="edit"  onClick={e=> {this.editHandler(e)}}></div>}
                {!isEditing && <div className="delete" onClick={onDelete}></div>}
                {isEditing && <div className="yes" onClick={e=> {this.applyHandler(e)}}></div>}
                {isEditing && <div className="no" onMouseDown={e=> {this.cancelHandler(e)}}></div>}

            </div>
        )
    }
}

CategoryObject.propTypes = {
    onDelete:PropTypes.func,
    onChange:PropTypes.func,
    categoryIndex:PropTypes.number.isRequired,
    index:PropTypes.number.isRequired,
}

export default CategoryObject

