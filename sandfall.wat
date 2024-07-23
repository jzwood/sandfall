(module
  (memory (export "memory") 1)
  (global $page_size i32 (i32.const 65_536))
  (global $width i32 (i32.const 0))

  (func (export "init") (param $width i32) (param $height i32)
    (local $i i32)
    (local $num_bytes i32)

    i32.const 3 ;; make this dynamic later
    memory.grow
    drop

    (;local.get $width;)
    (;global.set $width;)

    local.get $width
    local.get $height
    i32.mul
    i32.const 4
    i32.mul
    local.tee $num_bytes
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
      br_if $while
    )
  )

  (;(func $width (export "width") (result i32);)
    (;global.get $page_size;)
    (;i32.const 4;)
    (;i32.div_s;)
    (;memory.size;)
    (;i32.mul;)
    (;f32.convert_i32_s;)
    (;f32.sqrt;)
    (;i32.trunc_f32_s;)
    (;return;)
  (;);)

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

  (func (export "next") (param $index i32)
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
