export function pressAndHold(item){

    let timerID;
    let counter = 0;

    // Increase or decreae value to adjust how long
    // one should keep pressing down before the pressHold
    // event fires
    let pressHoldDuration = 20;
    let maxPress = 50
    // Listening for the mouse and touch events    
    item.addEventListener("mousedown", pressingDown, false);
    item.addEventListener("mouseup", notPressingDown, false);
    item.addEventListener("mouseleave", notPressingDown, false);

    item.addEventListener("touchstart", pressingDown, false);
    item.addEventListener("touchend", notPressingDown, false);

    // Listening for our custom pressHold event
    item.addEventListener("pressHold", doSomething, false);

    function pressingDown(e) {
    // Start the timer
    requestAnimationFrame(timer);
    e.preventDefault();

    item.dispatchEvent(new CustomEvent('start'))
    }

    function notPressingDown(e) {
    // Stop the timer
    cancelAnimationFrame(timerID);
    counter = 0;

    item.style.setProperty("--scale-value", 1);

    item.dispatchEvent(new CustomEvent('stop'))
    }

    //
    // Runs at 60fps when you are pressing down
    //
    function timer() {
    if (counter < pressHoldDuration) {
        timerID = requestAnimationFrame(timer);
        counter++;

        item.style.setProperty("--scale-value", 1 + counter / maxPress);
        }
    }

    function doSomething(e) {
    console.log("pressHold event fired!");
    }

    item.style.setProperty("--scale-value", 1 + counter / maxPress);
}