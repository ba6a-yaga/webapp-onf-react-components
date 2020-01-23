import React, { Component } from 'react'
import "./index.scss"
import ContentLoader from '../content-loader';
import MemberCard from '../member-card';
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
                    id:10 + this.state.list.length + i,
                    avatar:"https://politrussia.com/upload/iblock/795/7951c8694db4f913c633faece5d5de3e.jpg",
                    name:"Иванов Василий Петрович",
                    role:"Автор закупки"
                })
            }

            // !!!! CAUTION no more data определить по какому то параметру приходящему от сервера
            this.setState({isLoading:false, noMoreData:this.state.list.length > 40})
        }, 1000)
    }

    onDelete(index) {

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
                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                            <MemberCard onDelete={(index) => {this.onDelete(index)}}
                                key={index}
                                {...item}
                            />
                        </div>
                    )})}
                    {isLoading && Array(this.preloadingItemsCount).fill(
                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                            <MemberCard 
                            
                                isLoading={true}
                            />
                        </div>
                        )
                    }
                </div>

                <ContentLoader isLoading={isLoading} noMoreData={noMoreData} onLoadMore={this.onLoadMore.bind(this)} />

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <button type="button" onClick={this.onAddMemberClick.bind(this)} className="btn btn-main">Добавить закупку</button>
                    </div>
                </div>
            </div>
        )
    }
}
