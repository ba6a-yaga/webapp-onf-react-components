import React, { Component } from 'react'
import "./index.scss"
import ContentLoader from '../content-loader';
import MemberCard from '../member-card';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ArticleCard from '../article-card';
export default class MembersList extends Component {
    preloadingItemsCount = 6;
    constructor(props) {
        super(props)
        this.state = {
            list: props.data ? props.data : [],
            isLoading:false,
            noMoreData:false,
            columnsCount:3
        }
        this.onResize = this.onResize.bind(this)
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
                    url:"https://www.youtube.com/embed/S_dfq9rFWAE",
                    title:"Активисты ОНФ выявили в «Городе N» — Бердске сомнительные закупки на сумму 260 млн рублей",
                    text:`Активисты и эксперты проекта ОНФ «За честные закупки» в рамках инициативы «Город N»
                    проверили
                    закупки в
                    городе Бердск Новосибирской области. В разряд сомнительных попали закупки на строительство и
                    капитальный
                    ремонт зданий и сооружений, благоустройство территорий и строительство дорог на общую сумму
                    260
                    млн руб.
                    Всю информацию эксперты ОНФ передали в прокуратуру.`
                })
            }
            console.log(this.state.list.length)
            // !!!! CAUTION no more data определить по какому то параметру приходящему от сервера
            this.setState({isLoading:false, noMoreData:this.state.list.length > 40})
        }, 1000)
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize)
    }

    onResize(e) {
        const width = window.innerWidth
        let currentColumnsCount = this.state.columnsCount;
        let newColumnsCount = currentColumnsCount;
        if (width < 768) {
            newColumnsCount = 1
        } else if (width < 992 ) {
            newColumnsCount = 2
        } else {
            newColumnsCount = 3
        }
        if (currentColumnsCount != newColumnsCount) {
            this.setState({columnsCount:newColumnsCount})
        }
    }

    reorder = (arr, columns) => {
        const cols = columns;
        const out = [];
        let col = 0;

        console.log("reordering")
        while(col < cols) {
            for(let i = 0; i < arr.length; i += cols) {
                let _val = arr[i + col];
                if (_val !== undefined)
                    out.push(_val);
            }
            col++;
        }
        return out
    }

    onDelete(id) {
        let index = this.state.list.findIndex(item => {return item.id == id});
        if (index != -1) {
            this.state.list.splice(index, 1)
            this.setState({list:this.state.list, columnsCount:this.state.columnsCount})
        }
    }

    onAddClick(e) {
        
    }

    getElements () {
        const {list, isLoading, noMoreData} = this.state
        var elements = list.map((item, index) => {
            return (
            <div className="masonry__item mb-3" key={item.id}>
                <ArticleCard 
                    onDelete={(index) => {this.onDelete(index)}}
                    {...item}
                />
            </div>
        )})
        if (isLoading) {
            for (let i = 0; i < this.preloadingItemsCount; i++) {
                elements.push(
                    <div className="masonry__item mb-3">
                        <ArticleCard isLoading={true}/>
                    </div>
                )
            }
        }
        return elements
    }
    render() {
        const {list, isLoading, noMoreData, columnsCount} = this.state
        return (
            <div className="articles-list container">
                <div className="masonry" style={{columnCount:columnsCount}}>
                    {this.reorder(this.getElements(), columnsCount)}
                </div>

                <ContentLoader isLoading={isLoading} noMoreData={noMoreData} onLoadMore={this.onLoadMore.bind(this)} />

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <button type="button" onClick={this.onAddClick.bind(this)} className="btn btn-main">Добавить видеоролик</button>
                    </div>
                </div>
            </div>
        )
    }
}
