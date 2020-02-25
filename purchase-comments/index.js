import React, { Component } from 'react'
import Expandable from '../expandable'
import Comments from '../comments'

export class PurchaseComments extends Component {
    render() {
        const {title, extended, className, currentUser, quality, terms, data, token} = this.props
        console.log("token => "+token)
        return (
            <div className={`${className ? className: '' } purchase-comments`}>
                <h2>{title}</h2>
                <div className="card card__list mb-5">
                    {data.map((item, index)=> {
                        return (
                            <Expandable key={index}>
                                <Expandable.Header>
                                    <span>{item.title}</span>
                                </Expandable.Header>
                                <Expandable.Content>
                                    <Comments procurement_id={item.procurement_id} work_id={item.id} type_evaluation={item.type_evaluation} type_comment={item.type_comment} token={token} quality={quality} terms={terms} extended={extended} list={item.comments} currentUser={currentUser}></Comments>
                                </Expandable.Content>
                            </Expandable>
                        )}
                    )}
                </div>
            </div>
        )
    }
}

export default PurchaseComments
