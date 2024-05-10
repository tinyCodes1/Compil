# Overview
---
@tinycode/compil is simple script to make standalone html file.  

- Typescript file can be specified as src in html file.
- Script and style declaration should be in single line if pointing to another reference.
- By default script specified as type="module" in output html.
- You may use precompiled version.

## Usage (with deno):
---
### 1. Install
```sh
deno install --allow-read --allow-write --allow-net --allow-env jsr:@tinycode/compil
```

### 2. Use
Now you can use it from command line.
```sh
compil index.html
```

***3. Update***
```sh
deno install --reload --force --allow-read --allow-write --allow-net --allow-env jsr:@tinycode/compil
```

***4. Uninstall***
```sh
deno uninstall compil
```

## Usage (without deno):
---
You need to use precompiled version to use it without installing deno.
### 1. Download
Download appropriate version from [here](https://github.com/tinyCodes1/Compil/tree/main/Dist).

### 2. Use
***Windows***  
Click on compil.exe directly *or*  
Open command line in downloaded location.
```cmd
.\compil.exe index.html
```
***Linux***
```sh
chmod +x ./compil
./compil index.html
```
