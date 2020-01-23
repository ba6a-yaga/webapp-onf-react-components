import React, { Component } from 'react'
import PropTypes from 'prop-types';

import "./index.scss";
class Category extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpened:false,
            maxHeight:0,
            objects:props.data.list, 
            value:props.data.name,
            savedValue:props.data.name,
            isEditing:false,
        }
    }

    /**
     * ссылка на поле ввода
     */
    inputRef = React.createRef()
    /**
     * ссылка на разворачиваемый элемент 
     */
    expandableRef = React.createRef()
    
    /**
     * обновляет состояние когда приходят новые пропсы в компонент
     */
    componentWillReceiveProps(props) {
        const startCount = this.state.objects.length
        this.setState({
            name:props.data.name,
            objects:props.data.list
        }, () => {
            this.updateHeight(this.state.isOpened, startCount > this.state.objects.length)
        })
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
     * Устанавливает значение состояния isOpened и обновляет значение высоты контента
     * @param {boolean} opened - развернут ли блок с контентом
     */
    setIsOpened(opened) {
        this.setState({
            isOpened:opened,
            maxHeight:this.getHeight(opened)
        })
    }

    /**
     * Обновляет высоту контента
     * @param {boolean} opened - развернут ли блок с контентом
     */
    updateHeight(opened) {
        this.setState({
            maxHeight:this.getHeight(opened)
        })
    }

    /**
     * Возвращает высоту контента для состояния opened
     * @param {boolean} opened - развернут ли блок с контентом
     */
    getHeight(opened) {
        console.log()
        return opened ? this.expandableRef.current.scrollHeight : 0
    }

    /**
     * Обработчик события нажатия на кнопку удалить
     * @param {Event} e - событие
     */
    deleteCategory(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();
        if (this.props.onDelete) {
            this.props.onDelete(this.props.index);
        }
    }

    /**
     * Обработчик события нажатия на кнопку редактировать
     * @param {Event} e - событие
     */
    editCategory(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();

        // Устанавливаю фокус на инпут
        this.inputRef.current.focus()
    }

    /**
     * Обработчик события нажатия добавить (+)
     * @param {Event} e - событие
     */
    addObject(e) {
        // Останавливаем дальнейшее распространение события на родителей этого элемента
        e.stopPropagation();

        // Разворачиваем контент чтобы было видно что элемент добавлен
        this.setState({isOpened:true}, ()=> {
            // После обновления состояния генерируем событие 
            this.props.onAdd(this.props.index)
        })
    }

    render() {
        const {data, index} = this.props
        const {isEditing, value} = this.state
        return (
            <div className={`category card__list__item ${this.state.isOpened ? "active" : ""}` }>
                <div 
                    className={`card__list__item__header ${this.props.children.length == 0 ? 'no-children': ''}`} 
                    onClick={(e) => {this.setIsOpened(!this.state.isOpened)}}
                >
                    <input 
                        className="flex-fill"
                        type="text" 
                        name={`categories[${index}]`} 
                        ref={this.inputRef} 
                        value={value} 
                        onClick={e => {e.stopPropagation()}}
                        onChange={e => this.onChange(e.target.value)} 
                        onBlur={e => this.blurHandler(e)}
                        onFocus={e => this.focusHandler(e)}
                    />
                    {!isEditing && <div className="add" onClick={e=> {this.addObject(e)}}></div>}
                    {!isEditing && <div className="edit" onClick={e=> {this.editHandler(e)}}></div>}
                    {!isEditing && <div className="delete" onClick={e=> {this.deleteCategory(e)}}></div>}
                    {isEditing && <div className="yes" onClick={e=> {this.applyHandler(e)}}></div>}
                    {isEditing && <div className="no" onMouseDown={e=> {this.cancelHandler(e)}}></div>}
                    <div className="arrow"></div>
                </div>
                <div className="card__list__item__content"  style={{height:this.state.maxHeight}}>
                    <div className="card__list__item__block object_list" ref={this.expandableRef} >
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
Category.propTypes = {
    data: PropTypes.object,
    onDelete:PropTypes.func,
    onAddObject:PropTypes.func
}
export default Category

