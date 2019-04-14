const levelConf = require('../../../gameConf/files/level_basic');

module.exports = {
	getTotalDungeon: function() {
		let totalLevel = []
		for (let i = 0; i < levelConf.length; i++) {
			let level = levelConf[i];
			totalLevel.push(level['ID']);
		}
		return [...new Set(totalLevel)];
	}
}