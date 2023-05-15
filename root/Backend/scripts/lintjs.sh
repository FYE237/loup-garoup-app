#!/bin/bash

rm -f lintjs*.out

for file in src/controllers/*.js src/__tests__/*.js src/routes/*.js src/models/*js src/util/*.js ; do 
    npx eslint "$file" >> "lintjs-report.out"
done 
