import React, { Component } from 'react'
import "./index.scss"
import ContentLoader from '../content-loader';
import MemberCard from '../member-card';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ArticleCard from '../article-card';
import Masonry from 'react-masonry-css'

export default class ArticlesList extends Component {
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


            this.setState({isLoading:false, noMoreData:this.state.list.length >= this.state.total})
        }, 1000)
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
        const {list, isLoading, noMoreData, placeholdersCount} = this.state
        var elements = list.map((item, index) => {
            return (
            <div key={item.id}>
                <ArticleCard 
                    onDelete={(index) => {this.onDelete(index)}}
                    {...item}
                />
            </div>
        )})
        if (isLoading) {
            for (let i = 0; i < placeholdersCount; i++) {
                elements.push(
                    <div>
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
                <Masonry
                    breakpointCols={this.breakpointColumnsObj}
                    className="masonry"
                    columnClassName="masonry__item mb-3">
                     {this.getElements()}
                </Masonry>

                <ContentLoader isLoading={isLoading} noMoreData={noMoreData} onLoadMore={this.onLoadMore.bind(this)} />

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <a href="/articles/create" type="button" onClick={this.onAddClick.bind(this)} className="btn btn-main">Добавить видеоролик</a>
                    </div>
                </div>
            </div>
        )
    }
}
