import { create } from './createElement.js';

class Carousel {
    constructor(config) {
        this.config = config;
        this.root = document.createElement('div');
        this.children = [];
    }
    setAttribute(name, value) {
        this[name] = value;
    }

    render() {

        let children = this.data.map(url => {
            let ele = <img src={url} />;
            ele.addEventListener('dragstart', e => e.preventDefault());
            return ele;
        });
        

        let position = 0;
        let move = () => {
            let current = children[position];

            let nextPos = (position + 1) % this.data.length;

            let next = children[nextPos];

            next.style.transition = 'ease 0s';
            current.style.transition = 'ease 0s';
            current.style.transform = `translateX(${- 100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPos}%)`

            setTimeout(() => {
                next.style.transition = 'transform 0.5s';
                current.style.transition = 'transform 0.5s';
                current.style.transform = `translateX(${-100 - 100 * position}%)`;
                next.style.transform = `translateX(${- 100 * nextPos}%)`
                position = nextPos;
            }, 16);

            setTimeout(move, 3000);
        }

        setTimeout(move, 3000);
        return (
            <div class="carousel">
                {children}
            </div>
        )
    }

    mountTo(node) {
        this.render().mountTo(node);
    }
}

var data = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];

var component = <Carousel data={data}></Carousel>

component.mountTo(document.body);
