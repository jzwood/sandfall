(module
  (memory (export "memory") 1)

  (func (export "init")
    i32.const 0
    i32.const 1
    i32.const 500
    memory.fill
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
