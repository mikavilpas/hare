#! /bin/bash
set -e
set +x

rm -rf ./dist/*
mkdir -p ../docs

export PUBLIC_URL=https://sp3ctum.github.io/hare/
(cd ../sakura/ && yarn prettier-check && yarn build)
yarn build
cp -vr ./dist/* ../docs/
git add ../docs
git status
