// reduce motions
const ReduceMotionsMatches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (ReduceMotionsMatches) document.body.classList.add('reduce-motions');

// internet connection alert
const offLineNotification = (function offLineHandler() {
	if (navigator && !navigator.onLine) alert('Oh no! Looks like you have not internet connection. The data may be outdated.');
	return offLineHandler 
})();

navigator.connection.addEventListener('change', offLineNotification());