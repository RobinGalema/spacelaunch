import React from "react";
import { BASE_URL } from "../../services/global";
import "./style.scss";

interface mainState {
  programs: Array<any>;
}

type Props = {
  onChange: Function;
  filterValue: number;
};

class FilterDropdown extends React.Component<Props, mainState> {
  constructor(props: any) {
    super(props);

    this.state = {
      programs: [],
    };
  }

  componentDidMount() {
    this.loadPrograms(`${BASE_URL}/program/?format=json&limit=10&offset=0`, []);
  }

  updateFilter = (event: any) => {
    this.props.onChange(event);
  };

  loadPrograms = (url: string, previousResult: any): any => {
    return fetch(url)
      .then((res) => res.json())
      .then((response) => {
        let activePrograms: Array<any> = [];
        response.results.map((result: any) => {
          if (!result.end_date) activePrograms.push(result);
        });

        const result = [...previousResult, ...activePrograms];

        if (response.next != null) {
          return this.loadPrograms(response.next, result);
        }

        this.setState({
          programs: result,
        });
      });
  };

  render() {
    const { programs } = this.state;

    return (
      <div className="filter-container">
        <select value={this.props.filterValue} onChange={this.updateFilter}>
          <option value={"0"}>Show All</option>
          {programs.map((program: any) => (
            <option value={program.id} key={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default FilterDropdown;
