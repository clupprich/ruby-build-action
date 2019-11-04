# ruby-build-action

Uses [ruby-build](https://github.com/rbenv/ruby-build) to install a Ruby version.

<a href="https://github.com/clupprich/ruby-build-action"><img alt="GitHub Actions status" src="https://github.com/clupprich/ruby-build-action/workflows/Tests/badge.svg"></a>

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

* `ruby-version` - The version of Ruby you want to install

### Outputs

* `ruby-path` - The path to the Ruby exectuable that was installed

### Example workflow

```yaml
name: Example install of Ruby 2.6.5

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1

    - name: Install Ruby 2.6.5
      id: ruby
      uses: clupprich/ruby-build-action@master
      with:
        ruby-version: 2.6.5

    - name: Print version
      run: ${{ steps.ruby.outputs.ruby-path }} --version
```
