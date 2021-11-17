const chalk = require('chalk');

const logs = async (eventOwner, message, user = '') => {
  console.log(chalk.white.inverse.bold(`[${eventOwner.toUpperCase()}]`) + ' ' + chalk.blue(message)+ chalk.gray.italic.bold(` ${user}`));
}

exports.logs = logs;