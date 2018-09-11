/**
 * Contains various Regular Expressions for use throughout the program. I've
 * placed them in their own file primarily because of expressions like the vdt
 * one which is 348 characters long. It's easier to just throw them in their own
 * file and call them.
 */
module.exports = {
  /**
   * A Regular Expression used to determine if the provided input String is a
   * valid date and time. It's extremely long and covers *many* different
   * formats, such as MM/DD/YYYY 05:45:02 or MM.DD.YYYY 17:45:02, etc. It was
   * obtained from the regexlib website, and more information is available at
   * the @see more link.
   *
   * @returns {RegExp} A Regular Expression to validate datetime input
   *
   * @see http://regexlib.com/REDetails.aspx?regexp_id=610
   */
  vdt: /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-./])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/,

  /**
   * A Regular Expression for determining if the provided input is a valid date
   * of format MM/DD/YYYY, MM.DD.YYYY, or MM-DD-YYYY. This expression was found
   * on the regexlib website, check the see link for more information.
   *
   * @returns {RegExp} A Regular Expression to validate date input
   *
   * @see http://regexlib.com/REDetails.aspx?regexp_id=932
   */
  vd: /^([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0-9]{4}|[0-9]{2})$/
}
