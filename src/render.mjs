import { render } from "@nexrender/core";
import * as path from "path";
import * as url from "url";
import { filenameFormat } from "./filenameFormatter.mjs";

function fileToUrl(file, workdir) {
    return url.pathToFileURL(path.resolve(workdir, file)).toString();
}

export async function renderPlayers(workdir, aepFile, players, aerenderPath, imgNameFormat) {
    for (const player of players) {
        const playerImgName = filenameFormat(player, imgNameFormat);
        console.log(`Starting render with image file ${playerImgName}`);

        const renderResult = await render({
            template: {
                src: fileToUrl(aepFile, workdir),
                composition: "main"
            },
            assets: [
                {
                    src: fileToUrl(playerImgName, workdir),
                    type: "image",
                    layerName: "player.png"
                }
            ]
        }, {
            workpath: workdir,
            binary: aerenderPath,
        }
        );
    }
}