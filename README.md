# Introduction

A tool to auto run `adb reverse tcp:8081 tcp:8081` when available to get ready for react-native metro refreshing process on Android.

## Usage

1. git clone this project from github
2. run `yarn` to sync dependencies
3. make sure you have installed `adb` in your shell environment, you can check it by running `adb devices`. Also with `tsc` that used to compile codes.
4. run `yarn start` and connect your devices via USB or WIFI
