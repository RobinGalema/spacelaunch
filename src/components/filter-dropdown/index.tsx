import React from "react";
import { usePrograms } from "../../hooks/usePrograms";

import "./style.scss";

type Props = {
  onChange: Function;
  filterValue: number;
};

export const FilterDropDown = (props: Props) => {
  const { programs } = usePrograms();

  const updateFilter = (event: any) => {
    props.onChange(event);
  };

  return (
    <div className="filter-container">
      <select value={props.filterValue} onChange={updateFilter}>
        <option value={"0"}>Show All</option>
        {programs.map((program: any) => (
          <option value={program.id} key={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
};
