const path = require("path");
const os = require("os");
const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

class TscError extends Error {
  constructor(message) {
    super(message);
    this.name = "TscError";
    this.stack = "";
  }
}

const removeNewLinesAtEnd = (str) => str.replace(/(\r\n|\n|\r)+$/g, "");

const PLUGIN_NAME = "tsc-plugin";

class TscWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
    this.initialized = false;
  }
  async apply(compiler) {
    const isWatch = await new Promise((resolve) => {
      compiler.hooks.run.tap(PLUGIN_NAME, () => {
        if (!this.initialized) {
          this.initialized = true;

          resolve(false);
        }
      });

      compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
        if (!this.initialized) {
          this.initialized = true;

          resolve(true);
        }
      });
    });

    const file = path.resolve(
      compiler.context,
      `./node_modules/.bin/tsc${os.platform() === "win32" ? ".exe" : ""}`
    );

    const options = {
      ...this.options,
      ...(isWatch ? { watch: "", preserveWatchOutput: "" } : {}),
    };

    const args = [
      ...new Set(
        Object.keys(options)
          .reduce((acc, key) => [...acc, `--${key}`, String(options[key])], [])
          .filter(Boolean)
      ),
    ];

    const ptyProcess = pty.spawn(file, args, {
      name: "xterm-color",
    });

    process.once("exit", () => {
      ptyProcess.emit("exit");
    });

    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);

    let messages = [];

    ptyProcess.onData((data) => {
      if (isWatch) {
        const str = removeNewLinesAtEnd(data);
        const withoutAnsi = stripAnsi(str);

        if (
          /error TS\d*:/.test(withoutAnsi) ||
          /Found [1-9][0-9]* errors?\b./.test(withoutAnsi)
        ) {
          logger.error(str);
        } else {
          logger.info(str);
        }
      } else {
        messages.push(data);
      }
    });

    if (!isWatch) {
      logger.info("Starting typechecking...");

      compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async (compilation) => {
        await new Promise((resolve) => {
          ptyProcess.onExit(() => {
            resolve();
          });
        });

        if (messages.length > 0) {
          messages
            .map((m) =>
              removeNewLinesAtEnd(
                m
                  .split("\r\n")
                  .map((s) => s.replace(/^Found \d+ errors?\b.$/, ""))
                  .join("\r\n")
              )
            )
            .filter(Boolean)
            .map((m) => compilation.errors.push(new TscError(m)));
          messages = [];
        } else {
          logger.info("Found 0 errors.");
        }
      });
    }
  }
}

module.exports = TscWebpackPlugin;
