function switchPage(event, url, direction) {
    event.preventDefault();

    const page = document.getElementById("page");

    if (direction === "left") {
        page.classList.add("slide-left");
    } else if(direction ==="right") {
        page.classList.add("slide-right");
    } 
    

    setTimeout(() => {
        window.location.href = url;
    }, 400);
}
