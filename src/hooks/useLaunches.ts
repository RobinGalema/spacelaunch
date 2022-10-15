import { useEffect, useState } from "react";
import { BASE_URL } from "../services/global";

interface Params {
  offset?: string;
  filter?: string;
}

export const useLaunches = ({ offset, filter }: Params) => {
  const [items, setItems] = useState(Array<any>);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUrl, setnextUrl] = useState("");
  const [offsetLoading, setOffsetLoading] = useState(false);

  useEffect(() => {
    console.log(offset, filter);
    if (offset === "" && filter === "") loadItems();
    if (offset !== "" && offset) loadItemsWithOffset();
    if (filter !== "" && filter) loadItemsWithFilter();
  }, [filter, offset]);

  const loadItems = () => {
    fetch(`${BASE_URL}/launch/upcoming/?format=json`)
      .then((res) => res.json())
      .then((result) => {
        setIsLoading(false);
        setItems(result.results);
        setnextUrl(result.next);
      });
  };

  const loadItemsWithOffset = () => {
    if (!nextUrl) return;
    setOffsetLoading(true);

    fetch(nextUrl)
      .then((res) => res.json())
      .then((result) => {
        let newItems = [...items, ...result.results];

        setItems(newItems);
        setnextUrl(result.next);
        setOffsetLoading(false);
      });
  };

  const loadItemsWithFilter = () => {
    fetch(`https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming${filter}`)
      .then((res) => res.json())
      .then((result) => {
        setItems(result.results);
        setnextUrl(result.next);
        setIsLoading(false);
      });

    setIsLoading(true);
    setItems([]);
  };

  return { items, isLoading, nextUrl, offsetLoading };
};
