# Overview
---
@tinycode/compil is simple script to make standalone html file.

- Typescript file can be specified as src in html file.
- By default script specified as type module in output html.


## Install
```sh
deno install --allow-read --allow-write --allow-net --allow-env jsr:@tinycode/compil
```


## Update
```sh
deno install --reload --force --allow-read --allow-write --allow-net --allow-env jsr:@tinycode/compil
```


## Usage
```sh
compil index.html
```
or
```sh
compil index.htm
```

### Uninstall
```sh
deno uninstall compile
```
