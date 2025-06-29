zig build-exe viz.zig -target wasm32-freestanding -fno-entry \
    --export=viz_str_alloc --export=viz_str_free \
    --export=viz_parse_json_to_svg -femit-bin=viz.wasm
