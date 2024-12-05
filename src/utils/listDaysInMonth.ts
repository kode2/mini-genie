import {
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	subDays,
	getDay,
	addDays,
} from "date-fns";

interface CalendarDay {
	date: Date;
	label: number;
	isCurrentMonth: boolean;
}

// Get previous weekday (week starting on Monday)
/* function getPreviousWeekdayMondayFirst(date: Date): Date {
	let previousDate = subDays(date, 1);
	while (getDay(previousDate) === 6 || getDay(previousDate) === 0) {
		previousDate = subDays(previousDate, 1);
	}
	return previousDate;
} */

// Generate calendar days
export function generateCalendarDays(
	year: number,
	month: number,
): CalendarDay[] {
	const firstDayOfMonth = startOfMonth(new Date(year, month - 1));
	const lastDayOfMonth = endOfMonth(new Date(year, month - 1));

	// Calculate leading days from the previous month
	const weekday = (getDay(firstDayOfMonth) + 6) % 7; // Adjust for Monday start
	const leadingDays = Array.from({ length: weekday }, (_, i) =>
		subDays(firstDayOfMonth, weekday - i),
	);

	// Get all days in the current month
	const currentMonthDays = eachDayOfInterval({
		start: firstDayOfMonth,
		end: lastDayOfMonth,
	});

	// Calculate trailing days to complete the calendar grid (if needed)
	const totalCells = 42; // 6 rows of 7 days (standard calendar grid)
	const trailingDays = Array.from(
		{ length: totalCells - (leadingDays.length + currentMonthDays.length) },
		(_, i) => addDays(lastDayOfMonth, i + 1),
	);

	// Combine all days and format them
	return [...leadingDays, ...currentMonthDays, ...trailingDays].map((day) => ({
		date: day,
		label: day.getDate(),
		isCurrentMonth: day.getMonth() === month - 1,
	}));
}
