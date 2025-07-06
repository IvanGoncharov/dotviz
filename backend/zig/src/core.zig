const std = @import("std");
const vizjs_types = @import("vizjs_types.zig");

pub fn viz_parse_json_to_svg(
    allocator: std.mem.Allocator,
    json_string: []const u8,
) ![]const u8 {
    const res = try std.json.parseFromSliceLeaky(
        vizjs_types.Graph,
        allocator,
        json_string,
        .{},
    );
    var list = std.ArrayList(u8).init(allocator);
    if (res.nodes) |node_arr| {
        for (node_arr, 0..) |node, i| {
            try list.appendSlice(node.name);
            if (i != node_arr.len - 1) {
                try list.append(',');
            }
        }
    }
    return list.toOwnedSlice();
}
