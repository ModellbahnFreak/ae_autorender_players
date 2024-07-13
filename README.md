# Autorender Script for player presentation
## How-To use
- Install nodejs: `https://nodejs.org/en/download/prebuilt-installer`
- Save ae file to the `workdir` folder as `project.aep`
- Replace Demo `workdir/players.csv` with required file
- Ensure, that `aerender` is available in the default location (or find its path) by entering in a terminal:
    - MacOS: `/Programme/Adobe\ After\ Effects\ CC/aerender –version`
    - Windows: `"C:\Program Files\Adobe\Adobe After Effects CC\Support Files\aerender.exe -version"` (incl. quotes)
- Open terminal in this folder and run:
    - `npm i`
    - `npm run start`
