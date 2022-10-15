import React, { useEffect, useState } from "react";
import "./style.scss";
import { LaunchCard } from "../launch-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import { FilterDropDown } from "../filter-dropdown";
import { Favorites } from "../favorites";
import { useLaunches } from "../../hooks/useLaunches";

export const LaunchOverview = () => {
  const [offset, setOffset] = useState("");
  const [filter, setFilter] = useState("");
  const [filterValue, setFilterValue] = useState(0);
  const { items, isLoading, nextUrl, offsetLoading } = useLaunches({
    offset: offset,
    filter: filter,
  });

  useEffect(() => {
    console.log(items);
  }, [items]);

  const loadWithOffset = () => {
    console.log("loading with offset");
    setOffset(nextUrl);
  };

  const loadWithFilter = (event: any) => {
    const id = parseInt(event.target.value);
    let filterString = id === 0 ? "" : `?program=${id}`;
    setFilterValue(id);

    setFilter(filterString);
  };

  return (
    <div className="container">
      <Favorites></Favorites>
      <div className="head-wrapper">
        <div className="subtitle-container">
          <h2>Upcoming launches</h2>
        </div>
        <div className="filter-container">
          <p>Filter on program:</p>
          <FilterDropDown
            filterValue={filterValue}
            onChange={loadWithFilter}
          ></FilterDropDown>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loader-icon">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
        </div>
      ) : (
        <div className="result-wrapper">
          <Row>
            {items.map((item: any) => (
              <LaunchCard data={item} key={item.name} id={item.id}></LaunchCard>
            ))}
          </Row>

          {nextUrl ? (
            <div className="button-container">
              <button onClick={loadWithOffset}>
                {" "}
                {offsetLoading ? (
                  <FontAwesomeIcon icon={faSpinner} />
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
