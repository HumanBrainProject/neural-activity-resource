import Link from "@mui/material/Link";

import { uuidFromUri } from "../utility.js";


function getKGSearchUrl(uri) {
  const uuid = uuidFromUri(uri);
  return `https://search.kg.ebrains.eu/instances/${uuid}`;
}


function AgeDisplay(props) {
  const age = props.age
  if (age) {
    if (age.value) {
      return <span>{age.value} {age.unit}</span>
    } else {
      return <span>{age.minValue} {age.minValueUnit}-{age.maxValue} {age.maxValueUnit}</span>
    }
  } else {
    return ""
  }
}

function PatchClampRecordingCard(props) {
  console.log(props);
  const tissueSample = props.tissueSample;
  const tissueSampleCollectionState = tissueSample.studiedState[0].descendedFrom;

  return (
    <div>
      <h1>{tissueSample.lookupLabel}</h1>

      <h2>
        Part of dataset:{" "}
        <Link href={getKGSearchUrl(tissueSample.belongsToDataset.id)} target="_blank">
          {tissueSample.belongsToDataset.fullName ||
            tissueSample.belongsToDataset.isVersionOf.fullName}
        </Link>
      </h2>

      <dl>
        <dt>Location</dt>
        <dd>{tissueSample.anatomicalLocation[0].name}</dd>
        <dt>Species/strain</dt>
        <dd>{tissueSample.species.name}</dd>
        <dt>Cell type</dt>
        <dd>{tissueSample.origin.name}</dd>
        <dt>Sex</dt>
        <dd>{tissueSample.biologicalSex}</dd>
        <dt>Age</dt>
        <dd>
        <AgeDisplay age={tissueSample.studiedState[0].age} />
        </dd>
        <dt>Additional remarks</dt>
        <dd>{tissueSample.studiedState[0].additionalRemarks}</dd>
        <dt>Part of collection:</dt>
        <dd>{tissueSampleCollectionState.lookupLabel} ({tissueSampleCollectionState.isStateOf.type})</dd>
        <dt>Techniques</dt>
        <dd>{tissueSample.belongsToDataset.technique.join(", ")}</dd>
      </dl>
    </div>
  );
}

export default PatchClampRecordingCard;
