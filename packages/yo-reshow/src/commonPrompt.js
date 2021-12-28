import mainName from "./mainNamePrompt";

const commonPrompt = {
  mainName,
  desc: (oGen) => [
    {
      type: "input",
      name: "description",
      message: "Please input description for npm?",
      default: "",
    },
    {
      type: "input",
      name: "keyword",
      message: "Please input keyword for npm?",
      default: "",
    },
  ],
  author: (oGen) => [
    {
      type: "input",
      name: "authorName",
      message: "Please input author Name?",
      default: "",
    },
    {
      type: "input",
      name: "authorEmail",
      message: "Please input author Email?",
      default: "",
    },
  ],
  repository: (oGen) => [
    {
      type: "input",
      name: "repositoryName",
      message: "Please input code repository name ?",
      default: "",
    },
    {
      type: "input",
      name: "repositoryOrgName",
      message: "Please input code repository organization name ?",
      default: "",
    },
  ],
};

export default commonPrompt;
