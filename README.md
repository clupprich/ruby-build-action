# ruby-build-action

Uses [ruby-build](https://github.com/rbenv/ruby-build) to install a Ruby version.

<a href="https://github.com/clupprich/ruby-build-action"><img alt="GitHub Actions status" src="https://github.com/clupprich/ruby-build-action/workflows/Tests/badge.svg"></a>

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflows) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

* `ruby-version` - The version of Ruby you want to install
* `cache-available` - A flag if a cached Ruby installation is available (see [the examples](#example-workflows) below)

### Outputs

* `ruby-path` - The path to the Ruby exectuable that was installed

### Example workflows

```yaml
name: Example install of Ruby 2.6.5

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: clupprich/ruby-build-action@master
      id: ruby
      with:
        ruby-version: 2.6.5
    - name: Print version
      run: ${{ steps.ruby.outputs.ruby-path }} --version
```

Note that installing Ruby from source is slow. However, you can cache the installation by using the [`actions/cache`](https://github.com/actions/cache) action, which is available as a preview right now:


```yaml
name: Example install of Ruby 2.6.5 (cached)

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: actions/cache@preview
      id: cache
      with:
        path: ~/local/rubies
        key: ruby-2.6.5
    - uses: clupprich/ruby-build-action@master
      id: ruby
      with:
        ruby-version: 2.6.5
        cache-available: ${{ steps.cache.outputs.cache-hit == 'true' }}
    - name: Print version
      run: ${{ steps.ruby.outputs.ruby-path }} --version
```

This runs way faster (we still need to install a couple of packages via `apt-get install`, though): The uncached version takes around 4 minutes to complete, the cached version 30 seconds.
