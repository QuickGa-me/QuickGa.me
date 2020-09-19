import webpack from 'webpack';
import httpServer from 'http-server';
import axios from 'axios';
import {spawn} from 'child_process';
import http from 'http';
import path from 'path';
import chokidar from 'chokidar';
import fs from 'fs';

const currentPath = process.cwd();

const gameConfig = require(currentPath + '/game.config.json');

async function timeout(time: number) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

async function run(args: string[]) {
  switch (args[2]) {
    case 'run-client': {
      console.log('Running client code');
      process.chdir('client');
      let clientWebpackConfig = eval(fs.readFileSync(path.join(currentPath, 'client', 'webpack.config.js'), 'utf-8'));

      clientWebpackConfig.resolveLoader = {
        modules: [path.join(currentPath, 'client', 'node_modules'), path.join(__dirname, 'node_modules')],
      };
      clientWebpackConfig.output.filename = 'bundle.js';
      clientWebpackConfig.output.path = path.join(__dirname, 'game-wrapper', 'src');
      clientWebpackConfig.mode = 'development';
      clientWebpackConfig.externals = clientWebpackConfig.externals || {};
      clientWebpackConfig.externals['react'] = 'react';
      clientWebpackConfig.externals['react-dom'] = 'react-dom';

      clientWebpackConfig.watch = true;

      let wp = webpack(clientWebpackConfig);
      wp.watch({}, (err, stats) => {
        console.log('Updated....');
        console.log(stats.compilation.warnings);
        console.log(stats.compilation.errors);
      });

      console.log('starting client');
      const onYarn = spawn(`yarn`, [], {shell: isWindows(), cwd: path.join(__dirname, 'game-wrapper')});

      onYarn.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      onYarn.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      onYarn.on('close', (code) => {
        const ls = spawn(`yarn`, ['start'], {shell: isWindows(), cwd: path.join(__dirname, 'game-wrapper')});

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
      console.log(path.join(currentPath, 'server', 'webpack.config.js'));
      let serverWebpackConfig = eval(fs.readFileSync(path.join(currentPath, 'server', 'webpack.config.js'), 'utf-8'));

      serverWebpackConfig.resolveLoader = {
        modules: [path.join(currentPath, 'server', 'node_modules'), path.join(__dirname, 'node_modules')],
      };
      serverWebpackConfig.mode = 'development';
      serverWebpackConfig.output.filename = 'bundle.js';
      serverWebpackConfig.output.path = path.join(__dirname, 'game-server');

      console.log('starting server');
      var server = httpServer.createServer({
        root: path.join(__dirname, 'game-server'),
        robots: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
      server.listen(44442);

      let wp = webpack(serverWebpackConfig);
      wp.watch({}, async (err, stats) => {
        console.log('Compiled New Code');
        console.log('warnings', stats.compilation.warnings);
        console.log('errors', stats.compilation.errors);
        const result = await axios({
          url: 'http://localhost:5503/game/server-updated',
          method: 'POST',
          responseType: 'text',
        });
        console.log('Pushed', result.status === 200);
      });

      break;
    }
    case 'spin-up': {
      const ls = spawn(`docker-compose`, ['up'], {cwd: path.join(__dirname, 'docker')});

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
      const ls = spawn(`docker-compose`, ['down'], {cwd: path.join(__dirname, 'docker')});

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
  return process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE!));
}
