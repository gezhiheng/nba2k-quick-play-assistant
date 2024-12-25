export default {
  snake: function(currentDraftIndex, currentDraftRound, playersNum) {
    let nextDraftIndex
    if (currentDraftRound % 2 === 0) {
      nextDraftIndex = 
        currentDraftIndex > 0 ? currentDraftIndex - 1 : 0
    } else {
      nextDraftIndex = 
        currentDraftIndex < playersNum - 1 ? currentDraftIndex + 1 : playersNum - 1
    }
    return nextDraftIndex
  },
  random: function(playerNames) {
    // TODO complete the function
  },
  order: function(currentDraftIndex, currentDraftRound) {
    // TODO complete the function
  }
}

