import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function ExpandComponent(props) {
  const classes = useStyles();
  

  return (
    
    
    <div className={classes.root}>
    
     
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading} component={"span"}>More info </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"span"}>
            <div id="description_id">{props.dataset.description} </div> <br/> 
            <div id="custodians_id"> {props.dataset.custodians} </div> 
          </Typography>
        </AccordionDetails>
      </Accordion>
          
  
    </div>
    
    
  );
}

export default ExpandComponent