const { YoGenerator, YoHelper, commonPrompt } = require("yo-reshow");

/**
 * NPM Generator
 */

module.exports = class extends YoGenerator {
  /**
   * Run loop (Life cycle)
   * https://yeoman.io/authoring/running-context.html#the-run-loop
   *
   * 1. initializing
   * 2. prompting
   * 3. configuring
   * 4. default
   * 5. writing
   * 6. conflicts
   * 7. install
   * 8. end
   */

  /**
   * Questions.
   *
   * https://www.alwaystwisted.com/post.php?s=using-lists-in-a-yeoman-generator
   * https://github.com/SBoudrias/Inquirer.js
   */
  async prompting() {
    const {
      handleAnswers,
      mergePromptOrOption,
      promptChainLocator,
      promptChain,
    } = YoHelper(this);

    const prompts = [
      ...commonPrompt.mainName(this),
      ...commonPrompt.babel(this),
      ...commonPrompt.desc(this),
      ...commonPrompt.author(this),
      ...commonPrompt.repository(this),
    ];

    const answers = await mergePromptOrOption(prompts, (nextPrompts) =>
      promptChain(promptChainLocator(nextPrompts))
    );
    handleAnswers(answers, (payload) => {
      if (payload.isUseBabel) {
        this.composeWith(require.resolve("../compile-sh"), payload);
      }
    });
  }

  writing() {
    this.env.options.nodePackageManager = "yarn";
    const { cp, chMainName, syncJSON } = YoHelper(this);

    // handle change to new folder
    chMainName(this.mainName);

    // handle copy file
    cp("src", null, this.payload);
    cp("README.md", null, this.payload);
    cp(".gitignore", null, this.payload);
    cp("Test.js", "src/__tests__/Test.js", this.payload);

    syncJSON("package.json", null, this.payload, (data) => {
      const keywords = this.payload.keyword?.split(",");
      if (keywords && keywords.length) {
        data.keywords = keywords.map((s) => s.trim());
      }
      data.repository = this.payload.repository;
      data.homepage = this.payload.repositoryHomepage;
      data.dependencies = {
        ...data.dependencies,
        ...this.payload.npmDependencies,
      };
      if (!this.payload.isUseBabel) {
        delete data.devDependencies["@babel/cli"];
        delete data.exports;
        delete data.module;
        delete data.scripts.clean;
        delete data.scripts.build;
        delete data.scripts["build:cjs"];
        delete data.scripts["build:es"];
        data.main = "./src/index.js";
        data.bin[this.mainName] = "./src/index.js";
        data.scripts.test = "npm run mocha";
        data.scripts.mocha = "npm run mochaFor -- 'src/**/__tests__/*.js'";
        data.files = data.files.filter((f) => f !== "build");
        data.files.push("src");
      }
      if (!this.payload.isUseWebpack) {
        delete data.scripts["webpack"];
        delete data.scripts["clean:webpack"];
      }
      return data;
    });
  }
};
