import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'

export default class Movies extends Component {
    constructor(){
        super();
        this.state={
            hover:'',
            parr:[1],
            currPage:1,
            movies:[],
            favourites:[]
        }
    }
    async componentDidMount(){
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=763e9b8770fb6a7ecec2ffd5f1d678cc&page=${this.state.currPage}`)
        let data = res.data;
        this.setState({
            movies:[...data.results]
        })
        this.handleFavouritesState();
    }
    changeMovies=async()=>{
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=763e9b8770fb6a7ecec2ffd5f1d678cc&page=${this.state.currPage}`)
        let data = res.data;
        this.setState({
            movies:[...data.results]
        })
    }
    handleRight=()=>{
        let len = this.state.parr.length;
        
        if(this.state.currPage==len){
            let tempArr = [];
            for(let idx = 1;idx<=len+1;idx++){
                tempArr.push(idx);
            }

            this.setState({
                parr:[...tempArr],
                currPage:this.state.currPage+1
            },this.changeMovies)
        }else{
            this.setState({
                currPage:this.state.currPage+1
            },this.changeMovies) // provided like a callback to achieve sync
        }                    // first parr , currPage updation then call changeMovies 
                            // we have not called the function : this.changeMovies() , this is calling
                            // we provided definition only

                            // all this is done because setState is not sync function 

                            // can we use async await here ? 
                            //https://stackoverflow.com/questions/53409325/does-this-setstate-return-promise-in-react
                            // conclusion : better not to use async await since promisifying setState causes overhead
    }
    handleLeft=()=>{
        if(this.state.currPage!=1){
        this.setState({
            currPage:this.state.currPage-1
        },this.changeMovies) 
        }
    }
    handleClick=(value)=>{
        if(value!=this.state.currPage){
            this.setState({
                currPage:value
            },this.changeMovies)
        }
        // avoid requesting if same page clicked 
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

    showMovie = (movieObj)=>{
        this.props.history.push({
        pathname: `/movie/${movieObj.original_title}`,
        state: {movie:movieObj}
    })
    }

    render() {
        return (
            <>
            {
            this.state.movies.length==0?
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>:
            <div>
                <h3 className="text-center"><strong>Trending</strong></h3>
                <div className = "movies-list">
                    {
                        this.state.movies.map((movieObj)=>(
                            
                            <div className="card movies-card" onMouseEnter={()=>this.setState({
                                                                            hover:movieObj.id}
                                                                           )}
                                                              onMouseLeave={()=>this.setState({
                                                                            hover:''}
                                                                            )}
                                                              >
                                <img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt={movieObj.title} className="card-img-top movies-img"/>
                                
                                <h5 className="card-title movies-title" onClick = {()=>this.showMovie(movieObj)}>{movieObj.original_title}</h5>
                                   
                                    <div className ="button-wrapper" style = {{display:'flex',width:'100%',justifyContent:'center'}}>
                                        {
                                          this.state.hover == movieObj.id&&<a className="btn btn-primary movies-button"onClick={()=>this.handleFavourites(movieObj)}>{this.state.favourites.includes(movieObj.id)?"Remove from favourites":"Add to favourites"}</a>
                                        }
                                    
                                    </div>
                                
                            </div>
                            
                        ))
                    }
                </div>
                <div style = {{display:'flex',justifyContent:'center'}}>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                        <li class="page-item"><a class="page-link"onClick={this.handleLeft}>Previous</a></li>
                            {
                                this.state.parr.map((value)=>(
                                    <li class="page-item"><a class="page-link"onClick={()=>this.handleClick(value)}>{value}</a></li>
                                    // if ()=> this.handleClick(value) is replaced by only this.handleClick(value)
                                    // thats wrong because thats calling function , and this is function definition(arrow function calling function)
                                    // we do not want to call handleClick() when DOM is being applied
                                ))

                            }
                         <li class="page-item"><a class="page-link" onClick={this.handleRight}>Next</a></li>                            
                        </ul>
                    </nav>
                </div>
            </div>
            }
            </>
        )
    }
}
