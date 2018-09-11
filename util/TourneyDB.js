const mongoose = require('mongoose')
const uri = require('./config.json').mongoUrl
const crypto = require('crypto')

const schema = new mongoose.Schema({
  id: String,
  gameName: String,
  tourneyName: String,
  tourneyDesc: String,
  hostedDate: String,
  signupDate: String,
  thirdPlaceMatch: Boolean,
  randomizeSeeds: Boolean,
  tourneyType: String,
  competitorMax: Number,
  competitors: Array,
  registrationType: String
}, { collections: 'tourneys' })

class TourneyDB {
  /**
   * The default constructor for the TourneyDB class. This class is used by the
   * tournament commands in order to interact with the database where the info
   * is stored.
   *
   * @param {CommandMessage} creatingMsg
   * @param {TourneyOptions} [tourney] The (optional) tourney object to start things off
   *
   * @returns {TourneyDB} The instantiated TourneyDB class
   */
  constructor (creatingMsg, tourney = undefined) {
    this.tourney = tourney
    this.msg = creatingMsg
    this.connection = mongoose.createConnection(uri)
    this.TourneyModel = this.connection.model('Tourney', schema)
    if (this.tourney) this.model = new this.TourneyModel(tourney)
    else this.model = new this.TourneyModel()
  }

  /**
   * Updates the currently existing Tournament object with the newly provided
   * object. Uses the Mongoose update method which will take the values from the
   * provided object and attempt to update any existing values with matching
   * property names.
   *
   * @param {Object} newness An object with the properties and values to update
   */
  update (newness) {
    let id = this.tourneyId
    if (newness && id) {
      return new Promise((resolve, reject) => {
        this.model.update({ id: id }, newness, (err, raw) => {
          if (err) reject(err)
          else resolve(raw)
        })
      })
    } else return Promise.resolve(undefined)
  }

  /**
   * Saves the currently stored tournament information in the tourney db and
   * then returns the result via a Promise.
   */
  save () {
    return new Promise((resolve, reject) => {
      if (this.model === undefined) {
        reject(new Error('The model has not been initiated.'))
      } else {
        this.model.save((err, res) => {
          if (err) reject(err)
          else resolve(res)
        })
      }
    })
  }

  /**
   * Deletes the tournament from the database that has the same id as the
   * currently stored tournament.
   */
  delete () {
    let id = this.tourneyId
    if (id) {
      return new Promise((resolve, reject) => {
        this.exists().then(exists => {
          if (exists) {
            this.model.deleteOne({ id: id }, err => {
              if (err) reject(err)
              else resolve()
            })
          } else resolve()
        })
      })
    } else return Promise.resolve(false)
  }

  /**
   * Checks the tournament db to see if the currently stored tournament id
   * already exists.
   *
   * @returns {Promise<Boolean>}
   */
  exists () {
    let id = this.tourneyId
    if (id) {
      return new Promise((resolve, reject) => {
        this.TourneyModel.countDocuments({ id: id }, (err, count) => {
          if (err) reject(err)
          else if (count > 0) resolve(true)
          else resolve(false)
        })
      })
    } else return Promise.resolve(false)
  }

  /**
   * Finishes the tournament connection by closing the Mongoose connection and
   * setting all stored variables to undefined.
   */
  finish () {
    this.connection.close()
    this.tourney = undefined
    this.model = undefined
    this.msg = undefined
  }

  // #region Tourney Setters
  set signupDate (date) {
    if (date) this.tourney.signupDate = date
    else return new Error('Invalid signup date provided.')
  }

  set hostedDate (date) {
    if (date) this.tourney.hostedDate = date
    else return new Error('Invalid hosted date provided.')
  }

  set tourneyType (type) {
    if (type.toLowerCase() === 'single elimination' || type.toLowerCase() === 'double elimination') {
      this.tourney.tourneyType = type
    } else return new Error('Invalid tourney type provided.')
  }

  set tourneyName (name) {
    if (name) this.tourney.tourneyName = name
    else return new Error('Invalid name provided.')
  }

  set tourneyDesc (desc) {
    if (desc) this.tourney.tourneyDesc = desc
    else return new Error('Invalid tourney description provided.')
  }

  set competitorMax (max) {
    if (max) this.tourney.competitorMax = Number(max)
    else return new Error('Invalid number for max competitors provided.')
  }

  set competitors (competitors) {
    if (competitors) this.tourney.competitors = competitors
    else return new Error('Invalid object provided for Array of competitors.')
  }

  set registrationType (type) {
    if (type.toLowerCase() === 'open registration' || type.toLowerCase() === 'closed registration') {
      this.tourney.tourneyType = type
    } else return new Error('Invalid tourney type provided.')
  }
  // #endregion Tourney Setters

  // #region Tourney Getters
  /**
   * Generates and returns a unique id for the tournament to be used in the
   * mongo db.
   */
  get tourneyId () {
    let tourney = this.tourney
    if (tourney !== undefined && tourney.gameName !== undefined && tourney.tourneyType !== undefined &&
        tourney.competitorMax !== undefined) {
      return crypto.createHash('md5').update(this.tourney.gameName + this.tourney.tourneyType +
          this.tourney.competitorMax).digest('hex')
    } else return undefined
  }

  get signupDate () {
    if (this.tourney) return this.tourney.signupDate
    else return undefined
  }

  get tourneyType () {
    if (this.tourney) return this.tourney.tourneyType
    else return undefined
  }

  get tourneyName () {
    if (this.tourney) return this.tourney.tourneyName
    else return undefined
  }

  get tourneyDesc () {
    if (this.tourney) return this.tourney.tourneyDesc
    else return undefined
  }

  get competitorMax () {
    if (this.tourney) return this.tourney.competitorMax
    else return undefined
  }

  get competitors () {
    if (this.tourney) return this.tourney.competitors
    else return undefined
  }

  get hostedDate () {
    if (this.tourney) return this.tourney.hostedDate
    else return undefined
  }

  get registrationType () {
    if (this.tourney) return this.tourney.registrationType
    else return undefined
  }
  // #endregion Tourney Getters
}

module.exports = TourneyDB

// #region JSDocs Type Info
/**
 * @typedef {object} TourneyOptions
 * @prop {string} gameName The name of the game being played
 * @prop {string} tourneyType The type of tournament hosted (Single Elim., Round Robin, etc.)
 * @prop {number} competitorMax The max amount of individuals to compete
 * @prop {string} [id] The unique id used in the mongo db for storing this tourney
 * @prop {string} [tourneyName] The name of this specific tournament
 * @prop {string} [tourneyDesc] A description of the tournament
 * @prop {boolean} [thirdPlaceMatch] True or false, should a third place be determined
 * @prop {boolean} [randomizeSeeds] True or false, should the competitor seeds be randomized
 * @prop {Competitor[]} [competitors] An array containing the competitors for this tournament
 * @prop {string} [hostedDate] The date the tournament is to be hosted
 * @prop {string} [signupDate] The date that competitors can begin to sign up
 * @prop {string} [registrationType] The type of registration (open/closed)
 */

const { CommandMessage } = require('discord.js-commando')
// #endregion JSDocs Type Info
