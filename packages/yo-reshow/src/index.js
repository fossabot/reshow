import {STRING} from "reshow-constant";
import FS from "fs";

// for app
import YoGenerator from "yeoman-generator";
import YoSay from "yosay";
import mkdirp from "mkdirp";

// for test
import YoTest from "yeoman-test";
import assert from "yeoman-assert";
import path from "path";

const getYo = () => {
  return {
    YoGenerator,
    YoTest: ({ source, params }) => {
      source = STRING === typeof source ? path.join(source) : source;
      const testHelper = YoTest.create(source)
        .withPrompts(params)
        .inTmpDir((dir) => {
          console.log(`Build on: ${dir}`);
          console.log(`Source : ${source}`);
        })
        .run();
      return testHelper;
    },
    YoHelper: (oGen) => {
      const folders = oGen.destinationRoot().split("/");
      const destFolderName = folders[folders.length - 1];
      return {
        destFolderName,
        mkdir: (dir) => {
          mkdirp(oGen.destinationPath(dir));
        },
        say: (message) => {
          oGen.log(YoSay(message, { maxLength: 30 }));
        },

        // https://github.com/SBoudrias/mem-fs-editor
        cp: (src, dest, options) => {
          const oGenFs = oGen.fs;
          const action = options ? oGenFs.copyTpl : oGenFs.copy;

          let actualSrc;
          if (!FS.existsSync(src)) {
              dest = dest || src;
              actualSrc = oGen.templatePath(src);
          } else {
              dest = dest || path.basename(src);
              actualSrc = src;
          }

          try {
            action.call(
              oGenFs,
              actualSrc,
              oGen.destinationPath(dest),
              options
            );
          } catch (e) {
            console.log(e);
          }
        },
      };
    },
    assert,
  };
};

export default getYo;
