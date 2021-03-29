import chalk from 'chalk';

export default class Log {
  static e(msg: string, tag: string = '') {
    console.error(chalk.bold.red(`${tag} ${msg}`));
  }

  static i(msg: string, tag: string = '') {
    console.info(chalk.green(`${tag} ${msg}`));
  }

  static w(msg: string, tag: string = '') {
    console.log(chalk.keyword('orange')(`${tag} ${msg}`));
  }
}
