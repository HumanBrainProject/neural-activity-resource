/*
The PatchClampRecordingCard component displays metadata about recordings
from an individual neuron using the patch clamp technique.


Copyright 2024 Andrew P. Davison, CNRS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


import Link from "@mui/material/Link";

import { uuidFromUri } from "../utility.js";

function getKGSearchUrl(uri) {
  const uuid = uuidFromUri(uri);
  return `https://search.kg.ebrains.eu/instances/${uuid}`;
}

function AgeDisplay(props) {
  const age = props.age;
  if (age) {
    if (age.value) {
      return (
        <span>
          {age.value} {age.unit}
        </span>
      );
    } else {
      return (
        <span>
          {age.minValue} {age.minValueUnit}-{age.maxValue} {age.maxValueUnit}
        </span>
      );
    }
  } else {
    return "";
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
        <dd>{tissueSample.species ? tissueSample.species.name : "not available"}</dd>
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
        <dd>
          {tissueSampleCollectionState.lookupLabel} ({tissueSampleCollectionState.isStateOf.type})
        </dd>
        <dt>Techniques</dt>
        <dd>{tissueSample.belongsToDataset.technique.join(", ")}</dd>
      </dl>
    </div>
  );
}

export default PatchClampRecordingCard;
