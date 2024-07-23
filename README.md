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
    nop
  else if south_cell empty:
    set cell=empty
    set south_cell=cell
  else if south_west_cell empty:
    set south_west_cell=cell
  else if south_east_cell empty:
    set south_east_cell=cell
  else:
    nop
```
