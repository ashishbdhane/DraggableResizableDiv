// DraggableResizableDiv.js
import React, {useRef, useEffect, useState} from 'react';
import interact from 'interactjs';

const DraggableResizableDiv = ({
	id,
	defaultPosition,
	defaultSize,
	color,
	title,
}) => {
	const divRef = useRef(null);
	const [position, setPosition] = useState(() => {
		const savedPosition = JSON.parse(
			localStorage.getItem(`div_${id}_position`)
		);
		return savedPosition || defaultPosition;
	});

	const [size, setSize] = useState(() => {
		const savedSize = JSON.parse(localStorage.getItem(`div_${id}_size`));
		return savedSize || defaultSize;
	});

	useEffect(() => {
		const element = divRef.current;

		interact(element)
			.draggable({
				onmove: (event) => {
					const target = event.target;
					const x = position.x + event.dx;
					const y = position.y + event.dy;

					const screenWidth = window.innerWidth;
					const screenHeight = window.innerHeight;
					const divWidth = size.width;
					const divHeight = size.height;

					const maxX = screenWidth - divWidth;
					const maxY = screenHeight - divHeight;

					const newX = Math.max(0, Math.min(maxX, x));
					const newY = Math.max(0, Math.min(maxY, y));

					target.style.transform = `translate(${newX}px, ${newY}px)`;
					target.setAttribute('data-x', newX);
					target.setAttribute('data-y', newY);
					setPosition({x: newX, y: newY});
				},
			})
			.resizable({
				edges: {left: true, right: true, top: true, bottom: false},
				modifiers: [
					interact.modifiers.restrictEdges({
						outer: 'parent',
					}),
					interact.modifiers.restrictSize({
						min: {width: 50, height: 50},
					}),
				],
			})
			.on('resizemove', (event) => {
				const target = event.target;
				const rect = event.rect;

				const dx = event.deltaRect.left;
				const dy = event.deltaRect.top;
				// console.log(dx, dy);

				const newWidth = rect.width + dx;
				const newHeight = rect.height + dy;
                // console.log(rect);

				const screenWidth = window.innerWidth;
				const screenHeight = window.innerHeight;

				if (rect.left < 0) {
					rect.left = 0;
					rect.right = newWidth;
				}
				if (rect.top < 0) {
					rect.top = 0;
					rect.bottom = newHeight;
				}
				if (rect.right > screenWidth) {
					rect.right = screenWidth;
					rect.left = screenWidth - newWidth;
				}
				if (rect.bottom > screenHeight) {
					rect.bottom = screenHeight;
					rect.top = screenHeight - newHeight;
				}

				const newX = position.x + dx;
				const newY = position.y + dy;
                
				target.style.transform = `translate(${newX}px, ${newY}px)`;
				target.setAttribute('data-x', newX);
				target.setAttribute('data-y', newY);
            
				// target.style.width = newWidth + 'px';
				// target.style.height = newHeight + 'px';
				// target.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
				setPosition({x: newX,y: newY});
				setSize({width: newWidth, height: newHeight});
			});
	}, [position, size, id, defaultPosition, defaultSize]);

	useEffect(() => {
		localStorage.setItem(`div_${id}_position`, JSON.stringify(position));
		localStorage.setItem(`div_${id}_size`, JSON.stringify(size));
	}, [position, size, id]);

	return (
		<div
			ref={divRef}
			style={{
				width: size.width + 'px',
				height: size.height + 'px',
				background: color,
				color: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor: 'move',
				resize: 'both',
				overflow: 'auto',
				transform: `translate(${position.x}px, ${position.y}px)`,
				position: 'absolute',
                borderRadius: '10px',
			}}
		>
			{title}
		</div>
	);
};

export default DraggableResizableDiv;
