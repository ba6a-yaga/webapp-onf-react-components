import React, { Component } from 'react'

class ContentLoader extends Component {
    loaderRef = React.createRef()
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading:props.isLoading
        }
        this.onPositionChange = this.onPositionChange.bind(this)
    }
    
    componentWillReceiveProps(props) {
        console.log("nextProps", props)
        this.setState({
            isLoading:props.isLoading
        })
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onPositionChange)
        window.addEventListener("resize", this.onPositionChange)
    }
    
    componentWillUnmount() {
        window.removeEventListener("scroll", this.onPositionChange)
        window.removeEventListener("resize", this.onPositionChange)
    }

    isLoaderPresentOnScreen() {
        let elem = this.loaderRef.current
        
        let rect = elem.getBoundingClientRect()
        const top = rect.top - window.screen.height 
        return top < 0
    }

    onPositionChange(e) {
        if (!this.state.isLoading) {
            if (this.isLoaderPresentOnScreen()) {
                if (this.props.onLoadMore) {
                    this.props.onLoadMore(e)
                }
            }    
        }
    }
    render() {
        const {count} = this.props
        return (
            <div className="content-loader" ref={this.loaderRef}>
                
            </div>
        )
    }
}

export default ContentLoader
