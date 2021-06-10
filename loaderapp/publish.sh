#! /bin/bash
set -e
set +x

rm ./dist/* -rf
mkdir -p ../docs

(cd ../sakura/ && yarn prettier-check && yarn build)
yarn build
cp -v ./dist/* ../docs/ -r
git add ../docs
git status
