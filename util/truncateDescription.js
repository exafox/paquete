/**
 * Returns the given description truncated at the first instance of
 * specific phrases.
 * @param {description} string
 * @returns {String}
 */

const truncateAtPhrases = [
  'read more at',
  'like us on',
  'follow us on',
  'follow us at',
];

const truncateDescription = (description) => {
  const downcasedDescription = description.trim().toLowerCase();
  const truncateAtIndices = truncateAtPhrases
    .map((phrase) => {
      return downcasedDescription.indexOf(phrase);
    })
    .filter((idx) => idx > 0);

  if (!truncateAtIndices.length) {
    return description;
  }

  const truncateAtIndex = Math.min.apply(Math, truncateAtIndices);
  return description.slice(0, truncateAtIndex).trim();
};

export default truncateDescription;
