(module
  (memory (export "memory") 1)
  (global $pageSize i32 (i32.const 65536))

  (func (export "init")
    (local $i i32)
    (local $numBytes i32)

    i32.const 3
    memory.grow
    drop

    global.get $pageSize
    i32.const 4
    i32.mul
    local.set $numBytes

    i32.const 0
    local.set $i
    (loop $while
      local.get $i
      i32.const 0
      i32.add
      i32.const 0
      i32.store8

      local.get $i
      i32.const 1
      i32.add
      i32.const 100
      i32.store8

      local.get $i
      i32.const 2
      i32.add
      i32.const 255
      i32.store8

      local.get $i
      i32.const 3
      i32.add
      i32.const 255
      i32.store8

      ;; increment counter
      local.get $i
      i32.const 4
      i32.add
      local.tee $i
      local.get $numBytes
      i32.lt_u
      br_if $while
    )
  )

  (func $getOffset (param $w i32) (param $x i32) (param $y i32) (result i32)
    local.get $y
    local.get $w
    i32.mul
    local.get $x
    i32.add
    i32.const 4
    i32.mul
  )

  (func $setCell (param $w i32) (param $x i32) (param $y i32) (param $value i32)
    local.get $w
    local.get $x
    local.get $y
    call $getOffset
    local.get $value
    i32.store
  )

  (func $getCell (param $w i32) (param $x i32) (param $y i32) (result i32)
    local.get $w
    local.get $x
    local.get $y
    call $getOffset
    i32.load
  )
)
