# Sandfall


# Dev Instructions
- install wat2wasm
  - `brew install wabt`
- install local server (optional)
  - `brew install http-server`
- scripts
  - `build.sh` compiles wat to wasm
  - `serve.sh` serves app locally (optional)

## Algorithm
```
for each cell from bottom to top
  if cell empty:
    set changed=false
  else if south_cell empty:
    set cell=empty, changed=true
    set south_cell=cell, changed=true
  else if south_west_cell empty:
    set changed=true
    set south_west_cell=cell, changed=true
  else if south_east_cell empty:
    set changed=true
    set south_east_cell=cell, changed=true
  else:
    set changed=false
```
