import { ChemicalBuild } from "chemicaljs";

const build = new ChemicalBuild({
    path: "dist",
    default: "uv",
    uv: true,
    experimental: {
        scramjet: true,
        meteor: true,
    },
    rammerhead: false,
});
build.write(true);