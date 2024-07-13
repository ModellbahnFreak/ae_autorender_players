import { render } from "@nexrender/core";
import * as path from "path";
import * as url from "url";
import { filenameFormat } from "./filenameFormatter.mjs";

function fileToUrl(file, workdir) {
    return url.pathToFileURL(path.resolve(workdir, file)).toString();
}

export async function renderPlayers(workdir, aepFile, players, aerenderPath) {
    for (const player of players) {
        console.log(`Starting render for ${player.name} (${player.image}) using ${workdir} and ${aerenderPath}`);

        const assets = [];
        assets.push({
            src: fileToUrl(player.image, workdir),
            type: "image",
            layerName: "Spielerfoto"
        });
        assets.push({
            property: "Source Text",
            value: player.name,
            type: "data",
            layerName: "Spielername"
        });
        assets.push({
            property: "Source Text",
            value: player.number,
            type: "data",
            layerName: "Nummer"
        });
        if (player.teamImage && player.teamImage.length > 0) {
            assets.push({
                src: fileToUrl(player.teamImage, workdir),
                type: "image",
                layerName: "Vereinslogo"
            });
        }

        const renderResult = await render({
            template: {
                src: fileToUrl(aepFile, workdir),
                composition: "main"
            },
            assets
        }, {
            workpath: workdir,
            binary: path.normalize(path.resolve(process.cwd(), aerenderPath.replace(/[/\\]/g, path.sep))),
            debug: false
        }
        );
    }
}