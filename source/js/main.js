// reduce motions
const ReduceMotionsMatches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (ReduceMotionsMatches) document.body.classList.add('reduce-motions');

// low battery level alert
if (navigator && navigator.getBattery) {
	navigator.getBattery().then(function(battery) {
		let currentLevel = Math.round(battery.level * 100);

		if (currentLevel <= 10) {
			alert('Your battery level is ' + currentLevel + '%. Take care about it.');
		}
	})
}

// internet connection alert
const offLineNotification = (function offLineHandler() {
	if (navigator && !navigator.onLine) alert('Oh no! Looks like you have not internet connection. The data may be outdated.');
	return offLineHandler 
})();

navigator.connection.addEventListener('change', offLineNotification());