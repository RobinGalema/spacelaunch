import { useEffect, useState } from "react";
import { BASE_URL } from "../services/global";

export const usePrograms = () => {
  const [programs, setPrograms] = useState(Array<any>);

  const loadPrograms = (url: string, previousResult: any): any => {
    return fetch(url)
      .then((res) => res.json())
      .then((response) => {
        let activePrograms: Array<any> = [];
        response.results.map((result: any) => {
          if (!result.end_date) activePrograms.push(result);
        });

        const result = [...previousResult, ...activePrograms];

        if (response.next != null) {
          return loadPrograms(response.next, result);
        }

        setPrograms(result);
      });
  };

  useEffect(() => {
    loadPrograms(`${BASE_URL}/program/?format=json&limit=10&offset=0`, []);
  }, []);

  return { programs };
};
