import chalk from "chalk";

export const log = {
  d(message: any) {
    console.log(
      chalk.black.bgYellow("[D]", `[${new Date().toISOString()}]`, message)
    );
  },

  e(message: any) {
    console.error(chalk.red("[E]", `[${new Date().toISOString()}]`, message));
  },

  i(message: any) {
    console.info(chalk.blue("[I]", `[${new Date().toISOString()}]`, message));
  },

  s(message: any) {
    console.info(chalk.green("[I]", `[${new Date().toISOString()}]`, message));
  },

  w(message: any) {
    console.warn(chalk.yellow("[W]", `[${new Date().toISOString()}]`, message));
  },
};
