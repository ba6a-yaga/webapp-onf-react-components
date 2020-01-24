import React, { Component } from 'react'
import "./index.scss"
import ContentLoader from '../content-loader';
import MemberCard from '../member-card';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
export default class MembersList extends Component {
    preloadingItemsCount = 6;
    constructor(props) {
        super(props)
        this.state = {
            list: props.data ? props.data : [],
            isLoading:false,
            noMoreData:false,
        }
    }

    onLoadMore(e) { 
        console.log("LOADING MORE")
        this.setState({isLoading:true})
        // !!!! CAUTION  Это типа fetch какой нить
        setTimeout(()=> {
            const length = this.state.list.length
            for (let i = 0; i < 9; i++) {
                this.state.list.push({
                    id:1022 + this.state.list.length + i,
                    avatar:"https://politrussia.com/upload/iblock/795/7951c8694db4f913c633faece5d5de3e.jpg",
                    name:"Иванов Василий Петрович",
                    role:"Автор закупки"
                })
            }
            console.log(this.state.list.length)
            // !!!! CAUTION no more data определить по какому то параметру приходящему от сервера
            this.setState({isLoading:false, noMoreData:this.state.list.length > 40})
        }, 1000)
    }

    onDelete(index) {
        this.state.list.splice(index, 1)
        this.setState({list:this.state.list})
    }

    onAddMemberClick(e) {
        
    }

    render() {
        const {list, isLoading, noMoreData} = this.state
        return (
            <div className="purchases-list container">
            
                <div className="row">
                    {list.map((item, index) => {
                        return (
                        <div className="col-12 col-md-6 col-lg-4 mb-3" key={index}>
                            <MemberCard 
                                onDelete={(index) => {this.onDelete(index)}}
                                {...item}
                            />
                        </div>
                    )})}
                    {isLoading && Array(this.preloadingItemsCount).fill().map((i, index) => {
                        return (
                            <div className="col-12 col-md-6 col-lg-4 mb-3">
                                <MemberCard isLoading={true}/>
                            </div>
                        )
                        })
                    }
                </div>

                <ContentLoader isLoading={isLoading} noMoreData={noMoreData} onLoadMore={this.onLoadMore.bind(this)} />

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <button type="button" onClick={this.onAddMemberClick.bind(this)} className="btn btn-main">Создать новый аккаунт</button>
                    </div>
                </div>
            </div>
        )
    }
}
