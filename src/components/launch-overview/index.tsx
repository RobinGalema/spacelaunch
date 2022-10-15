import React from "react";
import "./style.scss";
import { LaunchCard } from "../launch-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";
import { FilterDropDown } from "../filter-dropdown";
import { FavoritesFunc } from "../favorites";
import FavoriteContext from "../../context/FavoriteContext";

type Props = {};

class LaunchOverview extends React.Component<{}, any, Props> {
  static contextType = FavoriteContext;
  context!: React.ContextType<typeof FavoriteContext>;

  constructor(props: any) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      nextUrl: null,
      offsetLoading: false,
      filterValue: 0,
    };
  }

  componentDidMount() {
    fetch("https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming/?format=json")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.results,
            nextUrl: result.next,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error.message,
          });
        }
      );
  }

  loadWithOffset = () => {
    if (!this.state.nextUrl) return;

    this.setState({ offsetLoading: true });

    fetch(this.state.nextUrl)
      .then((res) => res.json())
      .then(
        (result) => {
          let newItems = [...this.state.items, ...result.results];

          this.setState({
            items: newItems,
            nextUrl: result.next,
            offsetLoading: false,
          });
        },
        (error) => {
          this.setState({
            error: error.message,
            offsetloading: false,
          });
        }
      );
  };

  loadWithFilter = (event: any) => {
    const id = parseInt(event.target.value);
    let filterString = id === 0 ? "" : `?program=${id}`;

    fetch(
      `https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming${filterString}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.results,
            nextUrl: result.next,
            filterValue: id,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error.message,
          });
        }
      );

    this.setState({
      isLoaded: false,
      items: [],
    });
  };

  render() {
    const { error, isLoaded, items, offsetLoading, filterValue, nextUrl } =
      this.state;
    const { favorites } = this.context;

    return (
      <div className="container">
        <FavoritesFunc></FavoritesFunc>
        <div className="head-wrapper">
          <div className="subtitle-container">
            <h2>Upcoming launches</h2>
          </div>
          <div className="filter-container">
            <p>Filter on program:</p>
            <FilterDropDown
              filterValue={filterValue}
              onChange={this.loadWithFilter}
            ></FilterDropDown>
          </div>
        </div>

        {error ? (
          <p>Something went wrong!</p>
        ) : !isLoaded ? (
          <div className="loading-container">
            <div className="loader-icon">
              <FontAwesomeIcon icon={faSpinner} />
            </div>
          </div>
        ) : (
          <div className="result-wrapper">
            <Row>
              {items.map((item: any) => (
                <LaunchCard
                  data={item}
                  key={item.name}
                  id={item.id}
                ></LaunchCard>
              ))}
            </Row>

            {nextUrl ? (
              <div className="button-container">
                <button onClick={this.loadWithOffset}>
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
  }
}

export default LaunchOverview;
