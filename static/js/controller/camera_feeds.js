const modal = document.getElementById("modal");
const zoomVideo = document.getElementById("zoomVideo");
const close = document.getElementById("close");

if (modal && zoomVideo && close) {

    document.querySelectorAll(".video-container").forEach(container => {

        container.addEventListener("click", () => {

            const video = container.querySelector("video");

            zoomVideo.src = video.currentSrc;

            modal.style.display = "flex";

            zoomVideo.play();

        });

    });

    close.onclick = () => {
        modal.style.display = "none";
        zoomVideo.pause();
    };

}