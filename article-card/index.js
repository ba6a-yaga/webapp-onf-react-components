import React, { Component } from 'react'
import "./index.scss"
import Avatar from '../avatar'
export class ArticleCard extends Component {

    contentPreloader = [
        {width:"100%", height:"204px", backgroundColor:"#F8F8F8", marginBottom:10},
        {width:"85%", height:"15px", backgroundColor:"#BDBDBD", marginBottom:4},
        {width:"95%", height:"15px", backgroundColor:"#BDBDBD", marginBottom:4},
        {width:"15%", height:"15px", backgroundColor:"#BDBDBD", marginBottom:13},
        {width:"50%", height:"42px", backgroundColor:"#F8F8F8", marginBottom:13, float:"left", borderRadius:"21px"},
        {width:"25%", height:"21px", backgroundColor:"#F8F8F8", marginTop:10, float:"left", marginLeft:"12.5%"},
    ]

    onDelete(e) {
        e.preventDefault();
        if (this.props.onDelete) {
            this.props.onDelete(this.props.id)
        }
        return false
    }

    render() {
        const {
            id, 
            url, 
            title,
            text,
            className,
            isLoading
        } = this.props
        return (
            <div 
                className={[
                    'article-card',
                    'card',
                    'card__text',
                    'card__small',
                    className ? className: '',
                ].filter(item=>item).join(' ')}
            >   
                    {!isLoading
                        ? [
                            <div class="card__content card__video">
                                <iframe width="560" height="315" src={url} frameborder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen></iframe>
                            </div>,
                            <div class="card__text">
                                <h2><a href={`articles/${id}`} >{title}</a></h2>
                                <p class="gray">{text}</p>
                            </div>,
                            <div class="card__button">
                                <a href={`/articles/edit/${id}`} type="button" class="btn btn-edit btn-second">Редактировать</a>
                                <a href="/" type="button"  onClick={this.onDelete.bind(this)} class="btn btn-delete btn-third mr-4">Удалить</a>
                            </div>
                        ]
                        : <div className="article-card__preloader">
                                <div>
                                    {this.contentPreloader.map((item)=>{
                                        return <div className="article-card__preloader-line" style={{...item}}></div>
                                    })}
                                </div>  
                            </div> 
                        }
            </div>
        )
    }
}

export default ArticleCard
