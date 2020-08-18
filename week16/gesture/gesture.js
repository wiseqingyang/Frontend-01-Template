

function describeTouches(element) {
    const contexts = Object.create(null);
    const MOUSE_SYMBOL = Symbol('mouse');

    element.addEventListener('mousedown', event => {

        contexts[MOUSE_SYMBOL] = Object.create(null);
        start(event, contexts[MOUSE_SYMBOL]);
        const mouseMove = event => {
            move(event, contexts[MOUSE_SYMBOL]);
        }
        const mouseEnd = event => {
            end(event, contexts[MOUSE_SYMBOL]);
            element.removeEventListener('mousemove', mouseMove);
            element.removeEventListener('mouseup', mouseEnd);
        }
        element.addEventListener('mousemove', mouseMove);
        element.addEventListener('mouseup', mouseEnd);
    })

    element.addEventListener('touchstart', event => {
        for (let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    })

    element.addEventListener('touchmove', event => {
        for (let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    })

    element.addEventListener('touchend', event => {
        for (let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    element.addEventListener('touchcancel', event => {
        for (let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    // tap pan press
    const start = (point, context) => {
        element.dispatchEvent(Object.assign(new Event('start'), {
            clientX: point.clientX, 
            clientY: point.clientY, 
            startX: point.startX,
            startY: point.startY,
        }));
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.timoutHandle = setTimeout(() => {
            if (context.isTap) {
                context.isTap = false;
                context.isPan = false;
                context.isPress = true;
                element.dispatchEvent(new Event('pressstart'));
            }
        }, 500);
    }

    const move = (point, context) => {
        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;
        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            // console.log('panStart');
        }
        if (context.isPan) {
            context.moves = context.moves || [];
            context.moves.push({ 
                x: point.clientX, y: point.clientY, t: Date.now()
            })
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
        }

        element.dispatchEvent(Object.assign(new Event('move'), {
            clientX: point.clientX, 
            clientY: point.clientY, 
            startX: context.startX,
            startY: context.startY,
        }));
    }

    const end = (point, context) => {
        if (context.isPan) {
            const distanceX = context.moves[0].x - point.clientX;
            const distanceY = context.moves[0].y - point.clientY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const speed = distance/(Date.now() - context.moves[0].t);
            if (speed > 2.7) {
                // console.log('flick');
            }
            element.dispatchEvent(Object.assign(new Event('panend'), {
                clientX: point.clientX, 
                clientY: point.clientY, 
                startX: context.startX,
                startY: context.startY,
            }));
        }
        if (context.isPress) 
            console.log('press');
        if (context.isTap)
            console.log('tap');
        clearTimeout(context.timoutHandle);
    }

    const cancel = (point, context) => {
        clearTimeout(context.timoutHandle);
    }
}
