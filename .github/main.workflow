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
  runs = "sh -c"
  args = "cd example && yarn"
}

action "Yarn Build Example" {
  uses = "docker://node:10"
  needs = ["Yarn Example", "Yarn Build"]
  runs = "sh -c"
  args = "cd example && yarn build"
}
