import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";

import Visualizer from "neural-activity-visualizer-react";
import { Typography } from "@material-ui/core";

import PropertyTable from "./PropertyTable";

import { baseUrl } from "./globals";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
}));

function getRecording(auth, recordingId) {
  let url = baseUrl + "/recordings/" + recordingId;
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log("Getting recording from " + url);
  return axios.get(url, config);
}

function QuantitativeValue(props) {
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {props.value} {props.units}
    </span>
  );
}

function formatList(obj) {
  if (obj && obj.constructor === Array) {
    return (
      <ul>
      {
        obj.map((item) => {
          return <li>{item}</li>
        })
      }
      </ul>
    )
  } else {
    return obj;
  }
}

function Channels(props) {
  console.log(props.channels);
  return (
    <div>
      {props.channels.map((channel, index) => {
        return (
          <span>
            {channel.label} [{channel.units}]&nbsp;
          </span>
        );
      })}
    </div>
  );
}

function GenerationMetadata(props) {
  const { gen } = props;

  if (gen) {
    return (
      <Grid item>
      <PropertyTable
        title="Generation metadata"
        rows={[
          ["Repetition", gen.repetition],
          ["Timestamp", gen.at_time],
          ["Experiment ID", gen.provider_experiment_id],
          ["Lab internal name", gen.provider_experiment_name],
          [
            "Target holding potential",
            <QuantitativeValue {...gen.holding_potential} />,
          ],
          [
            "Measured holding potential",
            <QuantitativeValue {...gen.measured_holding_potential} />
          ],
          ["Input resistance", <QuantitativeValue {...gen.input_resistance} />],
          [
            "Series resistance",
            <QuantitativeValue {...gen.series_resistance} />
          ],
          [
            "Compensation current",
            <QuantitativeValue {...gen.compensation_current} />,
          ],
          ["Sweeps", gen.sweeps],
          ["Channel type", gen.channel_type],
          [
            "Sampling frequency",
            <QuantitativeValue {...gen.sampling_frequency} />
          ],
          [
            "Power line frequency",
            <QuantitativeValue {...gen.power_line_frequency} />,
          ],
          ["Seal resistance", <QuantitativeValue {...gen.seal_resistance} />],
          [
            "Pipette resistance",
            <QuantitativeValue {...gen.pipette_resistance} />,
          ],
          [
            "Liquid junction potential",
            <QuantitativeValue {...gen.liquid_junction_potential} />,
          ],
          [
            "Start membrane potential",
            <QuantitativeValue {...gen.start_membrane_potential} />,
          ],
          [
            "End membrane potential",
            <QuantitativeValue {...gen.end_membrane_potential} />,
          ],
          ["Pipette solution", gen.pipette_solution],
          ["Labelling compound", gen.labeling_compound],
          [
            "Chloride reversal potential",
            <QuantitativeValue {...gen.reversal_potential_cl} />,
          ],
        ]}
      />
      </Grid>
    );
  } else {
    return <Grid item />;
  }
}

function RecordedFrom(props) {
  const { source } = props;

  if (source) {
    return (
      <Grid item>
        <PropertyTable
        title="Recorded from"
        rows={[
        ["Type", source.type],
        ["Brain region", formatList(source.location)],
        ["Species", source.subject.species],
        ["Strain", source.subject.strain],
        ["Subject name", source.subject.name],
        ["Age", source.subject.age],
        ["Sex", source.subject.sex],
        ["Cell type",source.cell_type]
        ]}
        />
      </Grid>
    );
  } else {
    return <Grid item />;
  }
}

export default function PatchClamp(props) {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [recording, setRecording] = React.useState({
    data_location: [],
    generation_metadata: {},
    recorded_from: {
      subject: {},
      preparation: {}
    },
    channels: [],
    part_of: {},
  });
  let { recordingId } = useParams();
  const classes = useStyles();

  React.useEffect(() => {
    setLoading(true);
    getRecording(props.auth, recordingId)
      .then((res) => {
        console.log("Got recording");
        console.log(res.data);
        setRecording(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage("Error: ", err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else if (errorMessage) {
    return (
      <div>
        <p>{errorMessage}</p>
      </div>
    );
  } else {
    return (
      <Container className={classes.root} maxWidth="lg">
        <Typography variant="h5">{recording.label}</Typography>
        <Typography variant="subtitle1">
          Part of{" "}
          <Link target="blank_" href={recording.part_of.uri}>
            {recording.part_of.name}
          </Link>
        </Typography>

        {recording.data_location.map((item, index) => {
          return (
            <Visualizer
              source={item.location}
              showSpikeTrains={false}
              showSignals={true}
            />
          );
        })}
      <Grid container spacing={4}>
        <GenerationMetadata gen={recording.generation_metadata} />

        <RecordedFrom source={recording.recorded_from} />

        <Grid item>
          <PropertyTable
            title="Slice preparation"
            rows={[
              ["Hemisphere", recording.recorded_from.hemisphere],
              ["Slicing plane", recording.recorded_from.slicing_plane],
              ["Slicing angle", <QuantitativeValue {...recording.recorded_from.slicing_angle} />],
              ["Thickness", <QuantitativeValue {...recording.recorded_from.cutting_thickness} />],
              ["Cutting solution", recording.recorded_from.solution]
            ]}
          />
        </Grid>

        <Grid item>
          <PropertyTable
            title="Other"
            rows={[
                  ["Channels", <Channels channels={recording.channels} />],
                  ["Time step", <QuantitativeValue {...recording.time_step} />],
                  ["Timestamp", recording.timestamp],
                  ["Identifier", recording.identifier],
                  ["Contact", recording.performed_by],
                  ["Stimulation", recording.stimulation],
                  ["Modality", recording.modality]
                ]}
                />
        </Grid>



        </Grid>
      </Container>
    );
  }
}
