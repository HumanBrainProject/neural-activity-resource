/*
The DatasetCard component is the main component for displaying dataset versions.

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

import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";

import { getKGSearchUrl } from "../utility";
import SubjectCard from "./SubjectCard";
import SlicePreparationCard from "./SlicePreparationCard";
import SliceCard from "./SliceCard";
import CellPatchingCard from "./CellPatchingCard";
import PatchedCellCard from "./PatchedCellCard";
import RecordingCard from "./RecordingCard";
import DataFileCard from "./DataFileCard";

function DatasetCard(props) {
  const dataset = props.dataset;
  const subjects = dataset.studiedSpecimen;

  const [subjectIndex, _setSubjectIndex] = useState(0);
  const [sliceIndex, _setSliceIndex] = useState(0);

  const setSubjectIndex = (index) => {
    if (index >= 0 && index < subjects.length) {
      _setSubjectIndex(index);
      if (subjects[index].studiedState[0].slicePreparation) {
        setSliceIndex(0);
      }
    }
  };

  const setSliceIndex = (index) => {
    if (
      index >= 0 &&
      index < subjects[subjectIndex].studiedState[0].slicePreparation[0].output.length
    ) {
      _setSliceIndex(index);
    }
  };

  const getSlicePreparation = (subjectIndex) => {
    const state = subjects[subjectIndex].studiedState[0];
    if (state.slicePreparation) {
      return state.slicePreparation[0];
    } else {
      return null;
    }
  };

  const getSlices = (subjectIndex) => {
    const slicePrep = getSlicePreparation(subjectIndex);
    if (slicePrep) {
      return slicePrep.output;
    } else {
      return null;
    }
  };

  const getCellPatching = (subjectIndex, sliceIndex) => {
    const slices = getSlices(subjectIndex);
    if (slices) {
      const slice = slices[sliceIndex];
      return slice.cellPatching[0];
    } else {
      return null;
    }
  };

  const getPatchedCell = (subjectIndex, sliceIndex) => {
    const cellPatching = getCellPatching(subjectIndex, sliceIndex);
    if (cellPatching) {
      return cellPatching.output[0];
    } else {
      return null;
    }
  };

  const getRecordingActivity = (subjectIndex, sliceIndex) => {
    const patchedCell = getPatchedCell(subjectIndex, sliceIndex);
    if (patchedCell) {
      return patchedCell.recordingActivity[0];
    } else {
      return null;
    }
  };

  const getStimulationActivity = (subjectIndex, sliceIndex) => {
    const patchedCell = getPatchedCell(subjectIndex, sliceIndex);
    if (patchedCell) {
      return patchedCell.stimulationActivity[0];
    } else {
      return null;
    }
  };

  const getDataFiles = (subjectIndex, sliceIndex) => {
    const recordingActivity = getRecordingActivity(subjectIndex, sliceIndex);
    if (recordingActivity) {
      return recordingActivity.output[0];
    } else {
      return null;
    }
  };

  const formatAuthors = (dataset) => {
    const authors = dataset.author.length > 0 ? dataset.author : dataset.isVersionOf.author;
    return authors.map((person) => `${person.givenName} ${person.familyName}`).join(", ");
  };

  console.log("Rendering dataset in DatasetCard.jsx");
  console.log(dataset);

  return (
    <div>
      <h1>
        {dataset.fullName || dataset.isVersionOf.fullName}
        <Button
          href={getKGSearchUrl(dataset["@id"] || dataset.id)}
          target="_blank"
          variant="outlined"
          sx={{ marginLeft: 2 }}
        >
          View in KG Search
        </Button>
      </h1>
      <Typography variant="h6" gutterBottom>
        {formatAuthors(dataset)}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <div>
          <b>Licence: </b>
          {dataset.license}
        </div>
        <div>
          <b>Ethics assessment: </b>
          {dataset.ethicsAssessment}
        </div>
        <div>
          <b>Version: </b>
          {dataset.versionIdentifier}
        </div>
        <div>
          <b>Released: </b>
          {dataset.releaseDate}
        </div>
      </Stack>
      <Markdown>{dataset.description || dataset.isVersionOf.description}</Markdown>

      {subjects ? (
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: 5, marginTop: 3 }}
        >
          <SubjectCard subjects={subjects} index={subjectIndex} setIndex={setSubjectIndex} />

          <SlicePreparationCard activity={getSlicePreparation(subjectIndex)} />

          <SliceCard slices={getSlices(subjectIndex)} index={sliceIndex} setIndex={setSliceIndex} />

          <CellPatchingCard activity={getCellPatching(subjectIndex, sliceIndex)} />

          <PatchedCellCard cell={getPatchedCell(subjectIndex, sliceIndex)} />

          <RecordingCard
            recording={getRecordingActivity(subjectIndex, sliceIndex)}
            stimulation={getStimulationActivity(subjectIndex, sliceIndex)}
          />

          <DataFileCard fileObj={getDataFiles(subjectIndex, sliceIndex)} />
        </Stack>
      ) : (
        ""
      )}
    </div>
  );
}

export default DatasetCard;
