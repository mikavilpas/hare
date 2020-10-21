#! /bin/bash
yarn build
cp -v ./dist/* docs/
git add docs
git status
