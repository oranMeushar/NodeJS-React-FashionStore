import React from 'react';
import './Shop.css';

import {connect} from 'react-redux';

import SHOP_DATA_PREVIEW from '../../data/ShopPageData/ShopDataPreview';
import ShopItem from './ShopItem/ShopItem';
import * as actions from '../../store/actions/cart';

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          collections:SHOP_DATA_PREVIEW  
        }
    }

    handleClick = (item) =>{
        this.props.onButtonClick(item);
    }

    handleTitleClicked = async(e) =>{
        const category = e.target.id;
        this.props.history.push(`${this.props.match.url}/${category}`);
    }

    render() { 
        return(
            <>
                {
                    this.state.collections.map(collection =>{
                    return (
                        <div key={collection.id} className = 'shop-items-row'>
                            <h1 id ={collection.title.toLowerCase()}
                                onClick={this.handleTitleClicked}>
                            {collection.title}</h1>
                            <div className="images-container">
                                {
                                    collection.items.map(item =>{
                                        return(
                                            <ShopItem 
                                                key = {item._id}
                                                clicked = {()=>this.handleClick(item)}
                                                {...item}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        )
                    })
                } 
            </> 
        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onButtonClick:(item)=>dispatch(actions.addItem(item))
    }
}

export default connect(null, mapDispatchToProps)(Shop);