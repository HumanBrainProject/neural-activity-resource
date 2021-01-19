import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import './AllDatasets.css';
 
import { makeStyles } from '@material-ui/core/styles';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ExpandComponent from './ExpandComponent';
//import classes from '*.module.css';




const USE_EXAMPLE_DATA = false;
const baseUrl = "https://neural-activity-resource.brainsimulation.eu"

function get_datasets(auth) {
  let url = baseUrl + "/datasets/";
  let config = {
    headers: {
      'Authorization': 'Bearer ' + auth.token,
    }
  }
  console.log("Getting datasets from " + url); //1
  return axios.get(url, config)
}

function getDatasetsMethods(tab)
{
  var i=0;
  let theMethod = [];
      /*for (let i = 0; ; i++) {
        console.log(i)
        theMethod = tab[i]; 
      } */
      while( i < tab.length) {
        
        
        theMethod.push(tab[i])
        i++
  
      }
      return theMethod
}


export default function AllDatasets(props) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datamethods, setDataMethods] = useState([]);

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    header: {
      backgroundColor:'#c26e29', 
    },
    
  }));

  const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
      };


  useEffect(() => {
    // React calls this when the component is mounted, updated or unmounted
    // see https://reactjs.org/docs/hooks-effect.html
    // Here we use it to load data
    if (USE_EXAMPLE_DATA) {
      console.log("todo");
    } else {
      setLoading(true);
      get_datasets(props.auth)
      .then(res => {
        console.log("Got datasets");          //2
        console.log(res.data);                //3
        setDatasets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error: ', err.message);
      });
    }
  }, []);

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '200px'}}>
          <CircularProgress />
      </div>
    )
  } else {
    
    
    
    
    return (
      <div>
        
       
      <ul>
        { 
      
          //Créer une version statique et strucutrer des champs de la dataset
          datasets.map((dataset, index) => (
          
          <li key={index} >
          <Card >

          
          

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="span">
                  <CardHeader
                      style={{ backgroundColor: '', }}
                      title={dataset.name}
                      subheader={
                        getDatasetsMethods(dataset.methods).map
                        (
                        (method, index) => 
                        {
                          return <span className={"span_methods"} id={"methods_id"} key={index} > {method} </span>
                        }
                        )
                      }
          />
                <div className={classes.root}>
                <label htmlFor="icon-button-file">
                  <IconButton 
                      variant="contained"
                      size="small"
                      className="classesButton"
                      label="Open in Knowledge Graph Search" 
                             
                      onClick={()=> {console.log("Yeah")}} 
                      href={dataset.uri}> <OpenInNewIcon />  
                    </IconButton>
                   <a id={"OKGS"}>Open in Knowledge Graph Search <br/> </a> 

                  </label>

                </div>
                  
           <ExpandComponent dataset={dataset} />        

              
          </Typography>
          </CardContent> 
          </Card>       
        </li>
          ))
        }
        </ul>
            

        
        
      </div>
    );
  }
}


