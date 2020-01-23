import React, { Component } from 'react'
import PropTypes from 'prop-types';
import "./index.scss";

export class Dropdown extends Component {
    listRef = React.createRef()
    currentRef = React.createRef()
    selectRef = React.createRef()
    constructor(props) {
        super(props)
        const {options} = props
        let selected = options.findIndex((item)=> {return item.selected})
        console.log(selected)
        if (!selected) {
            selected = 0
        }

        this.state = {
            isExpanded:false,
            selected:selected,
            options:props.options
        }

        this.onClickOutside = this.onClickOutside.bind(this);  
        this.updateListPosition = this.updateListPosition.bind(this);  
    }

    componentDidMount() {
        document.addEventListener("click", this.onClickOutside)
        window.addEventListener("scroll", this.updateListPosition)
        window.addEventListener("resize", this.updateListPosition)
        this.updateListPosition()
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.onClickOutside)
        window.removeEventListener("scroll", this.updateListPosition)
        window.removeEventListener("resize", this.updateListPosition)
    }
    onClickOutside(e) {
        var isClickInside = this.currentRef.current.contains(e.target);
        if (!isClickInside) {
            this.collapse()
        }
    }

    updateListPosition() {
        this.setState({isExpanded:false})
        var viewportOffset = this.currentRef.current.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        var top = viewportOffset.top;
        var left = viewportOffset.left;
        var height = this.currentRef.current.offsetHeight
        this.listRef.current.style.left = left + "px"
        this.listRef.current.style.top = (top + height + 2)  + "px"
        this.listRef.current.style.height = "auto"
        this.listRef.current.style.width = this.currentRef.current.offsetWidth  + "px"
    }

    collapse() {
        console.log()
        this.setState({isExpanded:false, listHeight:0})
    }

    expand(e) {
        this.updateListPosition() 
        this.setState({
            isExpanded:!this.state.isExpanded,
            listHeight:"auto",
            listWidth:this.currentRef.current.offsetWidth
        })
        e.stopPropagation();
    }

    selectItem(item, index) {
        const {options} = this.state
        options.forEach(option => {
            option.selected = false
        });
        this.setState({isExpanded:false, listHeight:0, selected:index}, this.collapse)

        if (this.props.onChange) {
            this.props.onChange(item, index)
        }
    }

    render() {
        const {isExpanded, listWidth, listHeight, listTop, listLeft, options, selected} = this.state
        var selectedItem = options[selected]
        
        return (
            <div className={`input_selector mr-3 dropdown ${isExpanded ? 'dropdown_expanded' : 'dropdown_collapsed'}`}>
                <div className="dropdown__current" ref={this.currentRef} onClick={(e)=>{this.expand(e)}}>
                    {selectedItem ? selectedItem.title : 'Не выбрано'}
                </div>
                <ul className="dropdown__list" ref={this.listRef}>
                    {options && options.map((item, index) => {
                        return (
                            <li 
                                className="dropdown__item" 
                                key={index} 
                                onClick={(e)=>{this.selectItem(item, index)}} 
                                hidden={item.disabled}
                            >{item.title}</li>
                        )
                    })}
                </ul>
                <select style={{display:"none"}} ref={this.selectRef} defaultValue={selectedItem.value}>
                    {options && options.map((item, index) => {
                        return (
                            <option 
                                key={index}
                                className="dropdown__select" 
                                value={item.value} 
                                disabled={item.disabled} 
                            >{item.title}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}
Dropdown.propTypes = {
    options: PropTypes.array.isRequired,
}
export default Dropdown
