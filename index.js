const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.startGroup('Installing ruby-build')
    await exec.exec('sudo apt-get -qq install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev')
    await exec.exec('git clone https://github.com/rbenv/ruby-build.git')
    await exec.exec('sudo ./ruby-build/install.sh', { env: { 'PREFIX': '/usr/local' } })
    core.endGroup()

    const rubyVersion = core.getInput('ruby-version');
    const cacheAvailable = core.getInput('cache-available') == 'true'

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
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
