// Stolen from Alu!
import { red, bold } from "kleur";

process.on("uncaughtException", (err) => {
  console.log(bold(red(`[LOG] Caught error!\n${err.stack}`)));
  process.exit(1);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.log(bold(red(`[LOG] Caught error!\n${err.stack}`)));
  process.exit(1);
});