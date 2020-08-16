export class TimeLine {
    constructor() {
        this.animations = [];
        this.startTime = null;
        this.pauseTime = null;
        this.state = 'inited';
    }

    tick(){
        let t = Date.now() - this.startTime;
        let liveAnimations = this.animations.filter(anim => !anim.finished)
        for (let animation of this.animations) {
            let {object, template, property, duration, start, end, delay, timingFunction, startTime} = animation;
            if (t < delay + startTime) {
                continue;
            }
            
            let progression = timingFunction((t - delay - startTime) / duration);
            if (t > duration + delay + startTime) {
                progression = 1;
                animation.finished = true;
            }
            let value = animation.valueFromProgression(progression);
            console.log(value);
            object[property] = template(value);
        }
        if (liveAnimations.length > 0) {
            this.tickId = requestAnimationFrame(() => this.tick());
        }
    }
    start(){
        if (this.state !== 'inited') {
            return;
        }
        this.state = 'playing';
        this.startTime = Date.now();
        this.tick();
    }
    pause() {
        if (this.state !== 'playing') {
            return;
        }
        this.state = 'paused';
        this.pauseTime = Date.now();
        cancelAnimationFrame(this.tickId)
    }

    resume() {
        if (this.state !== 'paused') {
            return;
        }
        this.state = 'paused';
        this.startTime += Date.now() - this.pauseTime;
        this.tick();
    }

    restart() {
        if (this.state === 'playing') {
            this.pause();
        }
        this.animations.forEach(anim => anim.finished = false);
        this.state = 'inited';
        this.start();
    }

    add(animation, startTime) {       
        this.animations.push(animation);
        if (this.state === 'playing') {
            animation.startTime = startTime === void 0 ? Date.now() - this.startTime : startTime;
        } else {
            animation.startTime = startTime === void 0 ? 0 : startTime;
        }
    }
}

export class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template;
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }
}

export class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        const rgba = ['r', 'g', 'b', 'a'];
        const retRGBA = {};
        for (let value of rgba) {
            retRGBA[value] = this.start[value] + progression * (this.end[value] - this.start[value]);
        }
        return retRGBA;
    }
}