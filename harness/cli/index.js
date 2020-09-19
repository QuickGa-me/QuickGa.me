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
            process.chdir('client');
            let clientWebpackConfig = eval(fs_1.default.readFileSync(path_1.default.join(currentPath, 'client', 'webpack.config.js'), 'utf-8'));
            clientWebpackConfig.resolveLoader = {
                modules: [path_1.default.join(currentPath, 'client', 'node_modules'), path_1.default.join(__dirname, 'node_modules')],
            };
            clientWebpackConfig.output.filename = 'bundle.js';
            clientWebpackConfig.output.path = path_1.default.join(__dirname, 'game-wrapper', 'src');
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
            const onYarn = child_process_1.spawn(`yarn`, [], { shell: isWindows(), cwd: path_1.default.join(__dirname, 'game-wrapper') });
            onYarn.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            onYarn.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            onYarn.on('close', (code) => {
                const ls = child_process_1.spawn(`yarn`, ['start'], { shell: isWindows(), cwd: path_1.default.join(__dirname, 'game-wrapper') });
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
            const result = await axios_1.default({
                url: 'http://localhost:5503/game/server-updated',
                method: 'POST',
                responseType: 'text',
            });
            console.log('updated', result.status === 200);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5Qiw4REFBcUM7QUFDckMsa0RBQTBCO0FBQzFCLGlEQUFvQztBQUVwQyxnREFBd0I7QUFFeEIsNENBQW9CO0FBRXBCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFtQixDQUFDLENBQUM7QUFFOUQsS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFZO0lBQ2pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxHQUFHLENBQUMsSUFBYztJQUMvQixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNmLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QixJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQyxZQUFFLENBQUMsWUFBWSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFaEgsbUJBQW1CLENBQUMsYUFBYSxHQUFHO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDbEcsQ0FBQztZQUNGLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO1lB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