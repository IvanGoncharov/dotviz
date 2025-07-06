const std = @import("std");

// Although this function looks imperative, note that its job is to
// declaratively construct a build graph that will be executed by an external
// runner.
pub fn build(b: *std.Build) !void {
    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    const target = b.standardTargetOptions(.{
        .default_target = .{
            .os_tag = .freestanding,
            .cpu_arch = .wasm32,
        },
    });

    // Standard optimization options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall. Here we do not
    // set a preferred release mode, allowing the user to decide how to optimize.
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseSmall,
    });

    const wasm = b.addStaticLibrary(.{
        .name = "dotviz",
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const zemscripten = b.dependency("zemscripten", .{});
    const activate_emsdk_step = @import("zemscripten").activateEmsdkStep(b);

    wasm.root_module.addImport("zemscripten", zemscripten.module("root"));

    const emcc_flags = @import("zemscripten").emccDefaultFlags(b.allocator, .{
        .optimize = optimize,
        .fsanitize = true,
    });

    var emcc_settings = @import("zemscripten").emccDefaultSettings(b.allocator, .{
        .optimize = optimize,
    });
    try emcc_settings.put("EXPORTED_FUNCTIONS", "['_main', '_viz_parse_json_to_svg', '_malloc', '_free', 'stringToNewUTF8', 'UTF8ToString']");

    const emcc_step = @import("zemscripten").emccStep(
        b,
        wasm,
        .{
            .optimize = optimize,
            .flags = emcc_flags,
            .settings = emcc_settings,
            .use_preload_plugins = true,
            .embed_paths = &.{},
            .preload_paths = &.{},
            .install_dir = .{ .custom = "web" },
            .shell_file_path = "index.html",
        },
    );
    emcc_step.dependOn(activate_emsdk_step);

    b.getInstallStep().dependOn(emcc_step);

    const html_filename = try std.fmt.allocPrint(b.allocator, "{s}.html", .{wasm.name});

    const emrun_args = .{};
    const emrun_step = @import("zemscripten").emrunStep(
        b,
        b.getInstallPath(.{ .custom = "web" }, html_filename),
        &emrun_args,
    );

    emrun_step.dependOn(emcc_step);

    b.step("emrun", "Build and open the web app locally using emrun").dependOn(emrun_step);
}
