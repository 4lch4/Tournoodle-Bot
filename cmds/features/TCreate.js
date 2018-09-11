// const Replies = require('../../util/Strings')
const { Command } = require('discord.js-commando')
const tTool = require('../util/Tourney')
const Tourney = require('../../util/TourneyDB')

// const Tourney = require('tournoodle')

class TCreate extends Command {
  constructor (client) {
    super(client, {
      name: 'tcreate',
      group: 'features',
      memberName: 'tourney-create',
      description: 'Allows you to create a new tournament for your server using a guided setup.',
      examples: ['+tcreate'],
      guildOnly: true
    })
  }

  async run (msg, args) {
    let phase1Replies = await tTool.commencePhase1(msg)
    let { competitorMax, tourneyType, gameName } = phase1Replies

    // We have acquired the "necessary" bits for a database entry
    let tourney = new Tourney(msg, {
      competitorMax,
      tourneyType,
      gameName
    })

    msg.reply(`competitorMax = ${tourney.competitorMax}; tourneyType = ${tourney.tourneyType}; gameName = ${tourney.gameName}`)

    // Save the current status of the tourney
    // tourney.save()

    // Time to acquire the secondary info regarding user registration
    // let phase2Replies = await tTool.commencePhase2(msg)
    // msg.reply(`signupDate = ${phase2Replies.signupDate}; hostedDate = ${phase2Replies.hostedDate}; competitors === undefined = ${phase2Replies.competitors === undefined}`)
  }
}

module.exports = TCreate
