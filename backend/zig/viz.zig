const std = @import("std");
const testing = std.testing;
const vizjs_types = @import("vizjs_types.zig");

const str =
    \\ {
    \\     "graphAttributes": {
    \\         "rankdir": "LR"
    \\     },
    \\     "nodeAttributes": {
    \\         "shape": "circle"
    \\     },
    \\     "nodes": [
    \\         {
    \\             "name": "a",
    \\             "attributes": {
    \\                 "label": {
    \\                     "html": "&lt;i&gt;A&lt;/i&gt;"
    \\                 },
    \\                 "color": "red"
    \\             }
    \\         },
    \\         {
    \\             "name": "b",
    \\             "attributes": {
    \\                 "label": {
    \\                     "html": "&lt;b&gt;A&lt;/b&gt;"
    \\                 },
    \\                 "color": "green"
    \\             }
    \\         }
    \\     ],
    \\     "edges": [
    \\         {
    \\             "tail": "a",
    \\             "head": "b",
    \\             "attributes": {
    \\                 "label": "1"
    \\             }
    \\         },
    \\         {
    \\             "tail": "b",
    \\             "head": "c",
    \\             "attributes": {
    \\                 "label": "2",
    \\                 "headport": "name"
    \\             }
    \\         }
    \\     ],
    \\     "subgraphs": [
    \\         {
    \\             "name": "cluster_1",
    \\             "nodes": [
    \\                 {
    \\                     "name": "c",
    \\                     "attributes": {
    \\                         "label": {
    \\                             "html": "&lt;table&gt;&lt;tr&gt;&lt;td&gt;test&lt;/td&gt;&lt;td port=\"name\"&gt;C&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;"
    \\                         }
    \\                     }
    \\                 }
    \\             ]
    \\         }
    \\     ]
    \\ }
;

test {
    const allocator = testing.allocator;
    const res = try std.json.parseFromSlice(
        vizjs_types.Graph,
        allocator,
        str,
        .{},
    );
    defer res.deinit();

    try testing.expectEqualStrings(
        "c",
        res.value.subgraphs.?[0].nodes.?[0].name,
    );

    const node0_attributes = res.value.nodes.?[0].attributes.?.*;
    const value = node0_attributes.object.get("label").?.object.get(
        "html",
    ).?.string;
    try testing.expectEqualStrings("&lt;i&gt;A&lt;/i&gt;", value);
}
