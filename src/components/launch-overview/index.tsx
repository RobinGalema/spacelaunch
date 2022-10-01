import React from 'react';
import './style.scss';
import LaunchCard from '../launch-card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from 'react-bootstrap/Row';
import FilterDropdown from '../filter-dropdown';

type Props = {

}

class LaunchOverview extends React.Component<{}, any, Props>{
    constructor(props : any){
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            nextUrl : null,
            offsetLoading : false,
            filterValue : 0,
            favorites : []
        };
    }

    componentDidMount() {
        fetch("https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming/?format=json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded : true,
                        items: result.results,
                        nextUrl : result.next,
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded : true,
                        error : error.message
                    })
                },
            )

        this.loadFavorites();
    }

    loadFavorites = () => {
        const favoriteIds = Array.from(JSON.parse(localStorage.getItem("favorites") || "{}"));
        let elements : Array<any> = [];

        Promise.all(favoriteIds.map((favorite) => {
            fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/${favorite}`)
                .then(res => res.json())
                .then((result) => {
                    elements.push(result);
                })
                    .then(() => {
                    this.setState({favorites : elements});
                    console.log(this.state.favorites);
                })
        }))
        
    }

    loadWithOffset = () => {
        if (!this.state.nextUrl) return;

        this.setState({offsetLoading : true});

        fetch(this.state.nextUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    let newItems = [...this.state.items, ...result.results]

                    this.setState({
                        items: newItems,
                        nextUrl : result.next,
                        offsetLoading : false
                    })
                },
                (error) => {
                    this.setState({
                        error : error.message,
                        offsetloading : false
                    })
                }
            )
    }

    loadWithFilter = (event : any) => {

        const id = parseInt(event.target.value);
        let filterString = (id === 0) ? '' : `?program=${id}`

        fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming${filterString}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded : true,
                        items: result.results,
                        nextUrl : result.next,
                        filterValue : id
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded : true,
                        error : error.message
                    })
                },
            )

        this.setState({
            isLoaded: false,
            items: [],
        })
    }


    render() {
        const { error, isLoaded, items, offsetLoading, filterValue, nextUrl, favorites} = this.state;

        return (
            <div className="container">
                <div className="favorites-wrapper">
                    <h2>{(favorites.length > 0) ? 'Favorites' : null}</h2>
                    <Row>
                    {favorites.map((favorite :any)=> (
                        <LaunchCard data={favorite} key={favorite.id} id={favorite.id}></LaunchCard>
                    ))}
                    </Row>
                </div>

                <div className="head-wrapper">
                    <div className="subtitle-container">
                        <h2>Upcoming launches</h2>
                    </div>
                    <div className="filter-container">
                        <p>Filter on program:</p>
                        <FilterDropdown filterValue={filterValue} onChange={this.loadWithFilter}></FilterDropdown>
                    </div>
                    
                </div>

                {error ?
                    <p>Something went wrong!</p> : !isLoaded ? (
                    <div className="loading-container">
                        <div className="loader-icon">
                            <FontAwesomeIcon icon={faSpinner} />
                        </div>
                    </div> 
                    ) : 
                    <div className="result-wrapper">
                        <Row>
                            {items.map((item :any)=> (
                                <LaunchCard data={item} key={item.id} id={item.id}></LaunchCard>
                            ))}
                        </Row>

                        {nextUrl ? (
                        <div className="button-container">
                            <button onClick={this.loadWithOffset}>{offsetLoading ? (<FontAwesomeIcon icon={faSpinner} />) : 'Load more'}</button>
                        </div>
                        ) : null}
                    </div>
                }
            </div>
        )
    }
    
}

export default LaunchOverview;