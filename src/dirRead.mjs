import * as fs from "fs/promises";
import * as path from "path";

export async function dirRead(dir) {
    const players = [];
    const vereine = await fs.readdir(dir, { withFileTypes: true });
    for (const verein of vereine) {
        if (verein.isDirectory()) {
            const vereinParts = verein.name.split("_");
            const allSpieler = await fs.readdir(path.join(dir, verein.name), { withFileTypes: true });
            let vereinslogo = "";
            const vereinPlayers = [];

            for (const spieler of allSpieler) {
                if (spieler.name.toLowerCase().startsWith(verein.name.toLowerCase() + "_logo") || spieler.name.toLowerCase().startsWith(vereinParts[1].toLowerCase() + "_logo")) {
                    vereinslogo = path.join(dir, verein.name, spieler.name);
                    continue;
                }
                const firstUnderscore = spieler.name.indexOf("_");
                const secondUnderscore = spieler.name.indexOf("_", firstUnderscore + 1);
                const lastDot = spieler.name.lastIndexOf(".");
                const player = {
                    image: path.join(dir, verein.name, spieler.name),
                    name: spieler.name.substring(secondUnderscore + 1, lastDot).replace("_", " "),
                    number: spieler.name.substring(firstUnderscore + 1, secondUnderscore),
                    teamImage: "",
                    teamName: vereinParts[1] + " " + vereinParts[0]
                };
                vereinPlayers.push(player);
            }

            for (const player of vereinPlayers) {
                player.teamImage = vereinslogo;
                players.push(player);
            }
        }
    }
    return players;
}