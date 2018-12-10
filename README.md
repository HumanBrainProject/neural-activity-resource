# Neural Activity Visualizer

A Javascript component (built with AngularJS) for visualizing neural activity data
(analog signals, spike trains etc.) stored in any of the file formats supported by
the [Neo](http://neuralensemble.org/neo) library.

```html
<div ng-app="neo-visualizer">
    <visualizer-view
        source="https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/Migliore_2018_CA1/exp_data/abf-int-bAC/Ivy_960711AHP3/96711008.abf"
        height=400>
    </visualizer-view>
</div>
```


## Using the visualizer component

headers

visualizer tag

configuring the app to use a different file server


## Deploying the file server

By default, the visualizer uses the Neo file server at https://neo-viewer.brainsimulation.eu/. This is fine for testing and light use, but for better performance you may
wish to deploy your own server on a more powerful machine.

docker container


## Reference: the file server REST API


