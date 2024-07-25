(module
  (import "console" "log" (func $log (param i32)))
  (memory (export "memory") 1)
  (global $width (mut i32) (i32.const 0))
  (global $height (mut i32) (i32.const 0))
  (global $span (mut i32) (i32.const 0))

  (func $inspect (param $x i32) (result i32)
    local.get $x
    call $log
    local.get $x
  )

  (func (export "init") (param $width i32) (param $height i32)
    (local $i i32)
    (local $span i32)
    i32.const 3 ;; make this dynamic later
    memory.grow
    drop

    local.get $width
    global.set $width
    local.get $height
    global.set $height

    local.get $width
    i32.const 4
    i32.mul
    global.set $span
  )

  (func $stamp (export "stamp") (param $index i32) (param $red i32) (param $green i32) (param $blue i32)
      local.get $index
      i32.load

      if
        return
      end

      local.get $index
      i32.const 0
      i32.add
      local.get $red
      i32.store8

      local.get $index
      i32.const 1
      i32.add
      local.get $green
      i32.store8

      local.get $index
      i32.const 2
      i32.add
      local.get $blue
      i32.store8

      local.get $index
      i32.const 3
      i32.add
      i32.const 255
      i32.store8
  )

  (func $block_stamp (export "block_stamp") (param $x i32) (param $y i32) (param $red i32) (param $green i32) (param $blue i32)

        (local $index i32)
        local.get $y
        global.get $width
        i32.mul
        local.get $x
        i32.add
        i32.const 4
        i32.mul
        local.set $index

        local.get $index
        local.get $red
        local.get $green
        local.get $blue
        call $stamp

        local.get $index
        i32.const 4
        i32.add
        local.get $red
        local.get $green
        local.get $blue
        call $stamp

        local.get $index
        i32.const 8
        i32.add
        local.get $red
        local.get $green
        local.get $blue
        call $stamp

        local.get $index
        i32.const 4
        i32.sub
        local.get $red
        local.get $green
        local.get $blue
        call $stamp
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

    global.get $width
    global.get $height
    i32.const 1
    i32.sub
    i32.mul
    i32.const 4
    i32.mul
    local.set $i  ;; we don't want to step on last row of grid

    (loop $while
      local.get $i
      i32.const 4
      i32.sub
      local.tee $i ;; decrements counter

      call $next

      local.get $i
      i32.const 4 ;; skip top left cell
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
    global.get $span
    i32.add
    local.set $index_s

    ;; check south cell
    local.get $index
    local.get $cell
    local.get $index_s
    call $put

    if
      return
    end

    ;; check south east cell
    local.get $index
    local.get $cell
    local.get $index_s
    i32.const 4
    i32.add
    call $put

    if
      return
    end

    ;; check west and south west cell
    local.get $index
    i32.const 4
    i32.sub
    i32.load
    i32.eqz
    if
      local.get $index
      local.get $cell
      local.get $index_s
      i32.const 4
      i32.sub
      call $put
      drop
    end
  )
)
