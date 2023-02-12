import chalk from 'chalk';
import util from 'util';

const getTimeStamp = () => {
  return new Date().toISOString();
};

export default class Log {
  public static info = (args: any, namespace: string = '') =>
    console.log(
      chalk.blue(
        `[${getTimeStamp()}] [INFO]${namespace ? ` [${namespace}]` : ''}`,
        typeof args === 'string' ? chalk.blueBright(args) : typeof args === 'object' ? JSON.stringify(args) : args
      )
    );

  public static warn = (args: any, namespace: string = '') =>
    console.warn(
      chalk.yellow(
        `[${getTimeStamp()}] [WARN]${namespace ? ` [${namespace}] ` : ''}`,
        typeof args === 'string' ? chalk.yellowBright(args) : typeof args === 'object' ? JSON.stringify(args) : args
      )
    );

  public static error = (args: any, namespace: string = '') =>
    console.error(
      chalk.red(
        `[${getTimeStamp()}] [ERROR]${namespace ? ` [${namespace}] ` : ''}`,
        typeof args === 'string' ? chalk.redBright(args) : typeof args === 'object' ? JSON.stringify(args) : args
      )
    );

  /**
   * Only for development purposes
   */
  public static log = (args: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(chalk.bgMagenta(`[${getTimeStamp()}] [DEBUG] `, typeof args === 'string' ? chalk.gray(args) : util.inspect(args, false, null, true)));
    }
  };
}
