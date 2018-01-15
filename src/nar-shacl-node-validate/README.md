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

* Major file types are valid, for example, `text/turtle`, `text/jsonld`.
  Argument is `--type`
* There are samples under `samples` directory.
  Arguments are `--data` and `--shapes` respectively.
* Example command line execution

  `node nar-sh-node-validate --data samples/data01.ttl --shapes samples/shapes01.ttl --type="text/turtle"` 
  
   This should give following output

  `mimeType=  text/turtle
Conforms? false
 - Severity: Violation for http://www.w3.org/ns/shacl#LessThanConstraintComponent
 - Severity: Violation for http://www.w3.org/ns/shacl#NodeConstraintComponent
   `

## Issues/Bug
Any issue use github ticketing.
