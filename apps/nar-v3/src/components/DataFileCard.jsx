/*
The DataFileCard component displays metadata about a data file.

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
import Visualizer from "neural-activity-visualizer-react";
import "neural-activity-visualizer-react/style.css";

import { formatQuant, formatUnits } from "../utility";
import { NavigateNext, NavigatePrevious } from "./Navigation";
import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import styles from "../styles";

const NEO_FORMAT_NAMES = new Set([
  "application/vnd.alphaomega-eng",
  "application/vnd.blackrockmicrosystems.neuralevents",
  "application/vnd.blackrockmicrosystems.neuralsignals.1",
  "application/vnd.blackrockmicrosystems.neuralsignals.2",
  "application/vnd.blackrockmicrosystems.neuralsignals.3",
  "application/vnd.blackrockmicrosystems.neuralsignals.4",
  "application/vnd.blackrockmicrosystems.neuralsignals.5",
  "application/vnd.blackrockmicrosystems.neuralsignals.6",
  "application/vnd.blackrockmicrosystems.neuralsignals.7",
  "application/vnd.blackrockmicrosystems.neuralsignals.8",
  "application/vnd.blackrockmicrosystems.neuralsignals.9",
  "application/vnd.blackrockmicrosystems.parallelrecordings",
  "application/vnd.brainvision.binary",
  "application/vnd.brainvision.header",
  "application/vnd.brainvision.marker",
  "application/vnd.brainproducts",
  "application/vnd.edf",
  "application/vnd.edf+",
  "application/vnd.eeglab",
  "application/vnd.elan.event",
  "application/vnd.g-node.nix.neo",
  "application/vnd.hyland.brainwaredam",
  "application/vnd.hyland.brainwaref32",
  "application/vnd.hyland.brainwaresrc",
  "application/vnd.igorpro",
  "application/vnd.indec-biosystems.axonrawformat",
  "application/vnd.intan.technology",
  "application/vnd.klustakwik",
  "application/vnd.kwik",
  "application/vnd.mearec",
  "application/vnd.micromed",
  "application/vnd.micromedgroup",
  "application/vnd.moleculardevices.axon",
  "application/vnd.neo.ascii.signal",
  "application/vnd.neo.ascii.spiketrain",
  "application/vnd.nest-simulator.recording",
  "application/vnd.neuralynx",
  "application/vnd.nsdf",
  "application/vnd.nwb.nwbn+hdf",
  "application/vnd.openephys",
  "application/vnd.plexon",
  "application/vnd.plexon.neuroexplorer",
  "application/vnd.raw.binarysignal",
  "application/vnd.raw.mcs",
  "application/vnd.rawbinarysignal",
  "application/vnd.spike2.sonpy.son",
  "application/vnd.spikeglx.system",
  "application/vnd.stimfit",
  "application/vnd.tdt",
  "application/vnd.wavemetrics.igorpro",
  "application/vnd.winedr",
  "application/vnd.winwcp",
]);

const NEO_EXTENSIONS = new Set([
  ".map", ".nev", ".ns1", ".ns2", ".ns3", ".ns4", ".ns5", ".ns6", ".ns7", ".ns8", ".ns9",
  ".eeg", ".vhdr", ".vmrk", ".edf", ".sat", ".pos", ".nix",
  ".dam", ".f32", ".src",
  ".ibw", ".pxp", ".arf", ".rhd", ".rhs",
  ".kwik", ".trc", ".abf", ".asc", ".gdf", ".dat",
  ".ncs", ".nse", ".ntt", ".nsdf", ".nwb",
  ".plx", ".nex", ".raw", ".smr",
  ".abf2", ".atf", ".axgx", ".axgd", ".cfs", ".heka", ".hdf5",
  ".igor", ".edr", ".wcp",
]);

function isNeoReadable(fileObj) {
  if (fileObj.format && fileObj.format.name) {
    return NEO_FORMAT_NAMES.has(fileObj.format.name);
  }
  const dot = fileObj.name.lastIndexOf(".");
  const ext = dot >= 0 ? fileObj.name.slice(dot).toLowerCase() : "";
  return NEO_EXTENSIONS.has(ext);
}

function DataFileCard(props) {
  let fileObj = null;
  if (props.fileObjects) {
    fileObj = props.fileObjects[props.index];
  }

  if (fileObj) {
    const data = {
      "Sampling frequency": formatQuant(fileObj.metadata.samplingFrequency),
      Channels: (
        <ul>
          {fileObj.metadata.channel.map((item) => (
            <li key={item.internalIdentifier}>
              {item.internalIdentifier} ({formatUnits(item.unit)})
            </li>
          ))}
        </ul>
      ),
      "Data type": fileObj.dataType ? fileObj.dataType.name : "unknown",
      Format: fileObj.format ? fileObj.format.name : "unknown",
      Hash: (
        <>
          {fileObj.hash.map((item) => (
            <span key={item.algorithm}>
              {item.algorithm}: {item.digest}&nbsp;
            </span>
          ))}
        </>
      ),
      Size: formatQuant(fileObj.storageSize),
      "Additional remarks": fileObj.metadata.additionalRemarks,
    };

    return (
      <>
        <Connection />
        <Stack direction="row" spacing={1}>
          <Stack sx={{ width: "60px" }} justifyContent="center">
            {props.index > 0 ? (
              <NavigatePrevious onClick={() => props.setIndex(props.index - 1)} />
            ) : (
              ""
            )}
          </Stack>
          <Box sx={styles.entity} component={Paper} variant="outlined">
            <h2>File {fileObj.name}</h2>

            <KeyValueTable boldKeys data={data} />
            {isNeoReadable(fileObj) && <Box sx={{ pt: 8 }}><Visualizer source={fileObj.IRI} /></Box>}
          </Box>
          <Stack sx={{ width: "60px" }} justifyContent="center">
            {props.index < props.fileObjects.length - 1 ? (
              <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      </>
    );
  } else {
    return "";
  }
}

export default DataFileCard;
