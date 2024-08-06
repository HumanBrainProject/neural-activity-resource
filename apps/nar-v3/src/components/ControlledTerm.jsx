import Tooltip from "@mui/material/Tooltip";

function ControlledTerm(props) {
  if (props.term) {
    if (props.term.definition || props.term.description) {
      let tooltipContent = props.term.definition || "";
      if (props.term.description) {
          tooltipContent += props.term.description;
      }
      return (
        <Tooltip title={tooltipContent}>
          <span style={{color: "darkgreen"}}>{props.term.name}</span>
        </Tooltip>
      );
    } else {
      return props.term.name;
    }
  } else {
    return "";
  }
}

export default ControlledTerm;
