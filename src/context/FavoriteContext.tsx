import React from "react";

const FavoriteContext = React.createContext<{
  favorites: Array<string>;
  setFavorites: any;
}>({
  favorites: [],
  setFavorites: (favorites: any) => {},
});

class FavoriteProvider extends React.Component<any, any> {
  // Context state
  state = {
    favorites: [],
  };

  // Method to update state
  setFavorites = (favorites: any) => {
    this.setState((prevState: any) => ({ favorites }));
  };

  render() {
    const { children } = this.props;
    const { favorites } = this.state;
    const { setFavorites } = this;

    return (
      <FavoriteContext.Provider
        value={{
          favorites,
          setFavorites,
        }}
      >
        {children}
      </FavoriteContext.Provider>
    );
  }
}

export default FavoriteContext;

export { FavoriteProvider };
