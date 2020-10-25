"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const http_server_1 = __importDefault(require("http-server"));
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const currentPath = process.cwd();
const gameConfig = require(currentPath + '/game.config.json');
async function timeout(time) {
    return new Promise((res) => {
        setTimeout(res, time);
    });
}
async function run(args) {
    switch (args[2]) {
        case 'run-client': {
            console.log('Running client code');
            process.chdir('client');
            let clientWebpackConfig = eval(fs_1.default.readFileSync(path_1.default.join(currentPath, 'client', 'webpack.config.js'), 'utf-8'));
            clientWebpackConfig.resolveLoader = {
                modules: [path_1.default.join(currentPath, 'client', 'node_modules'), path_1.default.join(__dirname, 'node_modules')],
            };
            clientWebpackConfig.output.filename = 'bundle.js';
            clientWebpackConfig.output.path = path_1.default.join(__dirname, 'game-client', 'src');
            clientWebpackConfig.mode = 'development';
            clientWebpackConfig.externals = clientWebpackConfig.externals || {};
            clientWebpackConfig.externals['react'] = 'react';
            clientWebpackConfig.externals['react-dom'] = 'react-dom';
            clientWebpackConfig.watch = true;
            let wp = webpack_1.default(clientWebpackConfig);
            wp.watch({}, (err, stats) => {
                console.log('Updated....');
                console.log(stats.compilation.warnings);
                console.log(stats.compilation.errors);
            });
            console.log('starting client');
            const onYarn = child_process_1.spawn(`yarn`, [], { shell: isWindows(), cwd: path_1.default.join(__dirname, 'game-client') });
            onYarn.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            onYarn.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            onYarn.on('close', (code) => {
                const ls = child_process_1.spawn(`yarn`, ['start'], { shell: isWindows(), cwd: path_1.default.join(__dirname, 'game-client') });
                ls.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                ls.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
                ls.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                });
            });
            break;
        }
        case 'run-server': {
            process.chdir('server');
            console.log(path_1.default.join(currentPath, 'server', 'webpack.config.js'));
            let serverWebpackConfig = eval(fs_1.default.readFileSync(path_1.default.join(currentPath, 'server', 'webpack.config.js'), 'utf-8'));
            serverWebpackConfig.resolveLoader = {
                modules: [path_1.default.join(currentPath, 'server', 'node_modules'), path_1.default.join(__dirname, 'node_modules')],
            };
            serverWebpackConfig.mode = 'development';
            serverWebpackConfig.output.filename = 'bundle.js';
            serverWebpackConfig.output.path = path_1.default.join(__dirname, 'game-server');
            console.log('starting server');
            var server = http_server_1.default.createServer({
                root: path_1.default.join(__dirname, 'game-server'),
                robots: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
            server.listen(44442);
            let wp = webpack_1.default(serverWebpackConfig);
            wp.watch({}, async (err, stats) => {
                console.log('Compiled New Code');
                console.log('warnings', stats.compilation.warnings);
                console.log('errors', stats.compilation.errors);
                const result = await axios_1.default({
                    url: 'http://localhost:5503/game/server-updated',
                    method: 'POST',
                    responseType: 'text',
                });
                console.log('Pushed', result.status === 200);
            });
            break;
        }
        case 'spin-up': {
            const ls = child_process_1.spawn(`docker-compose`, ['up'], { cwd: path_1.default.join(__dirname, 'docker') });
            ls.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            ls.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
            break;
        }
        case 'spin-down': {
            const ls = child_process_1.spawn(`docker-compose`, ['down'], { cwd: path_1.default.join(__dirname, 'docker') });
            ls.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            ls.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
            break;
        }
        case 'publish': {
            /*  console.log('publish');
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
              },
            };
      
            const req = http
              .request(options, (res) => {
                console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                  console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                  console.log('No more data in response.');
                });
              })
              .on('error', (err) => {
                console.log('Error: ' + err.message);
              });
            req.write(JSON.stringify({clientSource: clientBundle, serverSource: serverBundle, gameConfig: gameConfig}));
            req.end();*/
        }
        default:
            console.log('command not found');
            break;
    }
}
module.exports = {
    run,
};
function isWindows() {
    return process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5Qiw4REFBcUM7QUFDckMsa0RBQTBCO0FBQzFCLGlEQUFvQztBQUVwQyxnREFBd0I7QUFFeEIsNENBQW9CO0FBRXBCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFtQixDQUFDLENBQUM7QUFFOUQsS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFZO0lBQ2pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxHQUFHLENBQUMsSUFBYztJQUMvQixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNmLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRWhILG1CQUFtQixDQUFDLGFBQWEsR0FBRztnQkFDbEMsT0FBTyxFQUFFLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ2xHLENBQUM7WUFDRixt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