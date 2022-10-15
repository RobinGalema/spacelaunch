import { useCallback, useContext, useEffect, useState } from "react";
import FavoriteContext from "../context/FavoriteContext";
import { BASE_URL } from "../services/global";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(Array<any>);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFavorites, setCurrentFavorites] = useState(Array<any>);
  const context = useContext(FavoriteContext);

  const loadFavorites = useCallback((): void => {
    const favoriteIds = Array.from(
      JSON.parse(localStorage.getItem("favorites") || "{}")
    );

    if (context.favorites === favoriteIds) return;
    // Update the global context
    context.setFavorites(favoriteIds);
    setCurrentFavorites(favoriteIds);

    if (favoriteIds.length === 0) setIsLoading(false);
    let elements: Array<any> = [];

    Promise.all(
      favoriteIds.map(async (favorite) => {
        await fetch(`${BASE_URL}/launch/${favorite}`)
          .then((res) => res.json())
          .then((result) => {
            elements.push(result);
          });
      })
    ).then(() => {
      console.log("favorites", elements);
      setFavorites(elements);
      setIsLoading(false);
    });
  }, []);

  /** Function that adds fetches a single launch to add to the list of favorites
   * @param {string} favoriteId The ID of the favorite to add
   */
  const addFavorite = useCallback(
    (id: string) => {
      fetch(`${BASE_URL}/launch/${id}`)
        .then((res) => res.json())
        .then((result) => {
          setFavorites(favorites.concat([result]));
        });
    },
    [favorites]
  );

  /**Function to remove favorite from the list of favorites using updated context
   * @param {Array<string>} newFavorites List of new favorites ids
   */
  const removeFavorite = useCallback(
    (newFavorites: Array<string>): void => {
      let diff = currentFavorites?.filter((x) => !newFavorites.includes(x))[0];

      if (!diff) return;
      currentFavorites?.splice(currentFavorites.indexOf(diff), 1);

      let tempArray = favorites.filter((item) => item.id !== diff);

      setFavorites(tempArray);
    },
    [currentFavorites, favorites]
  );

  // On Mount UseEffect
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // On Context update UseEffect
  useEffect(() => {
    if (isLoading) return;
    const newFavorites = context.favorites;

    if (currentFavorites === newFavorites) return;

    if (newFavorites.length > currentFavorites!.length) {
      console.log("Adding new favorite");
      addFavorite(newFavorites[newFavorites.length - 1]);
      setCurrentFavorites(newFavorites);
      return;
    }
    console.log("Removing favorite");
    removeFavorite(newFavorites);
    return;
  }, [addFavorite, context, currentFavorites, isLoading, removeFavorite]);

  return { favorites, isLoading };
};
