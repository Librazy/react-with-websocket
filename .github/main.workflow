workflow "Auto Publish" {
  on = "push"
  resolves = [
    "Yarn Build",
    "Yarn Build Example",
  ]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@master"
  args = "tag v*"
}

action "Yarn" {
  uses = "docker://node:10"
  needs = ["Filters for GitHub Actions"]
  runs = "yarn"
}

action "Yarn Build" {
  uses = "docker://node:10"
  needs = ["Yarn"]
  runs = "yarn"
  args = "build"
}

action "Yarn Example" {
  uses = "docker://node:10"
  needs = ["Filters for GitHub Actions"]
  runs = "sh"
  args = "-c \"cd example && yarn\""
}

action "Yarn Build Example" {
  uses = "docker://node:10"
  needs = ["Yarn Example", "Yarn Build"]
  runs = "sh"
  args = "-c \"cd example && yarn build\""
}

action "Write npmrc" {
  uses = "docker://node:10"
  needs = ["Yarn Build Example", "Yarn Build"]
  runs = "sh"
  args = "-c \"cat //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc\""
}

action "Yarn Publish" {
  uses = "docker://node:10"
  needs = ["Write npmrc"]
  runs = "yarn"
  args = "publish --non-interactive --new-version `git describe --exact-match --tags`"
}
