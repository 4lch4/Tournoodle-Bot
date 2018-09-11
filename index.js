const { CommandoClient } = require('discord.js-commando')
const tools = new (require('./util/tools'))()
const path = require('path')
const config = require('./util/config.json')

const client = new CommandoClient({
  commandPrefix: 't!',
  owner: config.owner
})

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['features', 'Feature Command Group']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn({
    dirname: path.join(__dirname, 'cmds'),
    excludeDirs: /(util)/
  })

client.on('ready', () => {
  let readyTime = tools.formattedUTCTime

  client.channels.get(config.notificationChannel).send(`Tournoodle has come online > **${readyTime}**`)

  console.log(`Tournoodle is now online > ${readyTime}`)
})

client.login(config.discordKey)
