const http = require('http');
const path = require('path');
const fs = require('fs');
const currentPath = process.cwd();
var webpack = require("webpack");

const gameConfig = require(currentPath + '/game.config.json');

function webpackPromise(run) {
    return new Promise((res, rej) => {
        run((er, stats) => {
            if (er) {
                rej(er);
            } else {
                res(stats);
            }
        })
    })
}

async function run(args) {
    console.log(`args: ${JSON.stringify(args)}`);

    switch (args[0]) {
        case "publish": {
            console.log('publish');
            process.chdir('client');
            let clientConfig = eval(fs.readFileSync(path.join(currentPath, 'client', 'webpack.config.js'), 'utf-8'));
            let wp = webpack(clientConfig);
            let clientResult = await webpackPromise(wp.run.bind(wp));

            process.chdir('../server');
            console.log(process.cwd());
            let serverConfig = eval(fs.readFileSync(path.join(currentPath, 'server', 'webpack.config.js'), 'utf-8'));

            wp = webpack(serverConfig);
            let serverResult = await webpackPromise(wp.run.bind(wp));

            let clientBundle = fs.readFileSync(path.join(currentPath, 'client', 'dist', 'bundle.js'), 'utf-8');
            let serverBundle = fs.readFileSync(path.join(currentPath, 'server', 'dist', 'bundle.js'), 'utf-8');

            let gameConfig = JSON.parse(fs.readFileSync(path.join(currentPath, 'game.config.json'), 'utf-8'));


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/games/' + gameConfig.gameId,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            };


            const req = http.request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
            req.write(JSON.stringify({clientSource: clientBundle, serverSource: serverBundle, gameConfig: gameConfig}));
            req.end();
        }
    }

}

module.exports = {
    run
};