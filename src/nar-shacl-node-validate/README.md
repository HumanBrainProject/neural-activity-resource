(c) 2018 NAR with HBP

## Command line SHACL validation utility

A command-line tool for validating data graph against a shape graph. CLI is
based on `node.js` package `shacl.js` ([link](https://github.com/TopQuadrant/shacl-js)). 

## Installation

* `node.js` on Ubuntu
`
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
`
* `shacl.js` (at version with commitid d273569b4cf551c2eeb1c945539b9a9e3614b288)  
   is available within the director.

* Run the script that builds shacl.js
  `source install_shacl.bash`

* Check if environment variable `NODE_PATH` is set. If not
  modify  `source install_shacl.bash` and rerun.


## Usage

* For turtle format there are samples under `samples` directory.
* Execute 
  `node nar-sh-node-validate --data samples/data01.ttl --shapes samples/shapes01.ttl --type="text/turtle"` 

## Issues/Bug
Any issue use github ticketing.
