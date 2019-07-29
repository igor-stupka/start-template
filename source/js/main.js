const ReduceMotionsMatches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reduceMotionsClass = 'reduce-motions';
const reduceMotions = () => document.body.classList.add(reduceMotionsClass);

if (ReduceMotionsMatches) reduceMotions();

if (navigator.getBattery) {
	navigator.getBattery().then(function(battery) {
		let currentLevel = Math.round(battery.level * 100);

		if (currentLevel <= 10) {
			reduceMotions();
			console.log('Your battery level is ' + currentLevel + '%. We are reduced all motions on page.');
		}
	})
}

const offLineNotification = (function offLineHandler() {
	if (!navigator.onLine) alert('Oh no! Looks like you have not internet connection. The data may be outdated.');
	return offLineHandler 
})();

navigator.connection.addEventListener('change', offLineNotification());