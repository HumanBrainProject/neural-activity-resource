# Neural Activity Resource app

Code for the Neural Activity Resource app.

This is an experimental interface for in-depth metadata in the [EBRAINS Knowledge Graph](https://kg.ebrains.eu).
It is not yet intended for public use.

Copyright 2017, Centre National de la Recherche Scientifique and Forschungszentrum Jülich;
Copyright 2018-2024 Centre National de la Recherche Scientifique

Code is licenced under the Apache 2.0 licence.

## Developers' Guide

The app is implemented using React Router v6, with Material UI for layout and design.
Data are retrieved from the EBRAINS Knowledge Graph using the [KG Core API](https://docs.kg.ebrains.eu/).

### Setting up a development environment

The main code repository is https://gitlab.ebrains.eu/data-services/neural-activity-resource.
You should fork this into your own account.

  $ git clone https://gitlab.ebrains.eu/<your account>/neural-activity-resource

  $ cd neural-activity-resource/apps/nar-v3
  $ npm install

To run a development server, you will need to obtain an EBRAINS IAM authorization token,
paste it into src/main.jsx, then run:

  $ npm run dev

Before committing changes, make sure the test suite passes:

  $ npm run test

To see which code needs more tests:

  $ npm run coverage


### Deployment

The app is deployed to https://nar.apps.tc.humanbrainproject.eu using Kubernetes.
See the "deployment" folder and .gitlab-ci.yml for more details.


## Acknowledgements
This open source software code was developed in part or in whole in the Human Brain Project, funded from the European Union's Horizon 2020 Framework Programme for Research and Innovation under Specific Grant Agreement 945539 (Human Brain Project SGA3), and in EBRAINS 2.0, funded from the EU Horizon Europe programme under grant agreement 101147319.
