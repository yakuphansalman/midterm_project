const keys = {
    W: false,
    A: false,
    S: false,
    D: false,
    Space: false
};

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