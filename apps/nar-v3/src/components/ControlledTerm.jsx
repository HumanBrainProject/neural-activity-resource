import Tooltip from "@mui/material/Tooltip";

function ControlledTerm(props) {
  if (props.term.definition) {
    return (
      <Tooltip title={props.term.definition + props.term.description}>
        <span>{props.term.name}</span>
      </Tooltip>
    );
  } else {
    return props.term.name;
  }
}

export default ControlledTerm;
