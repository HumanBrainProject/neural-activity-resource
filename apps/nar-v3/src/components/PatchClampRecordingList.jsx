import { Link as RouterLink } from "react-router-dom";

function uuidFromUri(uri) {
  const parts = uri.split("/");
  return parts[parts.length - 1];
}

function PatchClampRecordingList(props) {
  return (
    <ul>
      {props.tissueSamples.map((tissueSample) => (
        <li key={tissueSample.id}>
          <RouterLink to={uuidFromUri(tissueSample.id)}>{tissueSample.lookupLabel}</RouterLink>
        </li>
      ))}
    </ul>
  );
}

export default PatchClampRecordingList;
