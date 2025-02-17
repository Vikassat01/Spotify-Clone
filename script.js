console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

//second to minute 
function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";

    }
    // Calculate minutes
    const minutes = Math.floor(seconds / 60);

    // Calculate remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }

    }

     //show all the songs in the playlist
     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
     for (const song of songs) {
         songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" width="34" src="music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>Vikas</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="play.svg" alt="">
                             </div> </li>`;
     }
 
     // Attached the current song to each listiner 
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
         e.addEventListener("click", element => {
             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
 
     })

    
}

const playMusic = (track, pause = false) => {

    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    
}

async function main() {

    //get the list ofall the song
    await getSongs("songs/ncs")
    playMusic(songs[0], true)
   

    //Attached an event listinor to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen fo time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)} / :${secondsToMinuteSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //add an event lisinor to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add event listioner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add event listioner for close buttons
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listner previous and next
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index-1) >= 0) {
            playMusic(songs[index-1])   
        }
    })

    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length) {
            playMusic(songs[index+1])   
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    //Load the library when play the song
    Array.form(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })





}

main()
