const { Command } = require('discord.js-commando')

/**
 * Gets a response from the author of the provided CommandMessage object by
 * ensuring their input fits the provided verify function. All input retrieved
 * from the user is passed through the function until a true value is returned.
 * When a true value is obtained, the response is returned via a Promise. If the
 * command times out then undefined is returned via the Promise instead.
 *
 * @param {CommandMessage} msg The message object used to retrieve responses
 * @param {Function} verify The function used to verify the user input is valid
 *
 * @returns {Promise<String>|Promise<undefined>} The response or undefined via a Promise
 *
 * @example // Obtain a number 0 through 9
 * getResponse(msg, val => { return val >= 0 && val < 10 })
 *  .then(res => console.log(`Number 0 - 9 = ${res}`))
 *
 * @example // See if the user requies help
 * getResponse(msg, val => { return val.toLocaleLowerCase() = 'help' })
 *   .then(res => console.log('User requires help.'))
 */
module.exports.getResponse = (msg, verify) => {
  return new Promise((resolve, reject) => {
    let coll = msg.channel.createMessageCollector(m =>
      m.member.id === msg.author.id && m.channel.id === msg.channel.id, { time: 60000 }
    )

    coll.on('collect', (m, c) => {
      if (verify(m.content)) {
        resolve(m.content)
        coll.stop()
      } else msg.reply(`${m.content} does not match the necessary format.`)
    })

    coll.on('end', (c, r) => {
      if (r === 'time' || r === 'user') resolve(undefined)
      else reject(new Error(r))
    })
  })
}

module.exports.BaseCmd = class BaseCmd extends Command {

}
