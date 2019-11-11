const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');

function _dependenciesForPlatform(platform) {
  return 'autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev'
}

function _getPlatform() {
  return 'ubuntu-18.04'
}

async function _installDependencies() {
  const platform = _getPlatform()
  const dependencies = _dependenciesForPlatform(platform)
  await exec.exec(`sudo apt-get -qq install ${dependencies}`)
}

async function _installRubyBuild() {
  core.startGroup('Installing ruby-build')

  await _installDependencies()

  const rubyBuildDir = `${process.env.HOME}/var/ruby-build`
  await exec.exec(`git clone https://github.com/rbenv/ruby-build.git ${rubyBuildDir}`)
  await exec.exec(`sudo ${rubyBuildDir}/install.sh`, { env: { 'PREFIX': '/usr/local' } })

  core.endGroup()
}

async function _installRuby(rubyVersion, cacheAvailable) {
  core.startGroup(`Installing ${rubyVersion}`)

  if (!cacheAvailable) {
    await exec.exec(`ruby-build ${rubyVersion} ${process.env.HOME}/local/rubies/${rubyVersion}`)
  } else {
    core.info(`Skipping installation of ${rubyVersion}, already available in cache.`)
  }

  core.addPath(`${process.env.HOME}/local/rubies/${rubyVersion}/bin`)
  const rubyPath = await io.which('ruby', true)
  await exec.exec(`${rubyPath} --version`)
  core.setOutput('ruby-path', rubyPath);

  core.endGroup()
}

async function run() {
  try {
    await _installRubyBuild()

    const rubyVersion = core.getInput('ruby-version');
    const cacheAvailable = core.getInput('cache-available') == 'true'
    await _installRuby(rubyVersion, cacheAvailable)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
