import React, { Component } from 'react'
import PurchaseCard from '../purchase-card';
import "./index.scss"
import ContentLoader from '../content-loader';
export default class PurchasesList extends Component {
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
        // Это типа fetch какой нить
        setTimeout(()=> {
            for (let i = 0; i < 9; i++) {
                this.state.list.push({
                    id:this.state.list.length +  "1283719823719872" + i,
                    subtitle:"Поставка",
                    text:"Поставка аппарата близкофокусной рентгенотерапии в рамках реализации мероприятия «Переоснащение 3 медици...",
                    price:"2 500 000,00",
                    subscribed:true,
                })
            }
            // !!!! CAUTION no more data определить по какому то параметру приходящему от сервера
            this.setState({isLoading:false, noMoreData:this.state.list.length > 40})
        }, 1000)
    }
 
    onAddPurchaseClick(e) {

    }

    render() {
        const {list, isLoading, noMoreData} = this.state
        return (
            <div className="purchases-list container">
                <div className="row">
                    
                    {list.map((item) => {
                        return (
                        <div className="col-12 col-md-6 col-lg-4 mb-3"  key={item.id}>
                            <PurchaseCard 
                               
                                {...item}
                            />
                        </div>
                    )})}
                    {isLoading && Array(this.preloadingItemsCount).fill().map((i, index) => {
                        return <div className="col-12 col-md-6 col-lg-4 mb-3" key={index}>
                            <PurchaseCard 
                                isLoading={true}
                                />
                        </div>
                            }
                        )
                    }
                </div>
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
