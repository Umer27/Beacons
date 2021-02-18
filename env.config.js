/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function getEnvName() {
  return (process.env.NODE_ENV || '').toLowerCase();
}
let envs;
function setEnvs() {
  if (getEnvName().includes('dev')) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require('dotenv');
    const { parsed } = config();
    envs = parsed;
  } else {
    envs = process.env;
  }
  return envs;
}

function getEnvs() {
  if (!envs) {
    return setEnvs();
  }
  return envs;
}

module.exports = { getEnvs, getEnvName, setEnvs };
