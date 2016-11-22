#!/usr/bin/env bash

msg="from bash"
if [ -n "$1" ]; then
    msg=$1
fi

git add .
git commit -m "$msg"
git push origin master