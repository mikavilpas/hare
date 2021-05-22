#! /bin/bash
set -e
set +x

rm ./dist/* -r

(cd ../sakura/ && yarn build)
yarn build
cp -v ./dist/* docs/ -r
git add docs
git status
