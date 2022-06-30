import React, { Component } from 'react';

export default class Movie extends Component {
    constructor(){
        super();
        this.state = {
            movie:{},
            hover:false,
            favourites:[],
            genre:''
        }
    }
  componentDidMount(){
    let genreids={28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
    27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'}
      this.setState({
          movie:{...this.props.location.state.movie},
          genre:genreids[this.props.location.state.movie.genre_ids[0]]
      })
      this.handleFavouritesState();
  }

handleFavourites=(movie)=>{
    let oldData = JSON.parse(localStorage.getItem('movies')||'[]')    
    if(this.state.favourites.includes(movie.id)){
        oldData = oldData.filter((currMovie)=>currMovie.id!=movie.id) 
    }else{
        oldData.push(movie)
    } 
    localStorage.setItem("movies",JSON.stringify(oldData));
    this.handleFavouritesState();
}

handleFavouritesState = ()=>{
    let oldData = JSON.parse(localStorage.getItem('movies')||'[]') 
    let temp = oldData.map((movie)=>movie.id);
    this.setState({
        favourites:[...temp]
    })
}
 
  render() {
    return(
    
    (this.state.movie.length==0)?<h1>Loading...</h1>:
    <div className = "main">
            <div className="row">
                    <div className="col-lg-5 col-sm-12 movie-card" onMouseEnter={()=>this.setState({
                                                                            hover:true}
                                                                    )} 
                                                                    onMouseLeave={()=>this.setState({
                                                                        hover:false}
                                                                    )}
                                                                   >
                                                                  
                        <img src={`https://image.tmdb.org/t/p/original${this.state.movie.backdrop_path}`} alt = {this.state.movie.title} style = {{width:'100%'}}></img>  
                        <h3 className='card-title movie-title'>{this.state.movie.original_title}</h3>
                        <div className='movie-btn'>
                                {
                                    this.state.hover&&<a className="btn btn-primary movies-button"onClick={()=>this.handleFavourites(this.state.movie)}>{this.state.favourites.includes(this.state.movie.id)?"Remove from favourites":"Add to favourites"}</a>
                                }
                                    
                        </div>
                    </div>
                   
                   <div className="col-lg-7 col-sm-12 desc">
                       <div className="list-cont">
                        <ul className="list-group list-group-horizontal">
                            <li class="list-group-item list-item-1">Genre</li>
                            <li class="list-group-item list-item-2">{this.state.genre}</li>
                        </ul>
                        <ul class="list-group list-group-horizontal">
                            <li class="list-group-item list-item-1">Popularity</li>
                            <li class="list-group-item list-item-2">{this.state.movie.popularity}</li>
                        </ul>
                        <ul class="list-group list-group-horizontal">
                            <li class="list-group-item list-item-1">Rating</li>
                            <li class="list-group-item list-item-2">{this.state.movie.vote_average}</li>
                        </ul>
                        <ul class="list-group list-group-horizontal">
                            <li class="list-group-item list-item-1">Release Date</li>
                            <li class="list-group-item list-item-2">{this.state.movie.release_date}</li>
                        </ul>
                        </div>
                   </div>
            </div>
            <div class = "movie-desc">{this.state.movie.overview}</div>
    </div>
    )
}
}