#!/bin/bash

# Exit if any error occurs
set -e

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Save global script args
ARGS="$@"

# Display a help message.
function displayHelp() {
    echo "This script helps you build the syndesis monorepo."
    echo "The available options are:"
    echo " --skip-tests            Skips the test execution."
    echo " --skip-image-builds     Skips image builds."
    echo " --with-image-streams    Builds everything using image streams."
    echo " --namespace N           Specifies the namespace to use."
    echo " --resume-from           Resume build from module."
    echo " --clean                 Cleans up the projects."
    echo " --batch-mode            Runs mvn in batch mode."
    echo " --help                  Displays this help message."
}

#
# Checks if a flag is present in the arguments.
function hasflag() {
    filter=$1
    for var in "${@:2}"; do
        if [ "$var" = "$filter" ]; then
            echo 'true'
            break;
        fi
    done
}

#
# Read the value of an option.
function readopt() {
        filter=$1
        next=false
        for var in "${@:2}"; do
                if $next; then
                        echo $var
                        break;
                fi
                if [ "$var" = "$filter" ]; then
                        next=true
                fi
        done
}

# ======================================================
# Build functions

function modules_to_build() {
  # app needs some love...
  # modules="parent runtime camel ui app"
  modules="parent runtime camel ui"
  resume_from=$(readopt --resume-from $ARGS 2> /dev/null)
  if [ "x${resume_from}" != x ]; then
    modules=$(echo $modules | sed -e "s/^.*$resume_from/$resume_from/")
  fi
  echo $modules
}

function init_options() {
  SKIP_TESTS=$(hasflag --skip-tests $ARGS 2> /dev/null)
  SKIP_IMAGE_BUILDS=$(hasflag --skip-image-builds $ARGS 2> /dev/null)
  CLEAN=$(hasflag --clean $ARGS 2> /dev/null)
  WITH_IMAGE_STREAMS=$(hasflag --with-image-streams $ARGS 2> /dev/null)

  NAMESPACE=$(readopt --namespace $ARGS 2> /dev/null)

  HELP=$(hasflag --help $ARGS 2> /dev/null)

  # Internal variable default values
  OC_OPTS=""
  MAVEN_PARAMETERS=""
  MAVEN_CLEAN_GOAL="clean"
  MAVEN_IMAGE_BUILD_PROFILE="-Pfabric8"
  MAVEN_CMD="${MAVEN_CMD:-${BASEDIR}/mvnw}"

  # Apply options
  if [ -n "$(hasflag --batch-mode $ARGS 2> /dev/null)" ]; then
    MAVEN_PARAMETERS="$MAVEN_PARAMETERS --batch-mode"
  fi

  if [ -n "$SKIP_TESTS" ]; then
      echo "Skipping tests ..."
      MAVEN_PARAMETERS="$MAVEN_PARAMETERS -DskipTests"
  fi

  if [ -n "$SKIP_IMAGE_BUILDS" ]; then
      echo "Skipping image builds ..."
      MAVEN_IMAGE_BUILD_PROFILE=""
  fi

  if [ -n "$NAMESPACE" ]; then
      echo "Namespace: $NAMESPACE"
      MAVEN_PARAMETERS="$MAVEN_PARAMETERS -Dfabric8.namespace=$NAMESPACE"
      OC_OPTS=" -n $NAMESPACE"
  fi

  if [ -z "$CLEAN" ];then
      MAVEN_CLEAN_GOAL=""
  fi

  if [ -n "$WITH_IMAGE_STREAMS" ]; then
    echo "With image streams ..."
    MAVEN_PARAMETERS="$MAVEN_PARAMETERS -Dfabric8.mode=openshift"
  else
    MAVEN_PARAMETERS="$MAVEN_PARAMETERS -Dfabric8.mode=kubernetes"
  fi
}

function parent() {
  pushd parent
  "${MAVEN_CMD}" $MAVEN_CLEAN_GOAL install $MAVEN_PARAMETERS
  popd
}

function runtime() {
  pushd runtime
  "${MAVEN_CMD}" -Pjacoco $MAVEN_IMAGE_BUILD_PROFILE $MAVEN_CLEAN_GOAL checkstyle:check install $MAVEN_PARAMETERS
  popd
}

function camel() {
  pushd camel
  "${MAVEN_CMD}" -Pjacoco $MAVEN_CLEAN_GOAL checkstyle:check install $MAVEN_PARAMETERS
  popd  
}

function ui() {
  pushd ui
  yarn install --verbose --no-progress
  yarn lint
  yarn build
  if [ -z "$SKIP_TESTS" ]; then
    yarn test:coverage
  fi
  popd
}

function app() {
  pushd app
  yarn  
  popd
}

# ============================================================================
# Main loop

init_options

if [ -n "$HELP" ]; then
   displayHelp
   exit 0
fi

for module in $(modules_to_build)
do
  echo "=========================================================="
  echo "Building ${module} ...."
  echo "=========================================================="
  eval "${module}"
done
