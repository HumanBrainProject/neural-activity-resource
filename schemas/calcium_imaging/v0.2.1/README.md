# Data/shapes/schema graphs

* `schema`         : copy of narci v0.2.1.
* `narci_sh.ttl`   : narci Shapes graph using narci v0.2.1.
* `narci_data.ttl` : An example data graph that is valid.
* `auto_json`      : Auto generate JSON-LD files from turtle for nexus.

# Data/shapes validation

* `validate.bash` : A bash script that invokes `node.js` application 
                    that is available under this repository.
* `validate_report.json` : An example successful output from `validate.bash`.

## Running validation 

* Edit `validate.bash` with your own paths to `nar-sh-node-validate`.
  command line tool (from this repository).
* `node.js` should be available, `v8.9.4`.
* Run the bash script with `source` not with `bash` command.
