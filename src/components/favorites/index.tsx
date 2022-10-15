import { useEffect } from "react";
import Row from "react-bootstrap/Row";
import { useFavorites } from "../../hooks/useFavorites";
import { LaunchCard } from "../launch-card";

export const Favorites = () => {
  const { favorites, isLoading } = useFavorites();

  useEffect(() => {
    if (!isLoading) console.log(favorites, favorites.length);
    console.log("Loading favorites...");
  }, []);

  return (
    <div className="favorites-wrapper">
      {isLoading ? (
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
};
