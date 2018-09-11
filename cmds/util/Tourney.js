const regex = require('../../util/RegEx')

const { getResponse } = require('./BaseCmd')
const Replies = require('../../util/strings/en_US').commands.tcreate

const commencePhase1 = async msg => {
  let competitorMax = await getCompetitorMax(msg)
  if (competitorMax === undefined) return msg.reply(Replies.commandTimeout)

  let tourneyType = await getTourneyType(msg)
  if (tourneyType === undefined) return msg.reply(Replies.commandTimeout)

  let gameName = await getGameName(msg)
  if (gameName === undefined) return msg.reply(Replies.commandTimeout)

  return Promise.resolve({
    competitorMax,
    tourneyType,
    gameName
  })
}

/**
 * Commences phase 2 of the tcreate command by retrieving the signup and hosted
 * dates, the registration type, and depending on the registration type then the
 * competitors may or may not exist as well. These are all then returned via a
 * Promise as a single object with the keys being 'signupDate', 'hostedDate',
 * 'registrationType', and 'competitors' respectively.
 *
 * @param {CommandMessage} msg The original message initiating the command
 *
 * @returns {Phase2Reply} The replies from the user for phase 2 questioning
 */
const commencePhase2 = async msg => {
  let signupDate = await getSignupDate(msg)
  if (signupDate === undefined) return msg.reply(Replies.commandTimeout)

  let hostedDate = await getHostedDate(msg)
  if (hostedDate === undefined) return msg.reply(Replies.commandTimeout)

  let registrationType = await getRegistrationType(msg)

  switch (registrationType) {
    case undefined:
      return msg.reply(Replies.commandTimeout)

    case 'Open Registration':
      // Handle open registration
      break

    case 'Closed Registration':
      var competitors = await getCompetitorMentions(msg)
      if (competitors === undefined) return msg.reply(Replies.commandTimeout)
  }
}

/**
 * Gets the signup date for the tournament from the user and returns it via a
 * Promise. If none is provided by the user, undefined is instead returned via
 * the Promise.
 *
 * @param {CommandMessage} msg The original CommandMessage initiating the command
 *
 * @returns {Promise<String>|Promise<undefined>}
 */
const getSignupDate = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getSignupDate).then(() => {
      getResponse(msg, val => { return regex.vd.test(val) })
        .then(res => resolve(res)).catch(err => reject(err))
    })
  })
}

/**
 * Gets the hosted date for the tournament from the user and returns it via a
 * Promise. If none is provided by the user, undefined is instead returned via
 * the Promise.
 *
 * @param {CommandMessage} msg The original CommandMessage initiating the command
 *
 * @returns {Promise<String>|Promise<undefined>}
 */
const getHostedDate = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getHostedDate).then(() => {
      getResponse(msg, val => { return regex.vd.test(val) })
        .then(res => resolve(res)).catch(err => reject(err))
    })
  })
}

/**
 *
 * @param {CommandMessage} msg
 *
 * @returns {Promise<String>|Promise<undefined>}
 */
const getRegistrationType = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getRegistrationType).then(() => {
      getResponse(msg, val => {
        val = val.toLowerCase()
        return val === 'open registration' ||
              val === 'closed registration' ||
              val === 'open' || val === 'closed'
      }).then(res => {
        if (res === undefined) resolve(res)
        else if (res.toLowerCase().startsWith('open')) resolve('Open Registration')
        else if (res.toLowerCase().startsWith('closed')) resolve('Closed Registration')
      }).catch(err => reject(err))
    })
  })
}

/**
 *
 * @param {CommandMessage} msg
 *
 * @returns {Promise<string>}
 */
const getCompetitorMentions = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getCompetitorMentions).then(() => {
      getResponse(msg, val => { return val.length > 0 })
        .then(res => resolve(res)).catch(err => reject(err))
    })
  })
}

/**
 *
 * @param {CommandMessage} msg
 *
 * @returns {Promise<string>}
 */
const getGameName = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getGameName).then(() => {
      getResponse(msg, val => { return val.length > 0 })
        .then(res => resolve(res)).catch(err => reject(err))
    })
  })
}

/**
 *
 * @param {CommandMessage} msg
 *
 * @returns {Promise<String>|Promise<undefined>}
 */
const getTourneyType = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getTourneyType).then(() => {
      getResponse(msg, val => {
        val = val.toLowerCase()
        return val === 'single elimination' ||
              val === 'double elimination' ||
              val === 'single' || val === 'double'
      }).then(res => {
        if (res === undefined) resolve(res)
        else if (res.toLowerCase().startsWith('single')) {
          resolve('Single Elimination')
        } else if (res.toLowerCase().startsWith('double')) {
          resolve('Dobule Elimination')
        }
      }).catch(err => reject(err))
    })
  })
}

/**
 * Gets the max number of competitors for the tournament from the user. If they
 * do not provide one then undefined is returned.
 *
 * @param {CommandMessage} msg The message object in order to retrieve responses
 *
 * @return {Promise<number>|Promise<undefined>} The max amount of competitors wrapped in a Promise
 */
const getCompetitorMax = msg => {
  return new Promise((resolve, reject) => {
    msg.reply(Replies.getCompetitorMax).then(() => {
      getResponse(msg, val => { return val >= 3 && val <= 64 }).then(res => {
        if (res !== undefined) resolve(Number(res))
        else resolve(undefined)
      }).catch(err => reject(err))
    })
  })
}

module.exports.commencePhase1 = commencePhase1
module.exports.commencePhase2 = commencePhase2
module.exports.getCompetitorMax = getCompetitorMax
module.exports.getCompetitorMentions = getCompetitorMentions
module.exports.getGameName = getGameName
module.exports.getTourneyType = getTourneyType
module.exports.getSignupDate = getSignupDate
module.exports.getHostedDate = getHostedDate

/**
 * @typedef {Object} Phase2Reply
 *
 * @prop {String} signupDate The date that signups are unlocked and competitors may join the tournament
 * @prop {String} hostedDate The actual date and timethe tournament will take place
 * @prop {String} registrationType The type of registration, open or closed
 * @prop {String[]} [competitors] An array containing the user ids of those who wish to compete
 */
