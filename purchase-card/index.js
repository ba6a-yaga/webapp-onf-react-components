import React, { Component } from 'react'
import "./index.scss"
export class PurchaseCard extends Component {

    contentPreloader = [
        {width:"50%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:1},
        {width:"25%", height:"14px", backgroundColor:"#F8F8F8", marginBottom:7},
        {width:"100%", height:"15px", backgroundColor:"#BDBDBD"},
        {width:"95%", height:"15px", backgroundColor:"#BDBDBD"},
        {width:"99%", height:"15px", backgroundColor:"#BDBDBD"},
        {width:"45%", height:"21px", backgroundColor:"#F8F8F8"},
    ]

    render() {
        const {
            id, 
            type,
            text, 
            price, 
            bookmark, 
            editable, 
            subscribed, 
            url, 
            className,
            isLoading
        } = this.props
        return (
            <div 
                className={[
                    'purchase-card',
                    className ? className: '',
                    'card',
                    'card__small',
                    bookmark ? 'flag' : ''
                ].filter(item=>item).join(' ')}
            >   
                {isLoading
                    ? <div className="purchase-card__preloader">
                        {this.contentPreloader.map((item)=>{
                            return <div className="preloader-card__preloader-line" style={{...item}}>

                            </div>
                        })}
                    </div> 
                :   <div>{
                        subscribed && <div className="card__tag card__tag__monitor"></div>}
                        {editable && <a href={url || '#'} className="purchase-card__edit-button card__tag card__tag__edit"></a> }
                        <div className="card__text">
                            <a href={"#"} className="card__text__number">№{id}</a>
                            <p className="card__text__subtitle gray">{type}</p>
                            <p className="card__text__content">{text}</p>
                            <p className="card__text__price">{price} <span className="card__subtitle gray">руб.</span></p>
                        </div>
                    </div>
            }
            </div>
        )
    }
}

export default PurchaseCard
