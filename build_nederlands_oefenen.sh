#!/bin/sh

cd nederlands-oefenen-code
yarn build
cd ..
rm -rf ./nederlands-oefenen/*
mv nederlands-oefenen-code/build/* ./nederlands-oefenen/