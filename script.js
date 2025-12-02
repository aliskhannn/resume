function parseYearMonth(value) {
	if (!value) return null;
	if (value === 'now') {
		const now = new Date();
		return { year: now.getFullYear(), month: now.getMonth() + 1 };
	}
	const [y, m] = value.split('-').map(Number);
	if (!y || !m) return null;
	return { year: y, month: m };
}

function diffInMonths(start, end) {
	return (end.year - start.year) * 12 + (end.month - start.month);
}

function formatExperience(totalMonths) {
	if (totalMonths <= 0) return 'менее 1 месяца';

	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	const parts = [];

	if (years > 0) {
		const yearWord =
			years === 1 ? 'год' :
				years >= 2 && years <= 4 ? 'года' : 'лет';
		parts.push(`${years} ${yearWord}`);
	}

	if (months > 0) {
		const monthWord =
			months === 1 ? 'месяц' :
				months >= 2 && months <= 4 ? 'месяца' : 'месяцев';
		parts.push(`${months} ${monthWord}`);
	}

	return parts.join(' ');
}

function updateExperienceHeader() {
	const items = document.querySelectorAll('.section .item[data-start]');
	if (!items.length) return;

	let minStart = null;
	let maxEnd = null;

	items.forEach((item) => {
		const startAttr = item.getAttribute('data-start');
		const endAttr = item.getAttribute('data-end') || 'now';

		const start = parseYearMonth(startAttr);
		const end = parseYearMonth(endAttr);

		if (!start || !end) return;

		if (
			!minStart ||
			start.year < minStart.year ||
			(start.year === minStart.year && start.month < minStart.month)
		) {
			minStart = start;
		}

		if (
			!maxEnd ||
			end.year > maxEnd.year ||
			(end.year === maxEnd.year && end.month > maxEnd.month)
		) {
			maxEnd = end;
		}
	});

	if (!minStart || !maxEnd) return;

	const months = diffInMonths(minStart, maxEnd) + 1;
	const text = formatExperience(months);

	const span = document.getElementById('experience-total');
	if (span) {
		span.textContent = ` — ${text}`;
	}
}

function updatePerItemExperience() {
	const items = document.querySelectorAll('.section .item[data-start]');

	items.forEach((item) => {
		const startAttr = item.getAttribute('data-start');
		const endAttr = item.getAttribute('data-end') || 'now';

		const start = parseYearMonth(startAttr);
		const end = parseYearMonth(endAttr);

		if (!start || !end) return;

		const months = diffInMonths(start, end) + 1;
		const text = formatExperience(months);

		const meta = item.querySelector('.item__meta');
		if (!meta) return;

		const existing = meta.querySelector('.item__experience');
		if (existing) {
			existing.textContent = text;
			return;
		}

		const span = document.createElement('span');
		span.className = 'item__experience';
		span.textContent = text;

		meta.appendChild(document.createElement('br'));
		meta.appendChild(span);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	updateExperienceHeader();
	updatePerItemExperience();
});
