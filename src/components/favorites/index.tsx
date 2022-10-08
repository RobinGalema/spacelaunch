import React from "react";
import Row from "react-bootstrap/Row";
import FavoriteContext from "../../context/FavoriteContext";
import LaunchCard from "../launch-card";

type Props = {};

class Favorites extends React.Component<{}, any, Props> {
  static contextType = FavoriteContext;
  context!: React.ContextType<typeof FavoriteContext>;

  currentFavorites?: Array<string>;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      favorites: [],
      error: null,
    };
  }

  componentDidMount() {
    this.loadFavorites();
  }

  componentDidUpdate() {
    const newFavorites = this.context.favorites;
    if (this.currentFavorites === newFavorites) return;

    if (newFavorites.length > this.currentFavorites!.length) {
      this.addSingleFavorite(newFavorites[newFavorites.length - 1]);
    }

    this.currentFavorites = newFavorites;
  }

  addSingleFavorite = (id: string): void => {
    fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/${id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            favorites: this.state.favorites.concat([result]),
            isLoading: false,
          });
        },
        (error) => {
          this.setState({ error: error });
        }
      );
  };

  removeSingleFavorite = (id: string): void => {};

  loadFavorites = (): void => {
    const favoriteIds = Array.from(
      JSON.parse(localStorage.getItem("favorites") || "{}")
    );

    // Update the global context
    this.context.setFavorites(favoriteIds);
    this.currentFavorites = favoriteIds as Array<string>;

    if (favoriteIds.length === 0) this.setState({ isLoading: false });
    let elements: Array<any> = [];

    Promise.all(
      favoriteIds.map((favorite) => {
        fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/${favorite}`)
          .then((res) => res.json())
          .then((result) => {
            elements.push(result);
          })
          .then(
            () => {
              this.setState({ favorites: elements, isLoading: false });
            },
            (error) => {
              this.setState({ error: error });
            }
          );
      })
    );
  };

  render() {
    const { isLoading, favorites, error } = this.state;

    return (
      <div className="favorites-wrapper">
        {error ? (
          <div>
            <div className="error">
              <p>{error.message}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="loading">
            <p>Loading favorites</p>
          </div>
        ) : (
          <>
            <h2>{favorites.length > 0 ? "Favorites" : null}</h2>
            <Row>
              {favorites.map((favorite: any) => (
                <LaunchCard
                  data={favorite}
                  key={favorite.id}
                  id={favorite.id}
                ></LaunchCard>
              ))}
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default Favorites;
