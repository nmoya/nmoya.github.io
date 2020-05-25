#!/bin/sh

cd nederlands-code
yarn build
cd ..
rm -rf ./nederlands/*
mv nederlands-code/build/* ./nederlands/