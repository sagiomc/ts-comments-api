import * as figlet from "figlet";
import chalk from "chalk";
const SECOND_ARGUMENT = 2;

figlet.text(process.argv[SECOND_ARGUMENT], (error: any, data: any) => {
  if (error) {
    return process.exit(1);
  }

  console.log(chalk.blue(data));
  console.log("");
  return process.exit(0);
});
