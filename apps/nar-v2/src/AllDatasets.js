import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';


const USE_EXAMPLE_DATA = false;
const baseUrl = "https://neural-activity-resource.brainsimulation.eu"

function get_datasets(auth) {
  let url = baseUrl + "/datasets/";
  let config = {
    headers: {
      'Authorization': 'Bearer ' + auth.token,
    }
  }
  console.log("Getting datasets from " + url);
  return axios.get(url, config)
}


export default function AllDatasets(props) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.log("Got datasets");
        console.log(res.data);
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
          datasets.map((dataset, index) => (
            <li>{dataset.name}</li>
          ))
        }
        </ul>
      </div>
    );
  }
}
