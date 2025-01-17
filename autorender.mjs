import { parseArgs } from "node:util";
import { csvRead } from "./src/csvRead.mjs";
import { renderPlayers, initRender } from "./src/render.mjs";
import { dirRead } from "./src/dirRead.mjs"
import * as path from "path";
import * as fs from "fs/promises";

let defaultAerenderPath = "aerender";
switch (process.platform) {
    case "win32":
        defaultAerenderPath = "C:\\Program Files\\Adobe\\Adobe After Effects CC\\Support Files\\aerender.exe";
        break;
    case "darwin":
        defaultAerenderPath = "/Programme/Adobe After Effects CC/aerender";
        break;
}

const {
    values: {
        aepFile,
        playersFile,
        firstCsvLine,
        lastCsvLine,
        aerenderPath,
        workdir,
        imgNameFormat,
        help,
        init
    }
} = parseArgs({
    options: {
        aepFile: {
            type: "string",
            default: "./project.aep",
            short: "a"
        },
        playersFile: {
            type: "string",
            default: "./images",
            short: "p"
        },
        firstCsvLine: {
            type: "string",
            default: "1",
            short: "f"
        },
        lastCsvLine: {
            type: "string",
            default: "-1",
            short: "l"
        },
        aerenderPath: {
            type: "string",
            default: "",
        },
        workdir: {
            type: "string",
            default: "./workdir",
            short: "d"
        },
        imgNameFormat: {
            type: "string",
            default: "images/{3}_{2}_{1}_{0}.png",
            short: "i"
        },
        help: {
            type: "boolean",
            default: false,
            short: "h"
        },
        init: {
            type: "boolean",
            default: false,
        }
    }
});

if (help) {
    console.log(`AE Autorender Player animations
Arguments:
--workdir       -d      The directory used as workdir. All relative paths will be relative to this and this will be the ae workdir (Default: ./workdir)
--aepFile       -a      Sets the ae project filepath and -name to render out (Default: "./project.aep")
--playersFile   -p      Filepath and -name of csv file containing player data (Default: "./players.csv")
--firstCsvLine  -f      Setst the first csv line number (0 at the top) to parse. (Default (skip header line): 1)
--lastCsvLine   -l      Sets the last line number (0 at the top) of the csv file to parse (incl.). -1 to read all (Default: -1)
--aerenderPath          Path and name of aerender binary (Default (expected in path): aerender)
--imgNameFormat -i      The format use to create the image filename from the csv. Use the csv data by column index starting at 0 (Default: images/{3}_{2}_{1}_{0}.png)
                        Cas use raw column spaces and non ascii removed {0}, column lowercase {0:lower}, column uppercase {0:upper}, column 0-padded to n digits {0:pad:n}
--help          -h      Displays this help and exits
`)
    process.exit(0);
}

if (init) {
    console.log("Initializing renderer");
    await initRender(path.resolve(process.cwd(), workdir), aerenderPath);
    console.log("Render initialized");
    process.exit(0);
}

const firstCsvLineNum = parseInt(firstCsvLine);
const lastCsvLineNum = parseInt(lastCsvLine);

if (!isFinite(firstCsvLineNum) || !isFinite(lastCsvLineNum) || firstCsvLineNum < 0 || firstCsvLineNum % 1 != 0 || lastCsvLineNum < -1 || lastCsvLineNum % 1 != 0) {
    console.error("Csv line numbers must be integer numbers from 0 (first) or -1 (last) to the number of lines in the csv file");
    process.exit(1);
}

try {
    let players = [{ image: "", name: "", number: "", teamImage: "", teamName: "" }];

    const playersFileAbs = path.resolve(process.cwd(), workdir, playersFile);
    if ((await fs.lstat(playersFileAbs)).isDirectory()) {
        players = await dirRead(playersFileAbs);
    } else {
        players = await csvRead(playersFileAbs, firstCsvLineNum, lastCsvLineNum, imgNameFormat);
    }
    console.log(players);
    debugger;

    await fs.mkdir(path.resolve(process.cwd(), path.join(workdir, "_renderDir")), { recursive: true });
    await renderPlayers(path.resolve(process.cwd(), workdir), aepFile, players, aerenderPath);
} catch (err) {
    console.error(err);
    process.exit(1);
}