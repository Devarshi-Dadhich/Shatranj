document.addEventListener("DOMContentLoaded", () => {
    
// const scrollEL = document.querySelector('[data-scroll-container]');

// const scroll = new LocomotiveScroll({
//     el: scrollEL,
//     smooth: true,
//     lerp: 0.08,
// });

//   window.addEventListener('load', () => scroll.update());
//   window.addEventListener('resize', () => scroll.update());

const playbtn = document.getElementById("playbtn");
    playbtn.addEventListener("click", () => {
        socket.emit("playerReady");
});
});

