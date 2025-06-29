const fs = require("fs");
const path = require("path");

const wasmBuffer = fs.readFileSync(path.join(__dirname, "viz.wasm"));

const { instance } = await WebAssembly.instantiate(wasmBuffer, {
    env: {},
});

const {
    viz_parse_json_to_svg,
    viz_str_alloc,
    viz_str_free,
    memory
} = instance.exports;

const graph = {
    graphAttributes: {
        rankdir: "LR"
    },
    nodeAttributes: {
        shape: "circle"
    },
    nodes: [
        { name: "a", attributes: { label: { html: "&lt;i&gt;A&lt;/i&gt;" }, color: "red" } },
        { name: "b", attributes: { label: { html: "&lt;b&gt;A&lt;/b&gt;" }, color: "green" } }
    ],
    edges: [
        { tail: "a", head: "b", attributes: { label: "1" } },
        { tail: "b", head: "c", attributes: { label: "2", headport: "name" } }
    ],
    subgraphs: [
        {
            name: "cluster_1",
            nodes: [
                {
                    name: "c",
                    attributes: {
                        label: {
                            html: "&lt;table&gt;&lt;tr&gt;&lt;td&gt;test&lt;/td&gt;&lt;td port=\"name\"&gt;C&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;"
                        }
                    }
                }
            ]
        }
    ]
};

const inputStr = JSON.stringify(graph);
const inputBytes = new TextEncoder().encode(inputStr);
const len = inputBytes.length;
const ptr = viz_str_alloc(len);
new Uint8Array(memory.buffer, ptr, len).set(inputBytes);
const svg_ptr = viz_parse_json_to_svg(ptr, len);
let svg = "";
const mem = new Uint8Array(memory.buffer);
for (let i = svg_ptr; mem[i] !== 0; i++) {
    svg += String.fromCharCode(mem[i]);
}
console.log(`SVG output:[${svg}]`);

viz_str_free(ptr, len)