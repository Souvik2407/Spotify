console.log("Let's run the javascript");
let currentSong= new Audio();
let songs;
let currfolder;
function formatSeconds(seconds) {

    if (isNaN(seconds) || seconds<0){
        return "00:00";
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder) {
    currfolder=folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
   }

   
   let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songul.innerHTML= ""
for(const song of songs){
    songul.innerHTML = songul.innerHTML + ` <li>
                   <img class="invert" src="music.svg">
                   <div class="info">
                    <div>${song.replaceAll("%20"," ")}</div>
                    <div>Souvik</div>
                   </div>
                   <div class="playnow">
                    <span>play now</span>
                   <img class="invert" src="play.svg">
                </div>
                </li>`;
}

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    
    e.addEventListener("click", element=>{
    
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})

}
// Get the list of all the songs
const playMusic = (track, pause=false)=>{
    currentSong.src=`/${currfolder}/`+ track
    if(!pause){
        currentSong.play()
        play.src="pause.svg"

    }
            document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"




        
}



async function main() {
    await getsongs("songs/cs");
  playMusic(songs[0],true)









//add event listner to seekbar

}











 











async function displayalbums() {
    let a = await fetch(`/songs/`);
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName("a")
let cardContainer= document.querySelector(".card-container")

let array=Array.from(anchors)
for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
    if(e.href.includes("/songs/")){
        let folder= (e.href.split("/").slice(-2)[0])
        let a = await fetch(`/songs/${folder}/info.json`)
        let response = await a.json();
      
        console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}"  class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none">
                   
                    <circle cx="12" cy="12" r="10" fill="#00FF00" /> <!-- Green circle background -->
                
                    <!-- Play button path -->
                    <path d="M10 8.64v6.72L16.27 12 10 8.64z" fill="#000000" /> <!-- Black play button -->
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg">
            <h2>
               ${response.title_bar}
            </h2>
            <p>
                ${response.description}
            </p>
        </div>`
    }
}



//oad the card is clicked :- 

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
    console.log(item.currentTarget, item.currentTarget.dataset.folder)
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    })
})



//add event listner to mute the track

document.querySelector(".volume>img").addEventListener("click", e=>{
    console.log(e.target)
    console.log("changing", e.target.src)
    if(e.target.src.includes("volume.svg"))
    {
    e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

    }    
else{
    e.target.src  = e.target.src.replace("mute.svg", "volume.svg")
    currentSong.volume = .10;
}

})



//add onchange to volume :- 

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e=>{
    currentSong.volume = parseInt(e.target.value)/100
}))








//addeventlistner to next
next.addEventListener("click", ()=>{
    currentSong.pause()
 
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)< songs.length ){
        playMusic(songs[index+1])
    }
})



//addeventlistner to previous
previous.addEventListener("click", ()=>{
    currentSong.pause()
  
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
        playMusic(songs[index-1])
    }
})

//attch an event to the music :- 
play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "pause.svg"
    }
    else{
        currentSong.pause()
        play.src = "play.svg"

    }
})



document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent+ "%";
    currentSong.currentTime = ((currentSong.duration)*percent)/100
})



//addeventlistner for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left= "0"
})

//addeventlistner for close button
document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left= "-120%"
})



//listen for timeupdate event
currentSong.addEventListener("timeupdate", ()=>{
   
    document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)* 100 + "%";

})

}


//Display all albums on the page :- 

displayalbums()










main();


