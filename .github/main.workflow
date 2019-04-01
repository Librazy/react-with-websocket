workflow "Auto Publish" {
  on = "push"
  resolves = [
    "Yarn Publish",
  ]
}

action "Yarn" {
  uses = "docker://node:10"
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
  runs = "yarn"
  args = "example"
}

action "Yarn Build Example" {
  uses = "docker://node:10"
  needs = ["Yarn Example", "Yarn Build"]
  runs = "yarn"
  args = "build-example"
}

action "Write npmrc" {
  uses = "docker://node:10"
  needs = ["Yarn Build Example", "Yarn Build"]
  runs = ["sh", "-c", "echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc"]
  secrets = ["NPM_TOKEN"]
}

action "Yarn Publish" {
  uses = "docker://node:10"
  needs = ["Write npmrc"]
  runs = "yarn"
  args = "publish --non-interactive"
}
