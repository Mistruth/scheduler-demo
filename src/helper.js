function checkPriority(pirority) {
  if (typeof pirority !== 'number') {
    throw new Error('priority should be a number')
  }
}

module.exports = {
  checkPriority
}
