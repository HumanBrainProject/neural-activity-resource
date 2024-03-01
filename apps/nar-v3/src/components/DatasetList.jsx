import { Link as RouterLink } from "react-router-dom";

import { uuidFromUri } from "../utility";

function DatasetList(props) {
  return (
    <ul>
      {props.datasets.map((dataset) => (
        <li key={dataset.id}>
          <RouterLink to={uuidFromUri(dataset.id)}>
            {dataset.fullName || dataset.isVersionOf.fullName}
          </RouterLink>
        </li>
      ))}
    </ul>
  );
}

export default DatasetList;
