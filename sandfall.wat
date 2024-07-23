(module
  (import "console" "log" (func $log (param i32)))
  (memory (export "memory") 1)
  (global $width (mut i32) (i32.const 0))
  (global $height (mut i32) (i32.const 0))

  (func (export "init") (param $width i32) (param $height i32)
    (local $i i32)
    i32.const 3 ;; make this dynamic later
    memory.grow
    drop

    local.get $width
    global.set $width
    local.get $height
    global.set $height

    i32.const 400
    local.set $i

    (loop $while
      local.get $i
      i32.const 4
      i32.sub
      local.tee $i ;; decrements counter

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

      local.get $i
      i32.const 4
      i32.gt_s
      br_if $while
    )
  )

  (func $put (param $index1 i32) (param $cell1 i32) (param $index2 i32) (result i32)
    local.get $index2
    i32.load
    i32.eqz
    if (result i32);; target cell is empty
      local.get $index1
      i32.const 0
      i32.store
      local.get $index2
      local.get $cell1
      i32.store

      i32.const 1
    else
      i32.const 0
    end
    return
  )

  (func (export "step")
    (local $i i32)

    (;global.get $width;)
    (;call $log;)
    (;global.get $height;)
    (;call $log;)

    global.get $width
    global.get $height
    i32.const 1
    i32.sub
    i32.mul
    i32.const 4
    i32.mul
    i32.const 4
    i32.sub
    local.set $i  ;; we don't want to step on last cell in grid

    (loop $while
      local.get $i
      i32.const 4
      i32.sub
      local.tee $i ;; decrements counter

      call $next

      local.get $i
      i32.const 4
      i32.gt_s
      br_if $while
    )
  )

  (func $next (param $index i32)
    (local $cell i32)
    (local $index_s i32)
    (local $index_sw i32)
    (local $index_se i32)

    local.get $index
    i32.load
    local.tee $cell

    i32.eqz
    if ;; early exit on empty cell
      return
    end

    local.get $index
    global.get $width
    i32.const 4
    i32.mul
    i32.add
    local.set $index_s

    local.get $index
    local.get $cell
    local.get $index_s
    call $put

    if
      return
    end

    local.get $index
    local.get $cell
    local.get $index_s
    i32.const 1
    i32.sub
    call $put

    if
      return
    end

    local.get $index
    local.get $cell
    local.get $index_s
    i32.const 1
    i32.add
    call $put

    if
      return
    end
  )
)
