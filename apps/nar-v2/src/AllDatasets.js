import React, { useEffect } from 'react';
import axios from 'axios';

const USE_EXAMPLE_DATA = false;
const baseUrl = "https://neural-activity-resource.brainsimulation.eu"

function get_datasets(auth) {
  let url = baseUrl + "/datasets/?name=reach-to-grasp";
  let config = {
    headers: {
      'Authorization': 'Bearer ' + auth.token,
    }
  }
  console.log("Getting datasets from " + url);
  return axios.get(url, config)
}


export default function AllDatasets(props) {

  useEffect(() => {
    //console.log("Getting pipeline data")
    if (USE_EXAMPLE_DATA) {
      console.log("todo");
    } else {
      get_datasets(props.auth)
      .then(res => {
        console.log("Got datasets");
        console.log(res.data);
      })
      .catch(err => {
        console.log('Error: ', err.message);
      });
    }
  }, []);

  return (
    <div>
      <p>Coming soon...</p>
    </div>
  );
}
