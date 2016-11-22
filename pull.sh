#!/usr/bin/env bash

BRANCH="master"
if [ -n "$1" ]; then
    BRANCH=$1
fi

echo pull on branch "$BRANCH".
if which git >/dev/null; then
    echo git exists.
    git pull origin "$BRANCH"
else
    echo git not exists.
fi