# Tournoodle_Bot

[![Greenkeeper badge](https://badges.greenkeeper.io/Alcha/Tournoodle-Bot.svg)](https://greenkeeper.io/)

This is a small Discord bot that uses the [Discord.js][0] framework. The sole
purpose of the bot is for building out and testing the [Tournoodle][1] module
that is for generating/managing tournaments.

## Experimental Features

While this bot is for building out the **Tournoodle** module, I'm also testing
a new feature for alternate language support. For example, Tron could be on a
server that primarily speaks Spanish and the responses could then be set to
Spanish instead of English.

I'm hoping I can use SQLite to store the choices per server and then have a
single entry point of `Strings.js` or something along those lines that would
then determine which language to use and return the proper strings.

All languages would then be placed within the `strings` directory and they'll be
a JavaScript file for that language, e.g. `English.js` or `Spanish.js`. At first
I was going to name the files `en_US.js` and `en_GB.js`, etc., but after
thinking it over, there's no real need to support US English and UK English, as
they're virtually the same thing.

[0]: https://discord.js.org/#/
[1]: https://github.com/HF-Solutions/Tournoodle