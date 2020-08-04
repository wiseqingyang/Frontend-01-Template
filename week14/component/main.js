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

    handlerMove() {
        
    }

    render() {
        let children = this.data.map(url => {
            let ele = <img src={url} />;
            ele.addEventListener('dragstart', e => e.preventDefault());
            return ele;
        });

        let root = <div class="carousel">
                    {children}
                </div>
        

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
        // setTimeout(move, 3000);

        root.addEventListener('mousedown', event => {
            console.log(event)
            let originX = event.clientX;

            let lastPosition = (position + 1) % this.data.length;
            let nextPosition = (position - 1 + this.data.length) % this.data.length;
            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];

            last.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';
            current.style.transition = 'ease 0s';

            last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
            current.style.transform = `translateX(${- 500 * position}px)`;
            next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

            const move = (event) => {
                let newX = event.clientX;
                let offsetX = newX - originX;
                
                last.style.transform = `translateX(${offsetX - 500 - 500 * lastPosition}px)`;
                current.style.transform = `translateX(${offsetX - 500 * position}px)`;
                next.style.transform = `translateX(${500 + offsetX - 500 * nextPosition}px)`;
            }
            const up = e => {
                let offset = 0;
                if (e.clientX - originX > 100) {
                    offset = 1;
                } else if (e.clientX - originX < -100) {
                    offset = -1
                }
                
                let transfrom = `transform ${0.5 * (500 - Math.abs(e.clientX - originX)) / 500}s`
                last.style.transition = transfrom;
                next.style.transition = transfrom;
                current.style.transition = transfrom;

                last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
                current.style.transform = `translateX(${offset* 500 - 500 * position}px)`;
                next.style.transform = `translateX(${500 + offset * 500 - 500 * nextPosition}px)`;

                position = (position + offset + this.data.length) % this.data.length;
                

                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        })
        return (
            root
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
