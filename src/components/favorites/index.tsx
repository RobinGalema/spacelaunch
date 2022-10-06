import React from 'react';
import Row from 'react-bootstrap/Row';
import LaunchCard from '../launch-card';

type Props = {

}

class Favorites extends React.Component<{}, any, Props> {

    constructor(props : any){
        super(props);

        this.state = {
            isLoading: true,
            favorites: [],
            favoriteIds : null,
            error: null
        }
    }

    componentDidMount() {
        this.loadFavorites();
    }

    loadFavorites = () => {
        const favoriteIds = Array.from(JSON.parse(localStorage.getItem("favorites") || "{}"));
        if (favoriteIds.length == 0) this.setState({ isLoading : false});
        let elements : Array<any> = [];

        Promise.all(favoriteIds.map((favorite) => {
            fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/${favorite}`)
                .then(res => res.json())
                .then((result) => {
                    elements.push(result);
                })
                    .then(() => {
                    this.setState({favorites : elements, isLoading : false});
                    console.log(this.state.favorites);
                },
                (error) => {
                    this.setState({error: error});
                })
        }))
    }

    render() {
        const {isLoading, favorites, error} = this.state

        return(
            <div className="favorites-wrapper">
                
                {error ? 
                (<div>
                    <div className="error"><p>{error.message}</p></div>
                </div>) 
                : isLoading ? 
                (<div className="loading">
                    <p>Loading favorites</p>
                </div> ) 
                : (
                <><h2>{(favorites.length > 0) ? 'Favorites' : null}</h2><Row>
                        {favorites.map((favorite: any) => (
                            <LaunchCard data={favorite} key={favorite.id} id={favorite.id}></LaunchCard>
                        ))}
                    </Row></>
                )}
            </div>
        )
    }
}

export default Favorites;