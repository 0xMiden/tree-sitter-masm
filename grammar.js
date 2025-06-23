/**
 * @file Miden Assembly grammar for tree-sitter
 * @author Paul Schoenfelder
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "masm",

  extras: ($) => [$.whitespace, $.newline, $.comment],

  reserved: {
    global: ($) => [
      "use",
      "export",
      "proc",
      "const",
      "begin",
      "end",
      "if.true",
      "else",
      "while.true",
      "repeat",
      "adv.insert_hdword",
      "adv.insert_hdword_d",
      "adv.insert_hperm",
      "adv.insert_mem",
      "adv.push_ext2intt",
      "adv.push_mapval",
      "adv.push_mapvaln",
      "adv.push_mtnode",
      "adv.push_smtpeek",
      "adv.push_u64div",
      "adv.push_falcon_div",
      "adv_pipe",
      "adv_loadw",
      "and",
      "arithmetic_circuit_eval",
      "caller",
      "cdrop",
      "cdropw",
      "clk",
      "cswap",
      "cswapw",
      "drop",
      "dropw",
      "dyncall",
      "dynexec",
      "eqw",
      "ext2add",
      "ext2div",
      "ext2inv",
      "ext2mul",
      "ext2neg",
      "ext2sub",
      "fri_ext2fold4",
      "hash",
      "hperm",
      "hmerge",
      "ilog2",
      "inv",
      "is_odd",
      "mem_stream",
      "mtree_get",
      "mtree_merge",
      "mtree_set",
      "neg",
      "not",
      "nop",
      "or",
      "padw",
      "pow2",
      "horner_eval_base",
      "horner_eval_ext",
      "sdepth",
      "swapdw",
      "u32cast",
      "u32overflowing_add3",
      "u32overflowing_madd",
      "u32popcnt",
      "u32clz",
      "u32ctz",
      "u32clo",
      "u32cto",
      "u32split",
      "u32test",
      "u32testw",
      "u32wrapping_add3",
      "u32wrapping_madd",
      "xor",
      "add",
      "sub",
      "mul",
      "div",
      "eq",
      "exp.u",
      "exp",
      "gte",
      "gt",
      "lte",
      "lt",
      "neq",
      "u32and",
      "u32div",
      "u32divmod",
      "u32gt",
      "u32gte",
      "u32lt",
      "u32lte",
      "u32max",
      "u32min",
      "u32mod",
      "u32or",
      "u32overflowing_add",
      "u32overflowing_sub",
      "u32overflowing_mul",
      "u32xor",
      "u32not",
      "u32shl",
      "u32shr",
      "u32rotl",
      "u32rotr",
      "u32wrapping_add",
      "u32wrapping_mul",
      "u32wrapping_sub",
      "adv_push",
      "dupw",
      "dup",
      "movdnw",
      "movdn",
      "movupw",
      "movup",
      "swapw",
      "swap",
      "locaddr",
      "loc_load",
      "loc_loadw",
      "loc_store",
      "loc_storew",
      "mem_load",
      "mem_loadw",
      "mem_store",
      "mem_storew",
      "assert_eqw",
      "assert_eq",
      "assertz",
      "assert",
      "u32assert2",
      "u32assertw",
      "u32assert",
      "mtree_verify",
      "breakpoint",
      "debug.stack",
      "debug.mem",
      "debug.local",
      "debug.adv_stack",
      "emit",
      "trace",
      "push",
      "exec",
      "call",
      "syscall",
      "procref",
      "nop",
    ],
  },

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => choice($._with_module_doc, $._without_module_doc),

    _with_module_doc: ($) => seq($.moduledoc, repeat($.form)),

    moduledoc: ($) => seq(prec(2, repeat1($.doc_comment)), token("\n")),

    _without_module_doc: ($) => seq($._form_no_doc, repeat($.form)),

    _form_no_doc: ($) => choice($.import, $.constant, $.procedure, $.entrypoint),

    form: ($) =>
      choice($.import, $.constant, $.procedure, $.entrypoint, prec(1, repeat1($.doc_comment))),

    doc_comment: ($) => token.immediate(/#![\r\f\t\v ]*([^\n].*)?\n/),

    comment: ($) => /#[\r\f\t\v ]*([^\n].*)?\n/,

    import: ($) =>
      seq(
        "use",
        token.immediate("."),
        field("path", $.path),
        field("alias", optional($.import_alias)),
      ),

    import_alias: ($) => seq(token.immediate("->"), field("name", $._ident)),

    constant: ($) =>
      seq(
        "const",
        token.immediate("."),
        field("name", $.const_ident),
        token.immediate("="),
        field("value", $.const_expr),
      ),

    entrypoint: ($) => seq("begin", field("body", $.block), "end"),

    procedure: ($) =>
      seq(
        field("annotations", repeat($.annotation)),
        field("visibility", choice("export", "proc")),
        token.immediate("."),
        field("name", $._ident),
        field("num_locals", optional($._maybe_decimal)),
        field("body", $.block),
        "end",
      ),

    block: ($) => repeat1(choice($.op, $.if, $.while, $.repeat, $.invoke)),

    op: ($) =>
      choice(
        $.debug,
        $.assert,
        $.push,
        $._op_with_imm_integer,
        $._op_with_stack_index,
        $._op_with_local_index,
        $._op_with_mem_address,
        "nop",
        "adv.insert_hdword",
        "adv.insert_hdword_d",
        "adv.insert_hperm",
        "adv.insert_mem",
        "adv.push_ext2intt",
        "adv.push_mapval",
        "adv.push_mapvaln",
        "adv.push_mtnode",
        "adv.push_smtpeek",
        "adv.push_u64div",
        "adv.push_falcon_div",
        "adv_pipe",
        "adv_loadw",
        "and",
        "arithmetic_circuit_eval",
        "caller",
        "cdrop",
        "cdropw",
        "clk",
        "cswap",
        "cswapw",
        "drop",
        "dropw",
        "dyncall",
        "dynexec",
        "eqw",
        "ext2add",
        "ext2div",
        "ext2inv",
        "ext2mul",
        "ext2neg",
        "ext2sub",
        "fri_ext2fold4",
        "hash",
        "hperm",
        "hmerge",
        "ilog2",
        "inv",
        "is_odd",
        "mem_stream",
        "mtree_get",
        "mtree_merge",
        "mtree_set",
        "neg",
        "not",
        "nop",
        "or",
        "padw",
        "pow2",
        "horner_eval_base",
        "horner_eval_ext",
        "sdepth",
        "swapdw",
        "u32cast",
        "u32overflowing_add3",
        "u32overflowing_madd",
        "u32popcnt",
        "u32clz",
        "u32ctz",
        "u32clo",
        "u32cto",
        "u32split",
        "u32test",
        "u32testw",
        "u32wrapping_add3",
        "u32wrapping_madd",
        "xor",
      ),

    _op_with_imm_integer: ($) =>
      seq(
        choice(
          "add",
          "sub",
          "mul",
          "div",
          "eq",
          "exp.u",
          "exp",
          "gte",
          "gt",
          "lte",
          "lt",
          "neq",
          "u32and",
          "u32div",
          "u32divmod",
          "u32gt",
          "u32gte",
          "u32lt",
          "u32lte",
          "u32max",
          "u32min",
          "u32mod",
          "u32or",
          "u32overflowing_add",
          "u32overflowing_sub",
          "u32overflowing_mul",
          "u32xor",
          "u32not",
          "u32shl",
          "u32shr",
          "u32rotl",
          "u32rotr",
          "u32wrapping_add",
          "u32wrapping_mul",
          "u32wrapping_sub",
        ),
        optional(field("imm", $._maybe_integer)),
      ),

    _op_with_stack_index: ($) =>
      seq(
        choice("adv_push", "dupw", "dup", "movdnw", "movdn", "movupw", "movup", "swapw", "swap"),
        optional(field("index", $._maybe_decimal)),
      ),

    _op_with_local_index: ($) =>
      seq(
        choice("locaddr", "loc_load", "loc_loadw", "loc_store", "loc_storew"),
        optional(field("local", $._maybe_decimal)),
      ),

    _op_with_mem_address: ($) =>
      seq(
        choice("mem_load", "mem_loadw", "mem_store", "mem_storew"),
        optional(field("addr", $._maybe_integer)),
      ),

    assert: ($) =>
      seq(
        choice(
          "assert_eqw",
          "assert_eq",
          "assertz",
          "assert",
          "u32assert2",
          "u32assertw",
          "u32assert",
          "mtree_verify",
        ),
        optional(
          field(
            "err",
            seq(token.immediate("."), token.immediate("err"), token.immediate("="), $._imm_string),
          ),
        ),
      ),

    debug: ($) =>
      choice(
        "breakpoint",
        seq("debug.stack", optional(field("index", $._maybe_decimal))),
        seq(
          "debug.mem",
          optional(
            seq(
              ".",
              field("start", $._imm_decimal),
              optional(seq(".", field("end", $._imm_decimal))),
            ),
          ),
        ),
        seq(
          "debug.local",
          optional(
            seq(
              ".",
              field("start", $._imm_decimal),
              optional(seq(".", field("end", $._imm_decimal))),
            ),
          ),
        ),
        seq("debug.adv_stack", optional(field("index", $._maybe_decimal))),
        seq("emit", token.immediate("."), field("id", $._imm_integer)),
        seq("trace", token.immediate("."), field("id", $._imm_integer)),
      ),

    push: ($) => seq("push", field("values", repeat1($._maybe_number))),

    if: ($) =>
      seq(
        "if.true",
        field("then_body", $.block),
        optional(seq("else", field("else_body", $.block))),
        "end",
      ),

    while: ($) => seq("while.true", field("body", $.block), "end"),

    repeat: ($) =>
      seq("repeat", token.immediate("."), field("count", $.decimal), field("body", $.block), "end"),

    invoke: ($) =>
      seq(
        field("kind", choice("exec", "call", "syscall", "procref")),
        token.immediate("."),
        field("path", $.path),
      ),

    annotation: ($) =>
      seq(
        "@",
        field("name", $.identifier),
        field(
          "value",
          optional(seq(token.immediate("("), $.annotation_value, token.immediate(")"))),
        ),
      ),

    annotation_value: ($) => choice($.meta_key_value, $.meta_expr),

    meta_key_value: ($) => seq(field("name", $.identifier), "=", field("value", $.meta_expr)),
    meta_expr: ($) => choice($.identifier, $.string, $.number),

    const_expr: ($) => choice($.const_binop, $.const_term),

    const_binop: ($) =>
      choice(
        prec.left(3, seq(field("lhs", $.const_expr), "*", field("rhs", $.const_expr))),
        prec.left(2, seq(field("lhs", $.const_expr), "/", field("rhs", $.const_expr))),
        prec.left(2, seq(field("lhs", $.const_expr), "//", field("rhs", $.const_expr))),
        prec.left(1, seq(field("lhs", $.const_expr), "+", field("rhs", $.const_expr))),
        prec.left(1, seq(field("lhs", $.const_expr), "-", field("rhs", $.const_expr))),
      ),

    const_term: ($) => choice($.const_group, $.number, $.string, $.const_ident),

    const_group: ($) => seq("(", field("expr", $.const_expr), ")"),

    path: ($) => choice($.absolute_path, $.relative_path),

    absolute_path: ($) => repeat1(seq(token.immediate("::"), $._ident)),

    relative_path: ($) => seq($._ident, repeat(seq(token.immediate("::"), $._ident))),

    _maybe_decimal: ($) => seq(token.immediate("."), $._imm_decimal),
    _maybe_integer: ($) => seq(token.immediate("."), $._imm_integer),
    _maybe_number: ($) => seq(token.immediate("."), $._imm_number),

    _ident: ($) => choice(alias($.string, $.quoted_ident), $.identifier),
    identifier: ($) => /[a-z_$][a-zA-Z0-9_$]+/,
    const_ident: ($) => /[A-Z_][A-Z0-9_$]+/,

    string: ($) => seq('"', token.immediate(/[^"]*/), token.immediate('"')),
    number: ($) => choice($.decimal, $.hex, $.word),
    integer: ($) => choice($.decimal, $.hex),
    decimal: ($) => /[\d]+/,
    hex: ($) => /0x[A-F0-9]+/,
    word: ($) =>
      seq(
        "[",
        field("a", $._imm_integer),
        ",",
        field("b", $._imm_integer),
        ",",
        field("c", $._imm_integer),
        ",",
        field("d", $._imm_integer),
        "]",
      ),

    _imm_number: ($) => choice($.number, $.const_ident),
    _imm_integer: ($) => choice($.integer, $.const_ident),
    _imm_decimal: ($) => choice($.decimal, $.const_ident),
    _imm_string: ($) => choice($.string, $.const_ident),

    whitespace: ($) => /[\r\f\t\v ]*/,
    newline: ($) => token("\n"),
  },
});
