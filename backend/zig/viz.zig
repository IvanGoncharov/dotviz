const std = @import("std");
const builtin = @import("builtin");
const testing = std.testing;
const core = @import("core.zig");

var allocator = std.heap.wasm_allocator;

export fn viz_str_alloc(len: usize) [*]u8 {
    const buf = allocator.alloc(u8, len) catch unreachable;
    return buf.ptr;
}

export fn viz_str_free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}

export fn viz_parse_json_to_svg(
    json_string_ptr: [*]u8,
    len: u32,
) [*]const u8 {
    const _str: []const u8 = json_string_ptr[0..len];

    const _res = core.viz_parse_json_to_svg(
        allocator,
        _str,
    ) catch unreachable;
    defer allocator.free(_res);
    const res: [*:0]const u8 = @ptrCast(allocator.dupeZ(
        u8,
        _res,
    ) catch unreachable);
    return res;
}
