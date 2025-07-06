const std = @import("std");
const core = @import("core.zig");

const zemscripten = @import("zemscripten");
pub const panic = zemscripten.panic;

pub const std_options = std.Options{
    .logFn = zemscripten.log,
};
export fn viz_parse_json_to_svg(cstring: [*c]u8) [*c]const u8 {
    var a = zemscripten.EmmalocAllocator{};
    const allocator = a.allocator();
    const string: [:0]const u8 = std.mem.span(cstring);
    const _res = core.viz_parse_json_to_svg(
        allocator,
        string,
    ) catch unreachable;
    const res: [*:0]const u8 = @ptrCast(allocator.dupeZ(
        u8,
        _res,
    ) catch unreachable);
    return res;
}

export fn main() c_int {
    std.log.info("hello, world.", .{});
    return 0;
}
