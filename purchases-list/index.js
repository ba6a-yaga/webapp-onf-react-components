import React, { Component } from 'react'
import PurchaseCard from '../purchase-card';
import "./index.scss"
import ContentLoader from '../content-loader';
import Masonry from 'react-masonry-css';
export default class PurchasesList extends Component {
    breakpointColumnsObj = {
        default: 3,
        992: 2,
        768: 1,
    };
    constructor(props) {
        super(props)
        let data = props.data ? props.data : [];
        this.state = {
            list: data,
            isLoading:false,
            noMoreData:data.length >= (props.total ?? 0),
            total:props.total ?? 0,
            placeholdersCount:props.placeholdersCount ?? 6
        }
    }

    onLoadMore(e) { 
        console.log("LOADING MORE")
        this.setState({isLoading:true})
        // Это типа fetch какой нить
        setTimeout(()=> {
            var length = this.state.list.length
            for (let i = 0; i < 9; i++) {
                this.state.list.push({
                    id:length + i + 1000,
                    number:"№1283719823719872",
                    subtitle:"Поставка",
                    text:"Поставка аппарата близкофокусной рентгенотерапии в рамках реализации мероприятия «Переоснащение 3 медици...",
                    price:"2 500 000,00",
                    subscribed:true,
                })
            }
            // !!!! CAUTION no more data определить по какому то параметру приходящему от сервера
            this.setState({isLoading:false, noMoreData:this.state.list.length >= this.state.total})
        }, 1000)
    }
 
    onAddPurchaseClick(e) {

    }


    getElements () {
        const {list, isLoading, noMoreData, placeholdersCount} = this.state
        var elements = list.map((item) => {
            return (
            <div key={item.id}>
                <PurchaseCard 
                    {...item}
                />
            </div>
        )})
        if (isLoading) {
            for (let i = 0; i < placeholdersCount; i++) {
                elements.push(
                    <div key={list.length + i + 100}>
                        <PurchaseCard 
                            isLoading={true}
                        />
                    </div>
                )
            }
        }
        return elements
    }
    
    render() {
        const {list, isLoading, noMoreData, placeholdersCount} = this.state
        return (
            <div className="purchases-list container">
                <Masonry
                    breakpointCols={this.breakpointColumnsObj}
                    className="masonry"
                    columnClassName="masonry__item mb-3">
                    {this.getElements()}
                </Masonry>
                
                <ContentLoader isLoading={isLoading} noMoreData={noMoreData} onLoadMore={this.onLoadMore.bind(this)} />

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <button type="button" onClick={this.onAddPurchaseClick.bind(this)} className="btn btn-main">Добавить закупку</button>
                    </div>
                </div>
            </div>
        )
    }
}
