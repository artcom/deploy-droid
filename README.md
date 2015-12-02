# Deploy Droid

Automated installation of Android applications from [HockeyApp](http://hockeyapp.net/)

## Requirements

* HockeyApp account
* HockeyApp token
* `adb` command line tool
* One or more connected android devices

## Install

* npm install -g deploy-droid

## Usage

```
$ deploy-droid --help
Usage:
  deploy-droid --hockeyAppToken=<token> [--releaseType=<type>] [--deviceDescriptorFile=<filepath>]
  deploy-droid --version
  deploy-droid --help

Options:
  --releaseType=<type>                HockeyApp release type [default: beta],
                                      (alpha|beta|store|enterprise|<custom type>).
  --deviceDescriptorFile=<filepath>   Filepath to a human readable file
                                      on connected android devices, which describes that device.
```

Deploy Droid downloads and installs Android applications which are distributed via [HockeyApp](http://hockeyapp.net/) to connected mobile Android devices.

Which applications are installed is determined by their release types. The release type for each application can be specified in the HockeyApp web interface. If a custom type is chosen for an application it takes precedence over the standard release types.

The latest available version is installed to connected Android devices. The user is prompted to confirm the installation.

The applications are downloaded to a directory named apk-cache which is created within the current working directory.
