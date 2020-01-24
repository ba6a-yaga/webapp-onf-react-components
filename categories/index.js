import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";
import Category from '../category';
import CategoryObject from '../category-object';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
class Categories extends Component {
    
    constructor(props) {
        super(props)
        // Переделываю массив таким образом чтобы там внутри были нужные id которые я буду использовать для параметра key
        this.state = {
            categories:props.data 
        }
    }
    
    /**
     * Добавление новой категории в список
     */
    addCategory() {
        fetch("http://localhost:3000/procurement_categories/create", {
            method: 'PUT',
            body: JSON.stringify({category: {name: "Новый Перечень"}}),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            if (response.status === 201) { 
                // добавляю новую категорию
                this.state.categories.push(
                    {
                    name:"Новая категория",
                        list:[]
                    }
                )
                // обновляю состояние с новой категорией
                this.setState({categories:this.state.categories})
            } else if (response !== null) {
                return response.json()
            }
        })
        .then(data => {
            if (data !== null) {
                console.log(data)
            }
        })
    }

    /**
     * Удаление категории из списка
     */
    deleteCategory(categoryIndex) {
        let id = this.state.categories[categoryIndex]['id'] 
        let url = new URL(`http://localhost:3000/procurement_categories/${id}`)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            if (response.status === 200) {
                // удаляю выбранную категорию из массива
                this.state.categories.splice(categoryIndex, 1)

                // обновляю состояние с удаленной категорией
                this.setState({categories:this.state.categories})

                return response.json()
            }
        })
        .then(data => {
            if (data !== null) {
                console.log(data)
            }
        })
    }

    /**
     * добавление нового объекта в категорию
     * @param {number} categoryIndex - порядковый номер категории в которую нужно добавить объект
     */
    addObject(categoryIndex) { 
        fetch("http://localhost:3000/category_objects/create", {
            method: 'PUT',
            body: JSON.stringify({'object': {
                'name': 'Новый Объект',
                'category_procurement_id': this.state.categories[categoryIndex].id}
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            if (response.status === 201) {
                // получаю максимальное значение id объекта чтобы добавить уникальный id для нового объекта
                var maxId = this.state.categories[categoryIndex].list.reduce((accumulator, current)=> {
                    return Math.max(accumulator, current.id)
                }, 0)
                
                // добавляю новый объект
                this.state.categories[categoryIndex].list.push({name:"Новый объект", id:maxId + 1})

                // обновляю состояние с новым объектом в категории
                this.setState({categories:this.state.categories})
            } else if (response !== null) {
                return response.json()
            }
        })
        .then(data => {
            if (data !== null) {
                console.log(data)
            }
        })
    }

    /**
     * 
     * @param {number} categoryIndex - порядковый номер категории
     * @param {number} index  - порядковый номер объекта который нужно удалить
     */
    deleteObject(categoryIndex, index) {
        let id = this.state.categories[categoryIndex].list[index]['id'] 
        let url = new URL(`http://localhost:3000/category_objects/${id}`)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            if (response.status === 200) {
                this.state.categories[categoryIndex].list.splice(index, 1)
                this.setState({categories:this.state.categories})
                return response.json()
            }
        })
        .then(data => {
            if (data !== null) {
                console.log(data)
            }
        })
    }

    /**
     * 
     * @param {object} item - ссылка на сущность (категория или объект) в которой нужно изменить название 
     * @param {string} value - новое название
     */
    changeName(item, value) {
        let id, url, body
        if (item.list !== undefined) {
            id = item.id 
            url = new URL(`http://localhost:3000/procurement_categories/${id}`)
            body = JSON.stringify({'category':{'name':value}})
        } else {
            id = item.id 
            url = new URL(`http://localhost:3000/category_objects/${id}`)
            body = JSON.stringify({'object':{'name':value}})
        }

        fetch(url, {
            method: 'PATCH',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Rails.csrfToken()
            }
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            if (data !== null) {
                item.name = value
                this.setState({categories:this.state.categories})
            }
        })
    }

    render() {
        return (
            <div className={`${this.props.className}`}>
                <h2 className="d-flex justify-content-between align-items-center">Категории и объекты закупки
                    <button type="button" className="btn btn-second" onClick={this.addCategory.bind(this)}>Добавить категорию</button>
                </h2>
                <div className="card card__list object_list mb-3" >
                    <ReactCSSTransitionGroup
                        transitionName="expand"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {this.state.categories.map((category, cIndex) => {
                            return (
                            <Category 
                                key={category.id}
                                data={category} 
                                index={cIndex}
                                onAdd={this.addObject.bind(this)}
                                onDelete={this.deleteCategory.bind(this)}
                                onChange={(value) => this.changeName(category, value)}
                            >
                                    {category.list.map((obj, oIndex) => {
                                        return <CategoryObject 
                                            key={obj.id}
                                            index={oIndex} 
                                            categoryIndex={cIndex}
                                            data={obj}
                                            onDelete={() => this.deleteObject(cIndex, oIndex)}
                                            onChange={(value) => this.changeName(obj, value)}
                                        />
                                    })}
                            </Category>)
                        })}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
}
Categories.propTypes = {
    data: PropTypes.array
}
export default Categories

