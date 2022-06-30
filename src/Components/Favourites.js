import React, { Component } from 'react'
import {movies} from './getMovies'

export default class Favourites extends Component {
    constructor(){
        super();
        this.state={
            genres:[],
            currgen:'All Genres',
            movies:[],
            currText:'',
            limit:5,
            currPage:1
        }
    }
    componentDidMount(){
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};
        let data = JSON.parse(localStorage.getItem("movies") || "[]");
        let temp = [];
        data.forEach((movieObj)=>{
            if(!temp.includes(genreids[movieObj.genre_ids[0]])){
                temp.push(genreids[movieObj.genre_ids[0]]);
            }
        })
        temp.unshift('All Genres')
        this.setState({
            genres:[...temp],
            movies:[...data]
        })
    }
    handleGenreChange=(genre)=>{
        this.setState({
            currgen:genre
        })
    }
    sortPopularityAsc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objA.popularity-objB.popularity
        })
        this.setState({
            movies:[...temp]
        })
    }

    sortPopularityDesc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objB.popularity-objA.popularity
        })
        this.setState({
            movies:[...temp]
        })
    }

    sortRatingAsc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objA.vote_average-objB.vote_average
        })
        this.setState({
            movies:[...temp]
        })
    }

    handlePageChange= (page)=>{
        this.setState({
            currPage:page
        })
    }

    sortRatingDesc=()=>{
        let temp = this.state.movies;
        temp.sort(function(objA,objB){
            return objB.vote_average-objA.vote_average
        })
        this.setState({
            movies:[...temp]
        })
    }
    handleDelete=(id)=>{
        let newarr = [];
        newarr = this.state.movies.filter((movieObj)=>movieObj.id!=id)
        this.setState({
            movies:[...newarr]
        })

        localStorage.setItem("movies",JSON.stringify(newarr));
    }

    showMovie = (movieObj)=>{
        this.props.history.push({
        pathname: `/movie/${movieObj.original_title}`,
        state: {movie:movieObj}
    })
    }
    render() {
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};
        
        let filterArr = [];

        if(this.state.currText==''){
            filterArr=this.state.movies
        }else{
            filterArr=this.state.movies.filter((movieObj)=>{
                let title = movieObj.original_title.toLowerCase();
                return title.includes(this.state.currText.toLowerCase())
            })
        }

        if(this.state.currgen!="All Genres"){
            filterArr = this.state.movies.filter((movieObj)=>genreids[movieObj.genre_ids[0]]==this.state.currgen)
        }

        let pages = Math.ceil(filterArr.length/this.state.limit);
        let pagesArr = [];
        for(let idx = 1;idx<=pages;idx++){
            pagesArr.push(idx);
        }

        let startingIdx = (this.state.currPage-1)*this.state.limit;
        let endIdx = startingIdx+this.state.limit;
        filterArr = filterArr.slice(startingIdx,endIdx);

        return (
            <div>
               <>
                <div className = "main">
                    <div className="row">
                        <div className="col-lg-3 col-sm-12">
                            <ul class="list-group favourites-genres">
                                {
                                    this.state.genres.map((genre)=>(
                                        this.state.currgen==genre?
                                        <li class = "list-group-item" style = {{background:'#3f51b5',color:'white',fontWeight:'bold'}} >{genre}</li>:
                                        <li class = "list-group-item" style = {{background:'white',color:'#3f51b5'}} onClick={()=>this.handleGenreChange(genre)}>{genre}</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-9 favourites-table col-sm-12">
                            <div className="row">
                                <input type = "text" className="input-group-text col" placeholder="Search" value = {this.state.currText} onChange = {(event)=>this.setState({currText:event.target.value})}/>
                                <input type = "number" className="input-group-text col" placeholder="Rows Count" value = {this.state.limit} onChange = {(event)=>this.setState({limit:((parseInt(event.target.value))==0?1:parseInt(event.target.value))})}/>
                            </div>
                            <div className="row">
                                <table class="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col"><i class="fas fa-sort-up" onClick={this.sortPopularityDesc}></i>Popularity<i class="fas fa-sort-down"onClick={this.sortPopularityAsc}></i></th>
                                        <th scope="col"><i class="fas fa-sort-up" onClick={this.sortRatingDesc}></i>Rating<i class="fas fa-sort-down"onClick={this.sortRatingAsc}></i></th>
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filterArr.map((movieObj)=>(
                                                <tr>
                                                    <td onClick = {()=>this.showMovie(movieObj)}><img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt = {movieObj.title} style = {{width:'5rem'}}></img>{movieObj.original_title}</td>
                                                    <td>{genreids[movieObj.genre_ids[0]]}</td>
                                                    <td>{movieObj.popularity}</td>
                                                    <td>{movieObj.vote_average} </td>
                                                    <td><button type="button" class="btn btn-danger" onClick={()=>this.handleDelete(movieObj.id)}>Delete</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <nav aria-label="Page navigation example">
                                <ul class="pagination">
                                    {
                                        pagesArr.map((page)=>(
                                            <li class="page-item"><a class="page-link" onClick={()=>this.handlePageChange(page)}>{page}</a></li>
                                        ))
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
               </>
            </div>
        )
    }
}
