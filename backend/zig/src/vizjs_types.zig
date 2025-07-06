const std = @import("std");

pub const Attributes = std.json.Value;

pub const Node = struct {
    name: []const u8,
    attributes: ?*Attributes = null,
};

pub const Edge = struct {
    tail: []const u8,
    head: []const u8,
    attributes: ?*Attributes = null,
};

pub const Subgraph = struct {
    name: ?[]const u8 = null,
    graphAttributes: ?*Attributes = null,
    nodeAttributes: ?*Attributes = null,
    edgeAttributes: ?*Attributes = null,
    nodes: ?[]Node = null,
    edges: ?[]Edge = null,
    subgraphs: ?*[]Subgraph = null,
};

pub const Graph = struct {
    name: ?[]const u8 = null,
    strict: ?bool = null,
    directed: ?bool = null,
    graphAttributes: ?*Attributes = null,
    nodeAttributes: ?*Attributes = null,
    edgeAttributes: ?*Attributes = null,
    nodes: ?[]Node = null,
    edges: ?[]Edge = null,
    subgraphs: ?[]Subgraph = null,
};
