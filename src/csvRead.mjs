import * as csv from "csv";
import * as fs from "fs";
import { filenameFormat } from "./filenameFormatter.mjs"

export async function csvRead(playersFile, firstCsvLineNum, lastCsvLineNum, imgNameFormat) {
    const players = [];
    const parser = csv.parse({
        delimiter: ",",
        comment: "#",
        from_line: firstCsvLineNum + 1,
        to_line: lastCsvLineNum >= 0 ? (lastCsvLineNum + 1) : undefined
    });
    const file = await fs.createReadStream(playersFile, { encoding: "utf-8" });

    return new Promise((resolve, reject) => {
        parser.on('readable', function () {
            let record;
            while ((record = parser.read()) !== null) {
                players.push({
                    image: filenameFormat(record, imgNameFormat),
                    name: record[0],
                    number: record[1],
                    teamImage: record[2] + " " + record[3],
                    teamName: ""
                });
            }
        });
        // Catch any error
        parser.on('error', function (err) {
            reject(err.message);
        });

        parser.on('end', function () {
            console.log(`Finished reading csv. Loaded ${players.length} entries`);
            file.close();
            resolve(players);
        });
        file.pipe(parser);
    });
}