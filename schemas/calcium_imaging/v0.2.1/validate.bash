echo ""
echo "   narci v0.2.1 SHACL validation"
echo ""
echo " * Are you using `source` to run this script?"
echo " * Did you update paths accordingly?"
echo ""

MYDIR=`pwd` # where this script run
#
# Modify paths as needed
# where is `neural-activity-resource` repository clone located?
#
PATH_TO_VALIDATOR=/home/msuzen/workdir/juelich/clones/neural-activity-resource/src/nar-shacl-node-validate/
# Data/Shapes files
PATH_TO_SHAPES_DATA=/home/msuzen/workdir/juelich/clones/neural-activity-resource/schemas/calcium_imaging/v0.2.1
FSHAPES=narci_sh.ttl
FDATA=narci_data.ttl
export NODE_PATH=/usr/bin/nodejs:/usr/local/lib/node_modules:/usr/share/javascript

#
# Below you would not need to modify any paths.
#
SHAPES=$PATH_TO_SHAPES_DATA/$FSHAPES
DATA=$PATH_TO_SHAPES_DATA/$FDATA
VALIDATOR=$PATH_TO_VALIDATOR/nar-sh-node-validate
# Prepare node.js environment
source $PATH_TO_VALIDATOR/install_shacl.bash 
echo  $MYDIR/validate_report.json
node $VALIDATOR --data $DATA --shapes $SHAPES --type="text/turtle" > $MYDIR/validate_report.json
echo " Inspect validation report:" 
echo  $MYDIR/validate_report.json
echo ""
