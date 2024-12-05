import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";

import {
	format as formatDate,
	addMonths,
	subMonths,
	isSameDay,
} from "date-fns";
import { generateCalendarDays } from "../utils/listDaysInMonth";
import { useState } from "react";
import {
	DndContext,
	type DragEndEvent,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";

interface DraggableItem {
	id: string;
	name: string;
	color: string;
}

interface Assignment {
	[key: string]: { name: string; color: string } | undefined;
}

function Draggable({
	id,
	name,
	color,
}: { id: string; name: string; color?: string }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const individualColor = color || "lightgreen";
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				backgroundColor: individualColor,
				border: "1px solid #333",
		  }
		: { backgroundColor: individualColor };

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className="people"
			style={style}
		>
			{name}
		</div>
	);
}

function Droppable({
	id,
	children,
}: { id: string; children: React.ReactNode }) {
	const { isOver, setNodeRef } = useDroppable({
		id,
	});
	const style = {
		backgroundColor: isOver ? "cornsilk" : undefined,
	};

	return (
		<div ref={setNodeRef} style={style}>
			{children}
		</div>
	);
}

export default function Calendar() {
	const [currentDate, setCurrentDate] = useState(new Date());
	// const [assignments, setAssignments] = useState<Record<string, string>>({});
	const [assignments, setAssignments] = useState<Assignment>({});

	const draggableItems: DraggableItem[] = [
		{ id: "gløer", name: "Gløer", color: "lightblue" },
		{ id: "erik", name: "Erik", color: "lightcoral" },
		{ id: "elias", name: "Elias", color: "lemonchiffon" },
	];

	const goToPreviousMonth = () => {
		setCurrentDate((prevDate) => subMonths(prevDate, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate((prevDate) => addMonths(prevDate, 1));
	};

	const days = generateCalendarDays(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over) {
			const draggedItem = draggableItems.find((item) => item.id === active.id);
			if (draggedItem) {
				setAssignments((prev) => ({
					...prev,
					[over.id]: { name: draggedItem.name, color: draggedItem.color },
				}));
			}
		}
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className="calendar-and-people">
				<section className="people-section">
					<Draggable id="gløer" name="Gløer" color="lightblue" />
					<Draggable id="erik" name="Erik" color="lightcoral" />
					<Draggable id="elias" name="Elias" color="lemonchiffon" />
				</section>
				<section>
					<header className="grid-calendar-header">
						<button type="button" onClick={goToPreviousMonth}>
							<MdArrowBackIosNew />
						</button>
						<span className="spanToday">
							{formatDate(currentDate, "MMMM")} {currentDate.getFullYear()}
						</span>
						<button type="button" onClick={goToNextMonth}>
							<MdArrowForwardIos />
						</button>
						<button
							className="btnToday"
							type="button"
							onClick={() => setCurrentDate(new Date())}
						>
							Today
						</button>
					</header>
					<div className="calendar-grid">
						<div className="calendar-day-label">Mon</div>
						<div className="calendar-day-label">Tue</div>
						<div className="calendar-day-label">Wed</div>
						<div className="calendar-day-label">Thu</div>
						<div className="calendar-day-label">Fri</div>
						<div className="calendar-day-label">Sat</div>
						<div className="calendar-day-label">Sun</div>
						{days.map((day) => (
							<Droppable id={String(day.date)} key={String(day.date)}>
								<div
									className={`${
										day.date.getMonth() !== currentDate.getMonth()
											? "disabled"
											: isSameDay(day.date, new Date())
											  ? "today"
											  : ""
									} calendar-grid-item`}
								>
									<span>{formatDate(day.date, "d")}</span>
									{assignments[String(day.date)] && (
										<div
											className="assignment"
											style={{
												backgroundColor: assignments[String(day.date)]?.color,
											}}
										>
											<span>{assignments[String(day.date)]?.name}</span>
											<button
												type="button"
												onClick={() => {
													setAssignments((prev) => {
														const newAssignments = { ...prev };
														delete newAssignments[String(day.date)];
														return newAssignments;
													});
													console.log(assignments);
												}}
											>
												x
											</button>
										</div>
									)}
								</div>
							</Droppable>
						))}
					</div>
				</section>
			</div>
			<div>{JSON.stringify(assignments)}</div>
		</DndContext>
	);
}
