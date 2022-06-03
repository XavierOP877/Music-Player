const menuIcon = document.querySelector(".iconLeft");
const lyricsCont = document.querySelector(".lyrics-page");
const playListIcon = document.querySelector(".iconRight");
const playListCont = document.querySelector(".favorite-page");
const backSpaceBtn = document.querySelector(".backspaceBtn");
const playBtn = document.querySelector(".playBtn");
const playControls = document.querySelector(".play-controls");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const progressBar = document.querySelector(".progress-bar");    
const progressArea = document.querySelector(".progress-area");
const shuffleBtn = document.querySelector("#shuffle-btn");
const repeatBtn = document.querySelector("#repeat-btn");
const songsCont = document.querySelector(".songs");
const LyricsSongName = document.querySelector("#lyrics-song-name");
const LyricsArtistName = document.querySelector("#lyrics-artist-name");
const lyricsText = document.querySelector("#lyrics-text");
const circularDotTip = document.querySelector(".circle-dot-tip");
// const favHeartIcon = 

// get song details dom elements
const mainPageImg = document.querySelector(".main-showcase-img");
const mainPagesongName = document.querySelector(".song-name");
const mainPagesongArtist = document.querySelector(".song-artist");
const mainAudio = document.querySelector("#main-audio");

let musicInd = 0;

var isPlaylistActive = false;
var isLyricsPageActive = false;
var isShuffleOn = false;
var isRepeatOn = false;

menuIcon.addEventListener("click", function(){
    toggleBtn(isLyricsPageActive, lyricsCont);
});


playListIcon.addEventListener("click", function(){
    toggleBtn(isPlaylistActive, playListCont);
});

backSpaceBtn.addEventListener("click", function(){
    playListCont.classList.remove("active");
    isPlaylistActive = !isPlaylistActive;
});


// Execute function after the page is loaded
window.addEventListener("load", function(){
    loadAudioMusic(musicInd);
    playingNowHandle();
});

function loadAudioMusic(musicInd){
    console.log(musicInd)
    mainPagesongName.innerText = musicListArr[musicInd].name;
    mainPagesongArtist.innerText = musicListArr[musicInd].artist;   
    mainPageImg.src = `./imgs/${musicListArr[musicInd].img}`;
    mainAudio.src = `audios/${musicListArr[musicInd].src}.mp3`;

    // set song name and its artist on lyrics page
    LyricsSongName.innerText = musicListArr[musicInd].name;
    LyricsArtistName.innerText = musicListArr[musicInd].artist; 
    lyricsText.innerText = musicListArr[musicInd].lyrics;
}

function playMusic(){
    playControls.classList.add("paused");
    playBtn.innerText = "pause";
    mainAudio.play();
}

function pausedMusic(){
    playControls.classList.remove("paused");
    playBtn.innerText = "play_arrow";
    mainAudio.pause();
}

playBtn.addEventListener("click", function(){
    const isMusicPaused = playControls.classList.contains("paused"); // initially it will contain false value
    // console.log(isMusicPaused)
    isMusicPaused ? pausedMusic() : playMusic();
});

// navigate to next song on btn click
nextBtn.addEventListener("click", nextSong );

function nextSong(){
    musicInd++;
    // handle value of musicInd index going out of bound
    musicInd > musicListArr.length - 1 ? musicInd = 0 : musicInd = musicInd; 
    loadAudioMusic(musicInd);
    playingNowHandle();
    playMusic();
}
// navigate to previous song on btn click
prevBtn.addEventListener("click", prevSong );

function prevSong(){
    musicInd--;
    // handle value of musicInd index going out of bound
    musicInd < 0 ? musicInd = musicListArr.length - 1 : musicInd = musicInd; 
    loadAudioMusic(musicInd);
    playingNowHandle();
    playMusic();
}

function toggleBtn(isActiveVal, elementCont){
    // console.log(isActiveVal)
    
    if(elementCont == lyricsCont){
        if(!isActiveVal){
            elementCont.classList.add("active");
        }else{
            elementCont.classList.remove("active");
        }
       isLyricsPageActive = !isLyricsPageActive;
    }else if(elementCont == playListCont){
        if(!isActiveVal){
            elementCont.classList.add("active");
        }else{
            elementCont.classList.remove("active");
        }
       isPlaylistActive = !isPlaylistActive;
    }
   
}


// making progress bar work
mainAudio.addEventListener("timeupdate", function(e){
    let musicCurrTime = progressArea.querySelector(".curr-time");
    let musicTotalDuration = progressArea.querySelector(".duration-time");
    const currTime = e.target.currentTime;  // getting the current timestamp of song
    const duration = e.target.duration;     // getting total duration of song
    let progressBarWidth = (currTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;
    // circularDotTip.style.left = `${progressBarWidth / 2}%`;

    mainAudio.addEventListener("loadeddata", function(){
        // handle ending timestamp of time
        let audioDuration = mainAudio.duration;
        let totalMins = Math.floor(audioDuration / 60);
        let totalSecs = Math.floor(audioDuration % 60);
        if(totalSecs < 10){
            totalSecs = `0${totalSecs}`;
        }
        musicTotalDuration.innerText = `${totalMins}:${totalSecs}`;    
    });

    // handle starting timestamp of time
    let currMins = Math.floor(currTime / 60);
    let currSecs = Math.floor(currTime % 60);
    if(currSecs < 10){
        currSecs = `0${currSecs}`;
    }
    musicCurrTime.innerText = `${currMins}:${currSecs}`;
});


// handle progress bar voluntory sliding by user
progressArea.addEventListener("click", function(event){
    // get the width of progressArea 
    let progressBarWidth = progressArea.clientWidth;
    // getting x position where user clicked
    let clickedOffsetX = event.offsetX; 
    let songDuration = mainAudio.duration;

    // console.log(clickedOffsetX, progressBarWidth)
    mainAudio.currentTime = (clickedOffsetX / progressBarWidth) * songDuration;

    // finally after setting the current timestamp of main audio by user its time to let the music play from ther
    playMusic();
});

// Repeat and shuffle functionality
repeatBtn.addEventListener("click", function(){
    if(!isRepeatOn && !isShuffleOn){ // only one btn can be pressed at a time
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("music-state", "song repeat one");
    }else{
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("music-state", "song repeat none");
    }
    isRepeatOn = !isRepeatOn;
});


shuffleBtn.addEventListener("click", function(){
    if(!isShuffleOn && !isRepeatOn){ // only one btn can be pressed at a time
        shuffleBtn.innerText = "shuffle_on";
        shuffleBtn.setAttribute("music-state", "song shuffle on");
    }else{
        shuffleBtn.innerText = "shuffle";
        shuffleBtn.setAttribute("music-state", "song shuffle off");
    }
    isShuffleOn = !isShuffleOn;
});


// work on shuffle or repeat_one btn only when the song is ended
mainAudio.addEventListener("ended", function(){
    // console.log(isShuffleOn, isRepeatOn)
    if(isRepeatOn){ // if repeat one is on
        mainAudio.currentTime = 0;
        loadAudioMusic(musicInd);
        playMusic();
    }else if(isShuffleOn){
        let randInd = Math.floor(Math.random() * musicListArr.length);
        do{
            randInd = Math.floor(Math.random() * musicListArr.length);
        }while(musicInd == randInd);
        musicInd = randInd;
        loadAudioMusic(musicInd);
        playMusic();
    }
    nextSong();
});

// add songs to favorite song playlist page
for(let i = 0; i < musicListArr.length; i++){
    let imgName = musicListArr[i].img;
    let songName = musicListArr[i].name;
    let songArtist = musicListArr[i].artist;

    let singSongDiv = `
    <div class="song" song-ind = ${i}>
        <div class="leftBx">
            <div class="imgBx">
                <img src="./imgs/${imgName}" alt="">
            </div>
            <div class="song-detail">
                <p class="name">${songName}</p>
                <p class="artist">${songArtist}</p>
            </div>
        </div>
        <div class="rightBx">
            <div class="heartBx">
                <span class="material-symbols-outlined fav-heart">
                    favorite
                </span>
            </div>
        </div>
    </div>
    `;
    songsCont.insertAdjacentHTML("beforeend", singSongDiv);
}

// show the current song as playing on fovorite song list
let allSongDiv = songsCont.querySelectorAll(".song");
function playingNowHandle(){
    for(let j = 0; j < allSongDiv.length; j++){
        // rmove the now-playing classes on song before
        if(allSongDiv[j].classList.contains("now-playing")){
            allSongDiv[j].classList.remove("now-playing");
        }

        // if current song playing index matches with any of song within fovoriteList song
        if(allSongDiv[j].getAttribute("song-ind") == musicInd){
            allSongDiv[j].classList.add("now-playing");
        }

        // add evenlistener to each of songs in favorite list
        allSongDiv[j].setAttribute("onclick", "songClicked(this)");
    }
}

let AllheartDiv = songsCont.querySelectorAll(".fav-heart");
console.log(AllheartDiv)
for(let i = 0; i < AllheartDiv.length; i++){
    AllheartDiv[i].setAttribute("onclick", "heartClicked(this)");
}

function heartClicked(element){
    console.log(element)
    element.classList.toggle("heart-clicked");
    // element.style.color = "red";
}

function songClicked(songELe){
    // get the index of the song being clicked
    let ind = songELe.getAttribute("song-ind");
    musicInd = ind;
    loadAudioMusic(musicInd);
    playMusic();
    playingNowHandle();
}