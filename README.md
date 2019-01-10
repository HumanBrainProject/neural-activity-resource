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

For an example of the visualizer in action, see https://neo-viewer.brainsimulation.eu

## Using the visualizer component

Within the `<head>` block of your HTML page, put the following lines:

```
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.css">

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.7/angular.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.7/angular-resource.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-nvd3/1.0.8/angular-nvd3.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/apdavison/neural-activity-visualizer@reorg/js/src/visualizer.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/apdavison/neural-activity-visualizer@reorg/js/src/services.js"></script>
```

In the `<body>` block, add `<div ng-app="neo-visualizer">...</div` around the part of the page where the visualizer should appear.

You can have multiple visualizers on a single page. Wherever you want to have a visualizer, include
```
<visualizer-view 
    source="https://example.com/my_data_file.abf" 
    height=300>
</visualizer-view>
```
where `source` should be the URL of a publicly available data file you want to visualize.

### Configuring the app to use a different file server

Coming soon!

## Deploying the file server

By default, the visualizer uses the Neo file server at https://neo-viewer.brainsimulation.eu/. This is fine for testing and light use, but for better performance you may
wish to deploy your own server on a more powerful machine.

Instructions for doing this are [here](https://github.com/NeuralEnsemble/neo-viewer/blob/master/api/README.md#deployment).


## Reference: the file server REST API

See [here](https://github.com/NeuralEnsemble/neo-viewer/blob/master/api/README.mdhttps://github.com/NeuralEnsemble/neo-viewer/blob/master/api/README.md#api-documentation).
