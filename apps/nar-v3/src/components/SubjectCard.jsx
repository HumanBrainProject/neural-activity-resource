/*
The SubjectCard component displays information about an experimental subject/participant.

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

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { formatUnits } from "../utility";
import { NavigateNext, NavigatePrevious } from "./Navigation";
import KeyValueTable from "./KeyValueTable";
import styles from "../styles";

function AgeDisplay(props) {
  const age = props.age;
  if (age) {
    if (age.value) {
      return (
        <span>
          {age.value} {formatUnits(age.unit)}
        </span>
      );
    } else {
      return (
        <span>
          {age.minValue} {formatUnits(age.minValueUnit)}-{age.maxValue}{" "}
          {formatUnits(age.maxValueUnit)}
        </span>
      );
    }
  } else {
    return "";
  }
}

function SubjectCard(props) {
  const subject = props.subjects[props.index];

  let species = "";
  let strain = "";
  if (subject.species) {
    if (subject.species.species) {
      strain = subject.species.name;
      species = subject.species.species;
    } else {
      species = subject.species.name;
    }
  }

  const data = {
    Species: species,
    Strain: strain,
    Age: <AgeDisplay age={subject.studiedState[0].age} />,
    "Age category": subject.studiedState[0].ageCategory,
    Pathologies:
      subject.studiedState[0].pathology.length > 0
        ? subject.studiedState[0].pathology[0].name
        : "none",
  };
  if (!strain) {
    delete data.Strain;
  }

  return (
    <Stack direction="row" spacing={1}>
      <Stack sx={{ width: "60px" }} justifyContent="center">
        {props.index > 0 ? (
          <NavigatePrevious onClick={() => props.setIndex(props.index - 1)} />
        ) : (
          ""
        )}
      </Stack>
      <Box sx={styles.entity} component={Paper} variant="outlined">
        <h2>Subject {subject.lookupLabel}</h2>
        <p>
          ({props.index + 1} of {props.subjects.length})
        </p>
        {/* todo: add subject group information */}
        <KeyValueTable boldKeys data={data} />
      </Box>
      <Stack sx={{ width: "60px" }} justifyContent="center">
        {props.index < props.subjects.length - 1 ? (
          <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
        ) : (
          ""
        )}
      </Stack>
    </Stack>
  );
}

export default SubjectCard;
