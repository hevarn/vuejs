const { writeFileSync, readdirSync } = require('fs');
const { join } = require('path');

function buildModule () {
  return `
  import app from '../server/src/app.js'
  export default app
  `;
}

const routes = [];
const functions = {};
const services = readdirSync(join(__dirname, 'server', 'src', 'services'));

for (let i = 0; i < services.length; i++) {
  const filename = services[i];
  if (filename !== 'index.js') {
    const tmpPath = `./api/${filename}.js`;
    writeFileSync(tmpPath, buildModule(filename));
    routes.push({
      src: `/api/${filename}(/|.*)`,
      dest: `/api/${filename}`
    });
    functions[`api/${filename}.js`] = {
      includeFiles: 'server/config/**/*',
      maxDuration: 60
    };
  }
}
routes.push(
  { 'handle': 'filesystem' },
  { 'src': '/.*', 'status': 404, 'dest': '/200.html' }
);
writeFileSync('now.json', JSON.stringify({ 
  routes, 
  functions,
  env: {
    'NODE_CONFIG_DIR': '@config_dir'
  }
}, null, 2));
