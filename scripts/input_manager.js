const keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyR: false,
    Space: false
};

//Listening specific keydown and keyup events
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)){
        keys[e.code]  = true;
    }
});

window.addEventListener('keyup', (e) => {
    if(keys.hasOwnProperty(e.code)){
        keys[e.code] = false;
    }
});