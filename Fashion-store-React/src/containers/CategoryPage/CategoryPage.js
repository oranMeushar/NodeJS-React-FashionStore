import React from 'react';
import './CategoryPage.css';

import {connect} from 'react-redux';

import ShopItem from '../Shop/ShopItem/ShopItem';
import * as actions from '../../store/actions/cart';
import Loader from '../../components/Loader/Loader';

class CategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collection:[],
            pagination:{},
            isLoading:false
        }
    }

    handleClick = (item) =>{
        this.props.onButtonClick(item);
    }

    handleArrowButtons = async(e) =>{
        let page = null;
        if (e.target.className.includes('CategoryPage-leftButton')) {
            page = this.state.pagination.prevPage;
        }
        else{
            page = this.state.pagination.nextPage; 
        }
        try{
            this.setState({
                isLoading:true
            });
            const response = await 
            fetch(`/api/v1${this.props.location.pathname}?page=${page}`)
            const data = await response.json();
            this.setState({
                collection: data.data.collection,
                pagination: data.pagination,
                isLoading:false
            })
        }
        catch(e){
            this.setState({
                isLoading:false
            })
        }

    }
    async componentDidMount(){
        try{
            this.setState({
                isLoading:true
            });
            const response = await fetch
            (`/api/v1${this.props.location.pathname}?page=1`);
            const data = await response.json();
            this.setState({
                collection: data.data.collection,
                pagination: data.pagination,
                isLoading:false
            })
        }
        catch(e){
            this.setState({
                isLoading:false
            })
        }
        
    }
    render(){
        let loader = null;
        if (this.state.isLoading) {
            loader = (<Loader/>)
        }
        let category = this.props.location.pathname.split('/')[2];
        let leftButton = this.state.pagination.prevPage ? 
        <button 
            className = "CategoryPage-leftButton"
            onClick={this.handleArrowButtons}>&#10094;       
        </button>:null

        let rightButton = this.state.pagination.nextPage ? 
        <button 
            className = "CategoryPage-rightButton"
            onClick={this.handleArrowButtons}>&#10095;
        </button>:null

        return(
            <div className="CategoryPage">
                <h1>{category}</h1>
                    {loader}
                <div className="CategoryPage-items-wrapper">
                {
                    this.state.collection.map((item) =>{
                        return(
                            <ShopItem 
                                key = {item._id}
                                clicked = {()=>this.handleClick(item)}
                                {...item}
                            />
                        )
                    })
                }
                </div>
                <div className="CategoryPage-buttons">
                    {leftButton}
                    {
                        Object.keys(this.state.pagination).length !== 0 ?
                        <p>{`${this.state.pagination.currentPage} / ${this.state.pagination.totalPages}`}</p>:
                        null
                    }
                    {rightButton}
                </div>   
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onButtonClick:(item)=>dispatch(actions.addItem(item))
    }
}
export default connect(null, mapDispatchToProps)(CategoryPage);