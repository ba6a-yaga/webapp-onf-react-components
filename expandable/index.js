import React, { Component } from 'react'
import PropTypes from 'prop-types';

import "./index.scss";

// Простой пустой компонент Header для того чтобы в дальнейшем использовать для проверки типа
function Header() {
    return null
}
// Простой пустой компонент Content для того чтобы в дальнейшем использовать дл проверки
function Content() {
    return null
}

class Expandable extends Component {
    static Header = Header
    static Content = Content

    constructor(props) {
        super(props)
        this.state = {
            isOpened:false,
            maxHeight:0,
        }

    }
    lastScrollHeight = 0
    watcher = null;
    componentDidMount() {
        this.watcher = window.requestAnimationFrame(this.watch.bind(this));
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.watcher);
    }
    watch() {
        cancelAnimationFrame(this.watcher);
        if (this.lastScrollHeight !== this.expandableRef.current.scrollHeight) {
            this.updateHeight(this.state.isOpened)
        }

        this.lastScrollHeight = this.expandableRef.current.scrollHeight;
        this.watcher = requestAnimationFrame(this.watch.bind(this));
    };
    /**
     * ссылка на разворачиваемый элемент 
     */
    expandableRef = React.createRef()
    
    /**
     * обновляет состояние когда приходят новые пропсы в компонент
     */
    componentWillReceiveProps(props) {
        this.updateHeight(this.state.isOpened)
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


    render() {
        const {children} = this.props
        const header = children.find(child => child.type === Header)
        const content = children.find(child => child.type === Content)
        return (
            <div className={`card__list__item ${this.state.isOpened ? "active" : ""}` } >
                <div 
                    className={`card__list__item__header ${content.props.children.length == 0 ? 'no-children': ''}`} 
                    onClick={(e) => {this.setIsOpened(!this.state.isOpened)}}
                >
                    {header ? header.props.children : null}
                    <div className="arrow"></div>
                </div>
                <div className="card__list__item__content" style={{height:this.state.maxHeight}}>
                    <div className="card__list__item__block"  ref={this.expandableRef}>
                        {content ? content.props.children : null}
                    </div>
                </div>
            </div>
        )
    }
}

Expandable.propTypes = {
    data: PropTypes.object,
    onDelete:PropTypes.func,
    onAddObject:PropTypes.func
}

export default Expandable

