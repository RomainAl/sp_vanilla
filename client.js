if (location.protocol !== "https:") {
  alert("Go https !");
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

const socket = io.connect("https://mywebrtcserver-thrumming-resonance-5604.fly.dev/");
// const socket = io.connect("https://192.168.10.2:1337");
console.log("flyio ok");
// const instru_div = document.getElementById("sp_instru");
// let instru = {};
const userCanvas = document.getElementById("canvas");
userCanvas.width = Math.max(window.innerWidth, window.innerHeight) * 2;
userCanvas.height = Math.min(window.innerWidth, window.innerHeight) * 2;
const adminVideo = document.getElementById("video");
// let adminVimeo = document.getElementById("vimeo");
adminVideo.style.display = "none";
const adminVideo_webrtc = document.getElementById("video_webrtc");
adminVideo_webrtc.style.display = "none";
const audio_nico = document.getElementById("audio_nico");
audio_nico.src = `./audio4Client/LXR-1.wav`;
// audio_nico.src = `./audio4Client/LXR-.wav`;
audio_nico.muted = false;
// let vimeo = new Vimeo.Player('vimeo');
const effectsPan = document.getElementById("effects-params");
effectsPan.style.display = "none";
const gainPan = document.getElementById("gain-param");
gainPan.style.display = "none";
const BtnsPan = document.getElementById("Btns");
const overlay = document.getElementById("overlay");
const overlayTHEEND = document.getElementById("overlayTHEEND");
const overlayWAIT = document.getElementById("overlayWAIT");
const myGUI = document.getElementById("GUI");
const atablee = document.getElementById("atablee");
const sp_insta = document.getElementById("sp_insta");
const sp_sensors = document.getElementById("sp_sensors");
const btn_fullscreen = document.getElementById("btn_fullscreen");
let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
if (fullscreenElement === undefined) btn_fullscreen.style.display = "none";
const btn_gain = document.getElementById("btn_gain");
const btn_rec = document.getElementById("btn_rec");
btn_rec.style.background = "transparent";
btn_rec.onclick = recfunction;
const rec = document.getElementById("rec");
const mystop = document.getElementById("stop");
const trash = document.getElementById("trash");
const btn_effects = document.getElementById("btn_effects");
btn_fullscreen.onclick = changeFullScreen;
btn_effects.style.borderColor = "#5c5c5c";
btn_rec.style.borderColor = "#5c5c5c";
btn_effects.onclick = (ev) => {
  if (effectsPan.style.display == "flex") {
    effectsPan.style.display = "none";
    btn_effects.style.background = "transparent";
  } else {
    effectsPan.style.display = "flex";
    btn_effects.style.backgroundColor = "#5c5c5c";
    gainPan.style.display = "none";
    btn_gain.style.background = "transparent";
  }
};
btn_gain.onclick = (ev) => {
  if (gainPan.style.display == "flex") {
    gainPan.style.display = "none";
    btn_gain.style.background = "transparent";
  } else {
    effectsPan.style.display = "none";
    btn_effects.style.background = "transparent";
    gainPan.style.display = "flex";
    btn_gain.style.backgroundColor = "#5c5c5c";
  }
};
const startButton = document.getElementById("startButton");
startButton.onclick = () => init();
overlay.ondblclick = () => {
  goBackHome();
  location.reload();
};

BtnsPan.ondblclick = adminID;
document.body.ondblclick = adminID;
adminVideo.ondblclick = adminID;
adminVideo_webrtc.ondblclick = adminID;
// userCanvas.ondblclick = adminID;
function adminID(e) {
  changeFullScreen();
  console.log(rtcPeerConnection.signalingState);
  if (sendChannel && sendChannel.readyState === "open") {
    sendChannel.send(JSON.stringify({ clientId: myID }));
  }
}
// let btn_test = document.getElementById("btn_test");
// let testBool = true;
// btn_test.onclick = testBtn;

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
let streamVisualizer4Clients;
let myID;
let roomName = "!?ATtablee007!?";
let rtcPeerConnection;
let receiveChannel;
let sendChannel;
let userStream = null;
let userCanvasStream = userCanvas.captureStream(0); // BECAUSE ON SAFARI, NEED TO HAVE VIDEO STREAM TO RECEIVE A VIDEO STREAM !
let wakeLock = null;
let noSleep = new NoSleep();
let AudioContext = window.AudioContext || window.webkitAudioContext;
let context;
let analyser;
let source;
let source_mic = null;
let gain;
let myPeer;
let audio_nico_source;
let timer_rec;
let timer_nico;
let timer_sensors;
let gain_nico;
let isDraggingSlider = false;

let effects_loaded = false;

const filter = {
  name: "filter",
  title: "FILTER",
  device: null,
  div: null,
  activ: true,
  visible: false,
  gain: null,
  userParams: [
    {
      name: "FREQ",
      title: "FREQ",
      defaultValue: null,
      param: null,
      visible: false,
      type: "real",
    },
    {
      name: "Q",
      title: "Q",
      defaultValue: null,
      param: null,
      visible: false,
      type: "real",
    },
  ],
};

const effects = [
  // {
  //   name: "nico01",
  //   title: "nico01",
  //   device: {},
  //   div: {},
  //   activ: true,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //   {
  //     name: "CLEAR",
  //     title: "CLEAR",
  //     defaultValue: null,
  //     param: {},
  //     visible: true,
  //     type: "real"
  //   },
  //   {
  //     name: "START",
  //     title: "START",
  //     defaultValue: null,
  //     param: {},
  //     visible: true,
  //     type: "real"
  //   }
  //   ],
  // },
  // {
  //   name: "delay",
  //   title: "ECHOS",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //   {
  //     name: "input",
  //     title: "IN",
  //     defaultValue: 1.0,
  //     param: null,
  //     visible: false,
  //     type: "bool"
  //   },
  //   {
  //     name: "time",
  //     title: "TIME",
  //     defaultValue: 30.0,
  //     param: null,
  //     visible: true,
  //     type: "real"
  //   }
  //   ],
  // },
  // {
  //   name: "disto",
  //   title: "DISTORSION",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //     {
  //       name: "drive",
  //       title: "DISTO",
  //       defaultValue: 20.0,
  //       param: null,
  //       visible: true,
  //       type: "real"
  //     },{
  //       name: "mix",
  //       title: "MIX",
  //       defaultValue: 100.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },{
  //       name: "midfreq",
  //       title: "MIDFREQ",
  //       defaultValue: 0.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },{
  //       name: "treble",
  //       title: "TREBLE",
  //       defaultValue: 50.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },{
  //       name: "mid",
  //       title: "MID",
  //       defaultValue: 100.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },{
  //       name: "bass",
  //       title: "BASS",
  //       defaultValue: 50.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },
  // ],
  // },
  // {
  //   name: "downsample",
  //   title: "DEGRADATION",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //     {
  //       name: "down-sample",
  //       title: "DOWN-SAMPLE",
  //       defaultValue: 10,
  //       param: null,
  //       visible: true,
  //       type: "real",
  //     },
  //   ],
  // },
  // {
  //   name: "reverb",
  //   title: "REVERBERATION",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //     {
  //       name: "decay",
  //       title: "DECAY",
  //       defaultValue: null,
  //       param: null,
  //       visible: true,
  //       type: "real"
  //     },{
  //       name: "mix",
  //       title: "MIX",
  //       defaultValue: 100.0,
  //       param: null,
  //       visible: false,
  //       type: "real"
  //     },
  //   ],
  // },
  // {
  //   name: "pitchshift",
  //   title: "HAUTEUR",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //     {
  //       name: "transp",
  //       title: "TRANSPOSITION",
  //       defaultValue: null,
  //       param: null,
  //       visible: true,
  //       type: "real",
  //     },
  //     {
  //       name: "mix",
  //       title: "MIX",
  //       defaultValue: 100.0,
  //       param: null,
  //       visible: false,
  //       type: "real",
  //     },
  //   ],
  // },
  // {
  //   name: "freeze",
  //   title: "FREEZE (AUTO)",
  //   device: null,
  //   div: null,
  //   activ: false,
  //   visible: true,
  //   gain: null,
  //   userParams: [
  //     {
  //       name: "auto",
  //       title: "AUTO",
  //       defaultValue: 100.0,
  //       param: null,
  //       visible: false,
  //       type: "bool"
  //     },
  //   ],
  // },
  {
    name: "glitches",
    title: "GLITCHES (Del/Chance/Feed/Range/Speed)",
    device: null,
    div: null,
    activ: true,
    visible: true,
    gain: null,
    userParams: [
      {
        name: "DEL",
        title: "DEL",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "CHANCE",
        title: "CHANCE",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "FEED",
        title: "FEED",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "RANGE",
        title: "RANGE",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "SPEED",
        title: "SPEED",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
    ],
  },
  {
    name: "sampler",
    title: "SAMPLER",
    device: null,
    div: null,
    activ: false,
    visible: false,
    gain: null,
    userParams: [
      {
        name: "pitch",
        title: "VITESSE",
        defaultValue: 1.0,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "metro_speed",
        title: "LECTURE ALEATOIRE",
        defaultValue: null,
        param: null,
        visible: true,
        type: "real",
      },
      {
        name: "size",
        title: "SIZE",
        defaultValue: 20.0,
        param: null,
        visible: false,
        type: "real",
      },
    ],
  },
];

// Contains the stun server URL we will be using.
let iceServers = {
  iceServers: [{ urls: "stun:stun.services.mozilla.com" }, { urls: "stun:stun.l.google.com:19302" }],
};
// let iceServers;
// async function create_iceServers() {
//   const response =
//     await window.fetch("https://ludicke.metered.live/api/v1/turn/credentials?apiKey=5384caa827c45b8e5c34576216e80a7430ce");

//   // Saving the response in the iceServers array
//   iceServers = await response.json();
// }
// create_iceServers();

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
  voiceActivityDetection: false,
};

const constraints = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
  },
  video: {
    width: { ideal: 320 },
    height: { ideal: 180 },
    frameRate: { ideal: 10 },
    facingMode: "user",
  },
};

function init() {
  requestWakeLock();
  document.getElementById("startButton").classList.add("spinner");
  document.getElementById("startButton").disabled = true;
  context = new AudioContext();
  if (myPeer) myPeer = null;
  myPeer = context.createMediaStreamDestination();
  analyser = context.createAnalyser();
  gain = context.createGain();
  gain.gain.value = 1.0;
  document.getElementById("gain").addEventListener("input", (event) => {
    gain.gain.value = event.target.value;
    if (event.target.value < 0.1) {
      document.getElementById("g2").style.display = "inline-block";
      document.getElementById("g1").style.display = "none";
    } else {
      document.getElementById("g1").style.display = "inline-block";
      document.getElementById("g2").style.display = "none";
    }
  });
  gain_nico = context.createGain();
  gain_nico.gain.value = 0.0;
  if (!audio_nico_source) {
    audio_nico_source = context.createMediaElementSource(audio_nico);
    audio_nico_source.connect(gain_nico);
  }
  gain_nico.connect(analyser);
  clearInterval(timer_nico);
  clearInterval(timer_sensors);
  adminVideo.muted = false;
  adminVideo.pause();
  adminVideo.volume = 0.0;
  audio_nico.play();
  adminVideo_webrtc.muted = false;
  // adminVideo_webrtc.volume = 0.0;
  // adminVideo_webrtc.play();
  // audio_nico.muted = false;
  // adminVideo.volume = 0.0;
  // audio_nico.volume = 0.0;
  console.log(socket.id);
  socket.connect();
  console.log(socket.id);
  socket.emit("join", roomName, false);
  set_insta("videosNEW");
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("devicemotion", handleMotionEvent, true);
        }
      })
      .catch((e) => alert("pas de motion capture (2)!!"));
  } else {
    alert("pas de motion capture (1)!!");
  }
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", handleOrientationEvent, true);
        }
      })
      .catch((e) => alert("pas de motion capture (2)!!"));
  } else {
    alert("pas de motion capture (1)!!");
  }
  // instru_Setup(instru_div);
}

let initialX = null;
let initialY = null;
let sensors = {
  clientId: null,
  rotRate: 0,
  acc: 0,
  alpha: 0,
  beta: 0,
  gamma: 0,
};
const ball = document.getElementById("sp_sensors_ball");
function handleMotionEvent(event) {
  document.getElementById("sp_motion_text").innerText =
    `${Number.parseFloat(event.acceleration.x).toFixed(2)} m/s2\n` +
    `${Number.parseFloat(event.acceleration.y).toFixed(2)} m/s2\n` +
    `${Number.parseFloat(event.acceleration.z).toFixed(2)} m/s2\n` +
    `${Number.parseFloat(event.rotationRate.alpha).toFixed(2)} deg/s\n` +
    `${Number.parseFloat(event.rotationRate.beta).toFixed(2)} deg/s\n` +
    `${Number.parseFloat(event.rotationRate.gamma).toFixed(2)} deg/s\n` +
    `${Number.parseFloat(event.interval).toFixed(2)} ms\n`;
  sensors.rotRate = 0.02 * Math.abs(event.rotationRate.alpha + event.rotationRate.beta + event.rotationRate.gamma);
  sensors.acc = 0.5 * Math.abs(event.acceleration.x + event.acceleration.y + event.acceleration.z);
  ball.style.transform = `scaleX(${Math.max(1, sensors.rotRate)})
                          scaleY(${Math.max(1, sensors.acc)})`;
}
function handleOrientationEvent(event) {
  document.getElementById("sp_orientation_text").innerText =
    `${Number.parseFloat(event.alpha).toFixed(2)} deg\n` +
    `${Number.parseFloat(event.beta).toFixed(2)} deg\n` +
    `${Number.parseFloat(event.gamma).toFixed(2)} deg\n`;

  if (!initialX && !initialY) {
    initialX = event.beta;
    initialY = event.gamma;
  } else {
    sensors.alpha = event.alpha;
    sensors.beta = initialX - event.beta;
    sensors.gamma = initialY - event.gamma;
    ball.style.top = 90 + (initialX - event.beta) * 5 + "px";
    ball.style.left = 90 + (initialY - event.gamma) * 2 + "px";
  }
}

// Triggered when a room is succesfully created.
socket.on("create", function () {
  console.log("Socket receive create");
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
  rtcPeerConnection.ontrack = OnTrackFunction;
  rtcPeerConnection.addTrack(myPeer.stream.getTracks()[0], myPeer.stream);
  rtcPeerConnection.addTrack(userCanvasStream.getTracks()[0], userCanvasStream);
  console.log("Adding Local Stream to peer connection");
  sendChannel = rtcPeerConnection.createDataChannel("mySceneName");
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onmessage = onSendChannelMessageCallback;
  sendChannel.onclose = onSendChannelStateChange;
  rtcPeerConnection.ondatachannel = receiveChannelCallback;
  rtcPeerConnection.onconnectionstatechange = webrtcStateChange;
  rtcPeerConnection
    .createOffer(offerOptions)
    .then((offer) => {
      rtcPeerConnection.setLocalDescription(offer);
      socket.emit("offer", offer);
      console.log("offer sent");
    })

    .catch((error) => {
      console.log(error);
    });
});

socket.on("noCreate", function () {
  console.log("Socket receive noCreate");
  socket.disconnect();
  alert("ARF !!! 😯\nL'administrateur n'est pas connecté !\nRéveille-le ! 🙄");
  location.reload();
});

// Triggered on receiving an answer from the person who joined the room.
socket.on("answer", function (answer) {
  if (answer == null) {
    goBackHome();
    alert("ARF !!! 😯\nL'administrateur n'est pas prêt !\nRéveille-le ! 🙄");
    location.reload();
  } else if (answer == "stopco") {
    goBackHome();
    alert("ZUT !!! 😪\nIl n'y a plus de place !\nReviens après ! 🙏");
    location.reload();
  } else {
    rtcPeerConnection.setRemoteDescription(answer);
    myID = socket.id;
    console.log("answer received");
    console.log("My ID : " + myID);
  }
});

// Triggered on receiving an ice candidate from the peer.
socket.on("candidate", function (candidate) {
  let icecandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(icecandidate);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected");
  console.log(reason);
  if (receiveChannel && receiveChannel.readyState != "open") {
    document.getElementById("startButton").disabled = true;
    document.getElementById("startButton").classList.add("spinner");
  }
});

socket.on("connect", () => {
  console.log("Socket connected");
  document.getElementById("startButton").disabled = false;
  document.getElementById("startButton").classList.remove("spinner");
});

// Implementing the OnIceCandidateFunction which is part of the RTCPeerConnection Interface.
function OnIceCandidateFunction(event) {
  console.log("Candidate");
  if (event.candidate) {
    socket.emit("candidate", event.candidate, roomName);
  }
}

// Implementing the OnTrackFunction which is part of the RTCPeerConnection Interface.
function OnTrackFunction(event) {
  // TODO : FOR SAFARI ONLY AUDIO !? (BUT IF NO VIDEO FILTER DESYNCH VIDEO/AUDIO ? TO CHECK !)
  // if (!navigator.userAgent.includes('Chrome') && navigator.userAgent.includes('Safari')) {
  //   adminVideo.volume = 0;
  //   adminVideo.srcObject = event.streams[0];
  // } else {
  //   if (event.track.kind === 'video'){
  //     adminVideo.volume = 0;
  //     adminVideo.srcObject = event.streams[0];
  //   };
  // }
  if (adminVideo_webrtc.srcObject !== event.streams[0]) {
    adminVideo_webrtc.srcObject = event.streams[0];
  }
  adminVideo_webrtc.muted = false;
  // adminVideo.volume = 0;
  // adminVideo.controls = true;
  // adminVideo.loop = true;

  // adminVideo.src = `https://192.168.10.2:5502/videos/video${Math.round(Math.random()*20)+1}.webm`;
  // adminVideo.src = `./videos4Client/video${Math.round(Math.random()*20)+1}.webm`;
  // adminVideo.type="video/webm";
  console.log("On Track");
}

function receiveChannelCallback(event) {
  console.log("Receive Channel Callback");
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveChannelMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveChannelMessageCallback(event) {
  console.log("Received Message : " + event.data);
  changeScene(JSON.parse(event.data));
}

function changeScene(data) {
  Array.from(document.getElementById("sp_insta").getElementsByTagName("video")).forEach((v) => (v.muted = true));
  adminVideo.muted = true;
  clearInterval(timer_nico);
  clearInterval(timer_sensors);
  switch (data.scene) {
    case 12: // SENSORS
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      sp_sensors.style.display = "flex";
      sp_insta.style.display = "none";
      myGUI.style.display = "none";
      atablee.style.display = "none";
      adminVideo_webrtc.pause();
      adminVideo_webrtc.volume = 0;
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      if (!sensors.clientId) sensors.clientId = myID;
      timer_sensors = setInterval(() => {
        if (sendChannel && sendChannel.readyState === "open") {
          sendChannel.send(JSON.stringify(sensors));
        }
      }, 32);
      break;
    case 11: // INSTA
      if (!myPeer || !myPeer.stream.active) {
        myPeer = context.createMediaStreamDestination();
        let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
        audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
      }
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      if (context.state == "suspended") {
        context.resume();
      }
      sp_insta.style.display = "initial";
      sp_sensors.style.display = "none";
      myGUI.style.display = "none";
      atablee.style.display = "none";
      adminVideo_webrtc.pause();
      adminVideo_webrtc.volume = 0;
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      break;
    case 10: // FACETIME
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // if (source_mic) try {source_mic.getTracks().forEach(function(track) {track.stop();}); source_mic= null;} catch(e) {console.log(e)};
      // try {context.suspend()} catch(e) {console.log(e)}
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      atablee.style.display = "initial";
      userCanvas.style.display = "none";
      sp_sensors.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.style.display = "none";
      adminVideo_webrtc.style.display = "initial";
      sp_insta.style.display = "none";
      adminVideo_webrtc.play();
      adminVideo_webrtc.volume = 0;
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      if (!userStream.getVideoTracks()[0].getConstraints().facingMode && userStream.getVideoTracks()[0].getConstraints().facingMode !== "user") {
        userStream.getTracks().forEach((track) => {
          track.stop();
        });
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              noiseSuppression: true,
              echoCancellation: true,
            },
            video: {
              width: { ideal: 320 },
              height: { ideal: 180 },
              frameRate: { ideal: 10 },
              facingMode: "user",
            },
          })
          .then((stream) => gotStream(stream, true))
          .then(() => {
            if (adminVideo_webrtc.srcObject !== userStream) {
              adminVideo_webrtc.srcObject = userStream;
            }
          })
          .catch(errStream);
      } else {
        if (adminVideo_webrtc.srcObject !== userStream) {
          adminVideo_webrtc.srcObject = userStream;
        }
      }
      break;
    case 9: //FLASH
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // if (source_mic) try {source_mic.getTracks().forEach(function(track) {track.stop();}); source_mic= null;} catch(e) {console.log(e)};
      // try {context.suspend()} catch(e) {console.log(e)}
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      atablee.style.display = "initial";
      myGUI.style.display = "none";
      sp_sensors.style.display = "none";
      adminVideo.style.display = "none";
      userCanvas.style.display = "none";
      adminVideo_webrtc.style.display = "none";
      adminVideo_webrtc.pause();
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      sp_insta.style.display = "none";

      if (
        userStream.getVideoTracks()[0].getConstraints().facingMode &&
        userStream.getVideoTracks()[0].getConstraints().facingMode !== "environment"
      ) {
        userStream.getTracks().forEach((track) => {
          track.stop();
        });
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              noiseSuppression: true,
              echoCancellation: true,
            },
            video: {
              width: { ideal: 320 },
              height: { ideal: 180 },
              frameRate: { ideal: 10 },
              facingMode: "environment",
            },
          })
          .then((stream) => gotStream(stream, true))
          .then(() => {
            torchflash(data.time);
          })
          .catch(errStream);
      } else {
        torchflash(data.time);
      }
      break;
    case 8: // WAIT
      overlay.style.visibility = "hidden";
      sp_sensors.style.display = "none";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "visible";
      atablee.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.pause();
      adminVideo.volume = 0;
      adminVideo_webrtc.pause();
      sp_insta.style.display = "none";
      // adminVideo_webrtc.volume = 0;
      audio_nico.pause();
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // try{userCanvasStream.getTracks().forEach((track) => {track.stop()});}catch(e){console.log(e)};
      // try{rtcPeerConnection.close(); rtcPeerConnection = null;}catch(e){console.log(e)};
      try {
        context.suspend();
      } catch (e) {
        console.log(e);
      }
      document.getElementById("startButton").classList.remove("spinner");
      document.getElementById("startButton").disabled = false;
      try {
        streamVisualizer4Clients.stop();
      } catch (e) {
        console.log(e);
      }
      break;
    case 0: // RELOAD ALL
      goBackHome();
      location.reload();
      break;
    case 1: // @TABLEE PART1
      if (data.freq) {
        filter.device.parameters.find((p) => p.name == "FREQ").value = data.freq;
      } else {
        if (!myPeer || !myPeer.stream.active) {
          myPeer = context.createMediaStreamDestination();
          let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
          audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
        }
        if (streamVisualizer4Clients)
          try {
            streamVisualizer4Clients.stop();
          } catch (e) {
            console.log(e);
          }
        if (!context || context.state == "closed") {
          // TODO
          console.log("context1 1");
          context = new AudioContext();
          let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
          audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
          let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
          videoSender.replaceTrack(userCanvasStream.getTracks()[0]);
        } else if (context.state == "suspended") {
          console.log("context2 1");
          context.resume();
          let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
          audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
          let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
          videoSender.replaceTrack(userCanvasStream.getTracks()[0]);
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
              return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        if (!source_mic) {
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => gotStream(stream, false))
            .then(() => {
              atablee.style.display = "initial";
              userCanvas.style.display = "initial";
              sp_sensors.style.display = "none";
              adminVideo.style.display = "none";
              adminVideo.muted = true;
              // adminVideo.play();
              adminVideo_webrtc.style.display = "none";
              // adminVideo_webrtc.volume = 0;
              adminVideo_webrtc.pause();
              audio_nico.pause();
              myGUI.style.display = "flex";
              overlay.style.visibility = "hidden";
              overlayTHEEND.style.visibility = "hidden";
              overlayWAIT.style.visibility = "hidden";
              sp_insta.style.display = "none";
            })
            .catch(errStream);
        } else {
          atablee.style.display = "initial";
          userCanvas.style.display = "initial";
          sp_sensors.style.display = "none";
          adminVideo.style.display = "none";
          adminVideo.muted = true;
          // adminVideo.play();
          adminVideo_webrtc.style.display = "none";
          // adminVideo_webrtc.volume = 0;
          adminVideo_webrtc.pause();
          audio_nico.pause();
          myGUI.style.display = "flex";
          overlay.style.visibility = "hidden";
          overlayTHEEND.style.visibility = "hidden";
          overlayWAIT.style.visibility = "hidden";
          sp_insta.style.display = "none";
          source = context.createMediaStreamSource(source_mic);
          context.resume();
          source.connect(filter.device.node);
          nodeConnection("auto");
          btn_effects.disabled = false;
          btn_effects.style.borderColor = "white";
          btn_rec.disabled = false;
          btn_rec.style.borderColor = "white";
          if (!streamVisualizer4Clients) {
            streamVisualizer4Clients = new StreamVisualizer4Clients(analyser, canvas);
          } else {
            streamVisualizer4Clients.stop();
            streamVisualizer4Clients.setStroke(false);
            streamVisualizer4Clients.setSize(10);
            streamVisualizer4Clients.setFFT_SIZE(512);
            streamVisualizer4Clients.setGAIN(1);
          }
          streamVisualizer4Clients.start();
        }
        nodeConnection();
      }
      break;
    case 20: // @TABLEE PART2 webRTC
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // rtcPeerConnection.getSenders().forEach(t => rtcPeerConnection.removeTrack(t));
      if (source_mic)
        try {
          source_mic.getTracks().forEach(function (track) {
            track.stop();
          });
          source_mic = null;
        } catch (e) {
          console.log(e);
        }
      try {
        context.suspend();
      } catch (e) {
        console.log(e);
      }
      // try {effects.forEach(e=>e.device = null) } catch (e){console.log(e)};
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      atablee.style.display = "initial";
      userCanvas.style.display = "none";
      sp_sensors.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.style.display = "none";
      //document.getElementById("overlay").remove(); // TODO
      adminVideo_webrtc.style.display = "initial";
      // adminVideo_webrtc.volume = 1;
      adminVideo_webrtc.play();
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      sp_insta.style.display = "none";
      break;
    case 21: // @TABLEE PART2 videos
      if (data.video) {
        if (data.video === "R") {
          adminVideo.currentTime = Math.random() * 0.8 * adminVideo.duration;
          adminVideo.muted = false;
          adminVideo.volume = 1;
          adminVideo.play();
        } else {
          adminVideo.src = `./videosNEW/video${data.video}.mp4`;
          if (!data.muted) {
            adminVideo.muted = false;
            adminVideo.volume = 1;
          } else {
            adminVideo.muted = true;
            adminVideo.volume = 0;
          }
          adminVideo.play();
        }
      } else {
        try {
          myPeer.stream.getTracks().forEach((track) => {
            track.stop();
          });
        } catch (e) {
          console.log(e);
        }
        // rtcPeerConnection.getSenders().forEach(t => rtcPeerConnection.removeTrack(t));
        if (source_mic)
          try {
            source_mic.getTracks().forEach(function (track) {
              track.stop();
            });
            source_mic = null;
          } catch (e) {
            console.log(e);
          }
        try {
          context.suspend();
        } catch (e) {
          console.log(e);
        }
        // try { effects.forEach(e=>e.device = null) } catch (e){console.log(e)};
        if (streamVisualizer4Clients)
          try {
            streamVisualizer4Clients.stop();
          } catch (e) {
            console.log(e);
          }
        atablee.style.display = "initial";
        userCanvas.style.display = "none";
        sp_sensors.style.display = "none";
        myGUI.style.display = "none";
        adminVideo_webrtc.style.display = "none";
        //document.getElementById("overlay").remove(); // TODO
        // adminVideo_webrtc.volume = 0;
        adminVideo_webrtc.pause();
        adminVideo.style.display = "initial";
        adminVideo.loop = true;
        adminVideo.currentTime = 0;
        adminVideo.play();
        adminVideo.muted = false;
        adminVideo.volume = 1;
        overlay.style.visibility = "hidden";
        overlayTHEEND.style.visibility = "hidden";
        overlayWAIT.style.visibility = "hidden";
        audio_nico.pause();
        sp_insta.style.display = "none";
      }
      break;
    case 3: // @TABLEE PART3
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // rtcPeerConnection.getSenders().forEach(t => rtcPeerConnection.removeTrack(t));
      if (source_mic)
        try {
          source_mic.getTracks().forEach(function (track) {
            track.stop();
          });
          source_mic = null;
        } catch (e) {
          console.log(e);
        }
      try {
        context.suspend();
      } catch (e) {
        console.log(e);
      }
      // try {effects.forEach(e=>e.device = null) } catch (e){console.log(e)};
      if (streamVisualizer4Clients)
        try {
          streamVisualizer4Clients.stop();
        } catch (e) {
          console.log(e);
        }
      atablee.style.display = "initial";
      userCanvas.style.display = "none";
      sp_sensors.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.style.display = "none";
      //document.getElementById("overlay").remove(); // TODO
      adminVideo_webrtc.style.display = "none";
      // adminVideo_webrtc.volume = 1;
      adminVideo_webrtc.play();
      adminVideo.volume = 0;
      adminVideo.pause();
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      audio_nico.pause();
      sp_insta.style.display = "none";
      break;
    case 4: // @TABLEE PART3 FALSHES
      setTimeout(() => {
        atablee.style.background = "white";
      }, 100);
      console.log(navigator.vibrate);
      if (navigator.vibrate) {
        navigator.vibrate(
          [400, 0, 300, 0, 200, 0, 100].map(function (x) {
            return (x + 200) * Math.random();
          })
        );
      }
      setTimeout(() => {
        atablee.style.background = "black";
      }, 1500);
      break;
    case 5: // NOTHING
      adminVideo.src = `./videos4Client/video${Math.round(Math.random() * 20) + 1}.webm`;
      adminVideo.play();
      // vimeo.loadVideo("978281628").then(()=>vimeo.play());
      // vimeo.setCurrentTime(Math.random()*100);
      // vimeo.on('progress', (e)=>console.log(e.percent));
      // vimeo.play();
      break;
    case 6: // NIKOIKEDA
      if (data.vol) {
        gain_nico.gain.value = data.vol;
      } else if (data.freeze) {
        console.log(data.freeze);
        if (streamVisualizer4Clients) streamVisualizer4Clients.setRAND(data.freeze);
      } else if (data.gain) {
        console.log(data.gain);
        if (streamVisualizer4Clients) streamVisualizer4Clients.setGAIN(data.gain);
      } else if (data.fft) {
        console.log(data.fft);
        if (streamVisualizer4Clients) streamVisualizer4Clients.setFFT_SIZE(Math.pow(2, data.fft));
      } else {
        flash("white");
        if (!context || context.state == "closed") {
          // TODO
          console.log("context1");
          context = new AudioContext();
          let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
          audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
          let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
          videoSender.replaceTrack(userCanvasStream.getTracks()[0]);
        } else if (context.state == "suspended") {
          context.resume();
        }
        analyser.disconnect(0);
        analyser.connect(context.destination);
        gain.disconnect(0);
        clearInterval(timer_nico);
        try {
          if (navigator.vibrate) {
            timer_nico = setInterval(() => {
              navigator.vibrate(
                [400, 0, 300, 0, 200, 0, 100].map(function (x) {
                  return (x + 200) * Math.random();
                })
              );
            }, 3000);
          }
        } catch (e) {
          console.log(e);
        }
        // context.close();
        userCanvas.style.display = "none";
        gain_nico.gain.value = 1.0;
        // audio_nico.muted = false;
        audio_nico.currentTime = 0;
        audio_nico.play();
        audio_nico.loop = true;
        atablee.style.display = "initial";
        sp_sensors.style.display = "none";
        userCanvas.style.display = "initial";
        adminVideo.style.display = "none";
        adminVideo.pause();
        adminVideo.volume = 0;
        adminVideo_webrtc.style.display = "none";
        // adminVideo_webrtc.volume = 0;
        adminVideo_webrtc.pause();
        myGUI.style.display = "none";
        sp_insta.style.display = "none";
        audio_nico.addEventListener("ended", (event) => {
          flash("white");
        });
        if (!streamVisualizer4Clients) {
          streamVisualizer4Clients = new StreamVisualizer4Clients(analyser, canvas);
        } else {
          streamVisualizer4Clients.stop();
        }
        streamVisualizer4Clients.start();
        streamVisualizer4Clients.setStroke(true);
        streamVisualizer4Clients.setSize(1000);
        streamVisualizer4Clients.setFFT_SIZE(128);
        streamVisualizer4Clients.setGAIN(10000);
        overlay.style.visibility = "hidden";
        overlayTHEEND.style.visibility = "hidden";
        overlayWAIT.style.visibility = "hidden";
        // btn_fullscreen.style.display = "initial";
        // if (source_mic) try {source_mic.getTracks().forEach(function(track) {track.stop();});} catch(e) {console.log(e)};
        // try {effects.forEach(e=>e.device = null) } catch (e){console.log(e)};
        try {
          myPeer.stream.getTracks().forEach((track) => {
            track.stop();
          });
        } catch (e) {
          console.log(e);
        }
      }
      break;
    case 7: // THE END
      overlay.style.visibility = "hidden";
      overlayTHEEND.style.visibility = "visible";
      sp_sensors.style.display = "none";
      overlayWAIT.style.visibility = "hidden";
      atablee.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.pause();
      adminVideo.volume = 0;
      adminVideo_webrtc.pause();
      sp_insta.style.display = "none";
      // adminVideo_webrtc.volume = 0;
      audio_nico.pause();
      try {
        myPeer.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      try {
        userCanvasStream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log(e);
      }
      // try{rtcPeerConnection.close(); rtcPeerConnection = null;}catch(e){console.log(e)};
      if (source_mic)
        try {
          source_mic.getTracks().forEach(function (track) {
            track.stop();
          });
          source_mic = null;
        } catch (e) {
          console.log(e);
        }
      try {
        context.suspend();
      } catch (e) {
        console.log(e);
      }
      document.getElementById("startButton").classList.remove("spinner");
      document.getElementById("startButton").disabled = false;
      try {
        streamVisualizer4Clients.stop();
      } catch (e) {
        console.log(e);
      }
      break;
    default:
      console.log("No scene...");
      flash("red");
  }
}

function errStream(err) {
  overlay.style.visibility = "visible";
  overlayTHEEND.style.visibility = "hidden";
  overlayWAIT.style.visibility = "hidden";
  document.getElementById("titles").style.display = "none";
  document.getElementById("err").style.display = "inline-block";
  document.getElementById("microon").style.display = "none";
  document.getElementById("microoff").style.display = "inline-block";
  atablee.style.display = "none";
  userCanvas.style.display = "none";
  adminVideo.style.display = "none";
  adminVideo.muted = true;
  // adminVideo.play();
  adminVideo_webrtc.style.display = "none";
  sp_insta.style.display = "none";
  // adminVideo_webrtc.volume = 0;
  adminVideo_webrtc.pause();
  audio_nico.pause();
  if (fullscreenElement === undefined) {
    myGUI.style.display = "none";
  } else {
    myGUI.style.display = "flex";
  }
  if (sendChannel && sendChannel.readyState === "open") {
    sendChannel.send(JSON.stringify({ clientId: myID, mess: "NoMic" }));
  }
  console.log(err);
}

function gotStream(stream, withVid) {
  source_mic = stream;
  source = context.createMediaStreamSource(source_mic);
  userStream = stream;
  if (withVid) {
    let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
    videoSender.replaceTrack(userStream.getVideoTracks()[0]);
  } else {
    let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
    videoSender.replaceTrack(userCanvasStream.getTracks()[0]);
  }
  context.suspend();
  if (!effects_loaded) {
    document.getElementById("loading-bar").style.display = "initial";
    try {
      removeAllChildNodes(document.getElementById("effects-params"));
    } catch (e) {
      console.log(e);
    }
    effects_Setup(effects)
      .then(() => {
        filter_Setup(filter).then(() => {
          context.resume();
          source.connect(filter.device.node);
          nodeConnection("auto");
          btn_effects.disabled = false;
          btn_effects.style.borderColor = "white";
          btn_rec.disabled = false;
          btn_rec.style.borderColor = "white";
          effects_loaded = true;
          document.getElementById("loading-bar").style.display = "none";
        });
      })
      .catch(function (err) {
        try {
          context.resume();
          console.log(`${err.name}, ${err.message}`);
          alert("Désolé, impossible pour ton smartphone de charger les effets sonores !");
          document.getElementById("loading-bar").style.display = "none";
          effects_loaded = false;
          source.connect(gain);
          gain.connect(analyser);
          analyser.connect(myPeer); // TODO
        } catch (e) {
          alert(e);
        }
      });
  } else {
    context.resume();
    nodeConnection("auto");
    btn_effects.disabled = false;
    btn_effects.style.borderColor = "white";
    btn_rec.disabled = false;
    btn_rec.style.borderColor = "white";
  }
  const audioTracks = stream.getAudioTracks();
  if (audioTracks.length > 0) {
    console.log(`Using Audio device: ${audioTracks[0].label}`);
  }
  if (!streamVisualizer4Clients) {
    streamVisualizer4Clients = new StreamVisualizer4Clients(analyser, canvas);
  } else {
    streamVisualizer4Clients.stop();
    streamVisualizer4Clients.setStroke(false);
    streamVisualizer4Clients.setSize(10);
    streamVisualizer4Clients.setFFT_SIZE(512);
    streamVisualizer4Clients.setGAIN(1);
  }
  streamVisualizer4Clients.start();
}

function onReceiveChannelStateChange() {
  const readyState = receiveChannel.readyState;
  console.log(`Receive channel state is: ${readyState}`);
  if (readyState == "open") socket.disconnect();
}

function onSendChannelStateChange() {
  const readyState = sendChannel.readyState;
  console.log("Send channel state is: " + readyState);
  if (readyState == "closed") {
    goBackHome();
    // alert('MINCE ! 🤔\nTu as été déconnecté !?');
    location.reload();
  }
}

function onSendChannelMessageCallback(event) {
  console.log("Message sent");
}

function webrtcStateChange(ev) {
  switch (ev.currentTarget.connectionState) {
    case "new":
      console.log("New...");
      break;
    case "checking":
      console.log("Connecting…");
      break;
    case "connected":
      console.log("Online");
      document.getElementById("startButton").classList.remove("spinner");
      document.getElementById("startButton").disabled = false;
      break;
    case "disconnected":
      console.log("Disconnecting…");
      goBackHome();
      alert("MINCE ! 🤔\nTu as été déconnecté !?");
      location.reload();
      break;
    case "closed":
      goBackHome();
      console.log("Offline");
      alert("MINCE ! 🤔\nTu as été sorti du jeu ?!");
      location.reload();
      break;
    case "failed":
      console.log("Error");
      goBackHome();
      alert("OUPS ! 🤔\nEs-tu bien connecté au wifi @TABLEE ?");
      location.reload();
      break;
    default:
      overlay.style.visibility = "visible";
      overlayTHEEND.style.visibility = "hidden";
      overlayWAIT.style.visibility = "hidden";
      atablee.style.display = "none";
      myGUI.style.display = "none";
      adminVideo.pause();
      adminVideo.volume = 0;
      break;
  }
}

function flash(color) {
  document.getElementById("adminID").style.background = color;
  document.getElementById("adminID").style.visibility = "visible";
  setTimeout(() => (document.getElementById("adminID").style.visibility = "hidden"), 300);
}

function torchflash(time) {
  console.log("tamere1");

  console.log(userStream.getVideoTracks()[0].getConstraints());
  userStream.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: true }] });
  atablee.style.background = "white";
  if (navigator.vibrate) {
    navigator.vibrate(
      [400, 0, 300, 0, 200, 0, 100].map(function (x) {
        return (x + 200) * Math.random();
      })
    );
  }
  setTimeout(() => {
    console.log(userStream.getVideoTracks()[0].getConstraints());
    atablee.style.background = "black";
    userStream.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: false }] });
    console.log("tamere3");
    console.log(userStream.getVideoTracks()[0].getConstraints());
  }, time);
  console.log("tamere2");
}

function goBackHome() {
  overlay.style.visibility = "visible";
  overlayTHEEND.style.visibility = "hidden";
  overlayWAIT.style.visibility = "hidden";
  atablee.style.display = "none";
  myGUI.style.display = "none";
  adminVideo.pause();
  adminVideo.volume = 0;
  adminVideo_webrtc.pause();
  sp_insta.style.display = "none";
  // adminVideo_webrtc.volume = 0;
  try {
    myPeer.stream.getTracks().forEach((track) => {
      track.stop();
    });
  } catch (e) {
    console.log(e);
  }
  try {
    userCanvasStream.getTracks().forEach((track) => {
      track.stop();
    });
  } catch (e) {
    console.log(e);
  }
  try {
    rtcPeerConnection.close();
    rtcPeerConnection = null;
  } catch (e) {
    console.log(e);
  }
  if (source_mic)
    try {
      source_mic.getTracks().forEach(function (track) {
        track.stop();
      });
      source_mic = null;
    } catch (e) {
      console.log(e);
    }
  try {
    context.suspend();
  } catch (e) {
    console.log(e);
  }
  document.getElementById("startButton").classList.remove("spinner");
  document.getElementById("startButton").disabled = false;
  try {
    streamVisualizer4Clients.stop();
  } catch (e) {
    console.log(e);
  }
}

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      console.log("Wake Lock was released");
    });
    console.log("Wake Lock is active");
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
    try {
      noSleep.enable();
    } catch (err) {
      alert("Impossible de couper la veille automatiquement !");
    }
  }
};

document.addEventListener("visibilitychange", (event) => {
  try {
    if (context && context.state != "closed") {
      if (document.visibilityState === "visible") {
        context.resume();
      } else {
        context.suspend();
      }
    }
  } catch (err) {
    console.log(err);
  }
  if (document.visibilityState === "visible") {
    requestWakeLock();
  } else {
    btn_fullscreen.style.backgroundColor = "transparent";
    document.getElementById("fs1").style.display = "inline-block";
    document.getElementById("fs2").style.display = "none";
  }
});

function changeFullScreen() {
  try {
    fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement !== undefined) {
      if (!fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          btn_fullscreen.style.backgroundColor = "#5c5c5c";
          document.getElementById("fs2").style.display = "inline-block";
          document.getElementById("fs1").style.display = "none";
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
          btn_fullscreen.style.backgroundColor = "#5c5c5c";
          document.getElementById("fs2").style.display = "inline-block";
          document.getElementById("fs1").style.display = "none";
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          btn_fullscreen.style.backgroundColor = "transparent";
          document.getElementById("fs1").style.display = "inline-block";
          document.getElementById("fs2").style.display = "none";
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
          btn_fullscreen.style.backgroundColor = "transparent";
          document.getElementById("fs1").style.display = "inline-block";
          document.getElementById("fs2").style.display = "none";
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

// function goFullScreen(){
//   fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//   if (fullscreenElement !== undefined){
//     if (!fullscreenElement)
//     {
//         if(document.documentElement.requestFullscreen)
//         {
//           document.documentElement.requestFullscreen();
//           btn_fullscreen.style.backgroundColor = "#5c5c5c";
//           document.getElementById("fs2").style.display = 'inline-block';
//           document.getElementById("fs1").style.display = 'none';
//         }
//         else if(document.documentElement.webkitRequestFullscreen)
//         {
//           document.documentElement.webkitRequestFullscreen();
//           btn_fullscreen.style.backgroundColor = "#5c5c5c";
//           document.getElementById("fs2").style.display = 'inline-block';
//           document.getElementById("fs1").style.display = 'none';
//         }
//     }
//   }
// }

// async function instru_Setup(div) {
//   let response, patcher;
//   try {
//       response = await fetch("./"+div.getAttribute("name")+"/patch.export.json");
//       patcher = await response.json();
//       //if (!window.RNBO) {
//           // Load RNBO script dynamically
//           // Note that you can skip this by knowing the RNBO version of your patch
//           // beforehand and just include it using a <script> tag
//           await loadRNBOScript(patcher.desc.meta.rnboversion); // TOBACK
//           console.log(patcher.desc.meta.rnboversion);
//       //}

//   } catch (err) {
//       const errorContext = {
//           error: err
//       };
//       if (response && (response.status >= 300 || response.status < 200)) {
//           errorContext.header = `Couldn't load patcher export bundle`,
//           errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
//           ` trying to load "${patchExportURL}". If that doesn't` +
//           ` match the name of the file you exported from RNBO, modify` +
//           ` patchExportURL in app.js.`;
//       }
//       if (typeof guardrails === "function") {
//           guardrails(errorContext);
//       } else {
//           throw err;
//       }
//       return;
//   }

//   // (Optional) Fetch the dependencies
//   let dependencies = [];
//   try {
//       const dependenciesResponse = await fetch("./"+div.getAttribute("name")+"/dependencies.json");
//       dependencies = await dependenciesResponse.json();
//       // Prepend "export" to any file dependenciies
//       dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "./"+div.getAttribute("name")+"/" + d.file }) : d);
//   } catch (e) {
//     console.log('No dependencies in : ' + effects[i].name);
//   }

//   // Create the device
//   try {
//       instru.device = await RNBO.createDevice({ context, patcher });
//   } catch (err) {
//       alert('err');
//   }

//   // if (dependencies.length)
//   //   await effects[i].device.loadDataBufferDependencies(dependencies);

//   // attachOutports(effects[i].device);

//   instru.gain = context.createGain();
//   instru.gain.gain.value = 1.0;
//   // Connect the device to the web audio graph
//   instru.device.node.connect(instru.gain);
//   console.log(instru)

//   instru.device.parameters.forEach((param)=>{
//     let label = document.createElement("label");
//         let slider = document.createElement("input");
//         let text = document.createElement("input");
//         let sliderContainer = document.createElement("div");
//         sliderContainer.appendChild(label);
//         sliderContainer.appendChild(slider);
//         sliderContainer.appendChild(text);

//         // Add a name for the label
//         label.setAttribute("name", param.name);
//         label.setAttribute("for", param.name);
//         label.setAttribute("class", "param-label");
//         label.textContent = `${param.name}: `;

//         // Make each slider reflect its parameter
//         slider.setAttribute("type", "range");
//         slider.setAttribute("class", "param-slider");
//         slider.setAttribute("id", param.id);
//         slider.setAttribute("name", param.name);
//         slider.setAttribute("min", param.min);
//         slider.setAttribute("max", param.max);
//         if (param.steps > 1) {
//             slider.setAttribute("step", (param.max - param.min) / (param.steps - 1));
//         } else {
//             slider.setAttribute("step", (param.max - param.min) / 1000.0);
//         }
//         slider.setAttribute("value", param.value);

//         // Make a settable text input display for the value
//         text.setAttribute("value", param.value.toFixed(1));
//         text.setAttribute("type", "text");

//         // Make each slider control its parameter
//         slider.addEventListener("pointerdown", () => {
//             isDraggingSlider = true;
//         });
//         slider.addEventListener("pointerup", () => {
//             isDraggingSlider = false;
//             slider.value = param.value;
//             text.value = param.value.toFixed(1);
//         });
//         slider.addEventListener("input", () => {
//             let value = Number.parseFloat(slider.value);
//             param.value = value;
//         });

//         // Make the text box input control the parameter value as well
//         text.addEventListener("keydown", (ev) => {
//             if (ev.key === "Enter") {
//                 let newValue = Number.parseFloat(text.value);
//                 if (isNaN(newValue)) {
//                     text.value = param.value;
//                 } else {
//                     newValue = Math.min(newValue, param.max);
//                     newValue = Math.max(newValue, param.min);
//                     text.value = newValue;
//                     param.value = newValue;
//                 }
//             }
//         });
//         instru_div.appendChild(sliderContainer);
//   });

//   // Listen to parameter changes from the device
//   // autoChangeGUI(device, uiElements);

// }

async function effects_Setup(effects) {
  let response, patcher;
  for (let i = 0; i < effects.length; i++) {
    if (window.matchMedia("(orientation: portrait)").matches) {
      document.getElementById("loading-bar").style.transform = `scaleY(${(i + 1) / effects.length})`;
    } else {
      document.getElementById("loading-bar").style.transform = `scaleX(${(i + 1) / effects.length})`;
    }
    try {
      response = await fetch("./effects/" + effects[i].name + ".export.json");
      patcher = await response.json();
      //if (!window.RNBO) {
      // Load RNBO script dynamically
      // Note that you can skip this by knowing the RNBO version of your patch
      // beforehand and just include it using a <script> tag
      await loadRNBOScript(patcher.desc.meta.rnboversion); // TOBACK
      console.log(effects[i].name + ": RNBO version " + patcher.desc.meta.rnboversion);
      //}
    } catch (err) {
      const errorContext = {
        error: err,
      };
      if (response && (response.status >= 300 || response.status < 200)) {
        (errorContext.header = `Couldn't load patcher export bundle`),
          (errorContext.description =
            `Check app.js to see what file it's trying to load. Currently it's` +
            ` trying to load "${patchExportURL}". If that doesn't` +
            ` match the name of the file you exported from RNBO, modify` +
            ` patchExportURL in app.js.`);
      }
      if (typeof guardrails === "function") {
        guardrails(errorContext);
      } else {
        throw err;
      }
      return;
    }

    // (Optional) Fetch the dependencies
    let dependencies = [];
    try {
      const dependenciesResponse = await fetch(`./effects/${effects[i].name}_dependencies.json`);
      dependencies = await dependenciesResponse.json();
      // Prepend "export" to any file dependenciies
      dependencies = dependencies.map((d) => (d.file ? Object.assign({}, d, { file: "./effects/" + d.file }) : d));
    } catch (e) {
      console.log("No dependencies in : " + effects[i].name);
    }

    // Create the device
    try {
      effects[i].device = await RNBO.createDevice({ context, patcher });
    } catch (err) {
      alert("err");
    }

    if (dependencies.length) await effects[i].device.loadDataBufferDependencies(dependencies);

    // attachOutports(effects[i].device);

    effects[i].gain = context.createGain();
    effects[i].gain.gain.value = 1.0;
    // Connect the device to the web audio graph
    effects[i].device.node.connect(effects[i].gain);

    if (effects[i].visible) {
      makeGUI(effects[i].device, effects[i].userParams, effects[i].title, effects[i].activ);
    } else if (effects[i].name == "sampler") {
      makeSamplerGUI(effects[i].device, effects[i].userParams, effects[i].title, effects[i].activ);
    }
  }
}

async function filter_Setup(filter) {
  let response, patcher;
  try {
    response = await fetch("./effects/" + filter.name + ".export.json");
    patcher = await response.json();
    //if (!window.RNBO) {
    // Load RNBO script dynamically
    // Note that you can skip this by knowing the RNBO version of your patch
    // beforehand and just include it using a <script> tag
    await loadRNBOScript(patcher.desc.meta.rnboversion); // TOBACK
    console.log(patcher.desc.meta.rnboversion);
    //}
  } catch (err) {
    const errorContext = {
      error: err,
    };
    if (response && (response.status >= 300 || response.status < 200)) {
      (errorContext.header = `Couldn't load patcher export bundle`),
        (errorContext.description =
          `Check app.js to see what file it's trying to load. Currently it's` +
          ` trying to load "${patchExportURL}". If that doesn't` +
          ` match the name of the file you exported from RNBO, modify` +
          ` patchExportURL in app.js.`);
    }
    if (typeof guardrails === "function") {
      guardrails(errorContext);
    } else {
      throw err;
    }
    return;
  }

  // (Optional) Fetch the dependencies
  // let dependencies = [];
  // try {
  //     const dependenciesResponse = await fetch(`./effects/${effects[i].name}_dependencies.json`);
  //     dependencies = await dependenciesResponse.json();
  //     // Prepend "export" to any file dependenciies
  //     dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "./effects/" + d.file }) : d);
  // } catch (e) {
  //   console.log('No dependencies in : ' + effects[i].name);
  // }

  // Create the device
  try {
    filter.device = await RNBO.createDevice({ context, patcher });
  } catch (err) {
    alert("err");
  }

  // if (dependencies.length)
  //   await effects[i].device.loadDataBufferDependencies(dependencies);

  // attachOutports(effects[i].device);

  filter.gain = context.createGain();
  filter.gain.gain.value = 1.0;
  // Connect the device to the web audio graph
  filter.device.node.connect(filter.gain);
}

function loadRNBOScript(version) {
  return new Promise((resolve, reject) => {
    if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
      throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
    }
    const el = document.createElement("script");

    el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";

    el.onload = resolve;
    el.onerror = function (err) {
      console.log(err);
      reject(new Error("Failed to load rnbo.js v" + version));
    };
    document.body.append(el);
  });
}

// function attachOutports(device) {
//   try{
//     const outports = device.outports;
//     if (outports.length < 1) {
//         return;
//     }

//     device.messageEvent.subscribe((ev) => {

//         // Ignore message events that don't belong to an outport
//         if (outports.findIndex(elt => elt.tag === ev.tag) < 0) return;

//         // Message events have a tag as well as a payload
//         // console.log(`${ev.tag}: ${ev.payload}`);
//         if (ev.tag == 'gain_1'){
//           document.getElementById("adminID").style.visibility = "visible";
//           setTimeout(()=>document.getElementById("adminID").style.visibility = "hidden", 300);
//         }
//     });
//   } catch(e) {alert(e)};
// }

function makeGUI(device, userParams, effect_title, effect_activ) {
  let effect_div = document.createElement("div");
  effect_div.setAttribute("class", "effect_div");
  let pdiv = document.getElementById("effects-params");
  pdiv.appendChild(effect_div);
  // This will allow us to ignore parameter update events while dragging the slider.
  // let uiElements = {};

  // ON/OFF BOUTON :
  //param_input.value = 1.0;
  let sliderContainer = document.createElement("div");

  let label = document.createElement("label");
  let input = document.createElement("input");
  let div = document.createElement("div");
  let span = document.createElement("span");
  label.setAttribute("class", "toggle");
  input.setAttribute("class", "toggle-checkbox");
  input.setAttribute("type", "checkbox");
  div.setAttribute("class", "toggle-switch");
  span.setAttribute("class", "toggle-label");
  span.textContent = effect_title;
  label.appendChild(input);
  label.appendChild(div);
  label.appendChild(span);
  input.setAttribute("id", effect_title);
  input.checked = effect_activ;
  input.onchange = onoffEffect;
  sliderContainer.appendChild(label);

  effect_div.appendChild(sliderContainer);

  userParams.forEach((userParam) => {
    let param = device.parameters.find((t) => t.name == userParam.name);
    if (userParam.defaultValue !== null) {
      param.value = userParam.defaultValue;
    } else {
      userParam.defaultValue = param.value;
    }
    if (userParam.visible) {
      // PARAMS :
      let paramGUI = createParamGUI(param, effect_title, userParam.type, effect_activ);

      // Store the slider and text by name so we can access them later
      let slider = paramGUI.slider;
      // uiElements[param.id] = { slider };

      // Add the slider element
      effect_div.appendChild(paramGUI.sliderContainer);
    }
  });

  // Listen to parameter changes from the device
  // autoChangeGUI(device, uiElements);
}

function makeSamplerGUI(device, userParams, effect_title, effect_activ) {
  let effect_div = document.createElement("div");
  effect_div.setAttribute("class", "effect_div");
  effect_div.setAttribute("id", "sampler_div");
  effect_div.style.display = "none";
  let pdiv = document.getElementById("effects-params");
  pdiv.appendChild(effect_div);
  // This will allow us to ignore parameter update events while dragging the slider.
  // let uiElements = {};

  userParams.forEach((userParam) => {
    let param = device.parameters.find((t) => t.name == userParam.name);
    if (userParam.defaultValue !== null) {
      param.value = userParam.defaultValue;
    } else {
      userParam.defaultValue = param.value;
    }

    if (userParam.visible) {
      let sliderContainer = document.createElement("div");

      let label = document.createElement("label");
      let input = document.createElement("input");
      let div = document.createElement("div");
      let span = document.createElement("span");
      label.setAttribute("class", "toggle");
      input.setAttribute("class", "toggle-checkbox");
      input.setAttribute("type", "checkbox");
      div.setAttribute("class", "toggle-switch");
      span.setAttribute("class", "toggle-label");
      span.textContent = userParam.title;
      label.appendChild(input);
      label.appendChild(div);
      label.appendChild(span);
      input.setAttribute("id", userParam.name);
      input.checked = effect_activ;
      input.onchange = onoffSampler;
      sliderContainer.appendChild(label);

      effect_div.appendChild(sliderContainer);

      if (userParam.type !== "bool") {
        // PARAMS :
        let paramGUI = createParamGUI(param, param.name, userParam.type, effect_activ);
        // Store the slider and text by name so we can access them later
        let slider = paramGUI.slider;
        // uiElements[param.id] = { slider };
        // Add the slider element
        effect_div.appendChild(paramGUI.sliderContainer);
      }
    }
  });
  // Listen to parameter changes from the device
  // autoChangeGUI(device, uiElements);
}

function createParamGUI(param, effect_title, type, activ) {
  let sliderContainer = document.createElement("div");
  sliderContainer.setAttribute("name", effect_title + "div");
  sliderContainer.setAttribute("class", "div_slider");
  if (activ) {
    sliderContainer.style.display = "flex";
  } else {
    sliderContainer.style.display = "none";
  }
  let label = document.createElement("label");
  let slider = document.createElement("input");
  sliderContainer.appendChild(slider);
  // Add a name for the label
  label.setAttribute("name", param.name);
  label.setAttribute("for", param.name);
  label.setAttribute("class", "param-label");
  label.textContent = `${param.name}`;

  if (type == "bool") {
    slider.setAttribute("type", "checkbox");
    slider.setAttribute("class", "param-checkbox");
    slider.setAttribute("id", param.id);
    slider.setAttribute("name", param.name);
    slider.checked = (param.value = param.max) ? true : false;
    slider.addEventListener("change", () => {
      param.value = slider.checked ? param.max : param.min;
    });
  } else {
    // Make each slider reflect its parameter
    slider.setAttribute("type", "range");
    slider.setAttribute("class", "param-slider");
    slider.setAttribute("id", param.id);
    slider.setAttribute("name", param.name);
    slider.setAttribute("min", param.min);
    slider.setAttribute("max", param.max);
    if (param.steps > 1) {
      slider.setAttribute("step", (param.max - param.min) / (param.steps - 1));
    } else {
      slider.setAttribute("step", (param.max - param.min) / 1000.0);
    }
    slider.setAttribute("value", param.value);

    // Make each slider control its parameter
    slider.addEventListener("pointerdown", () => {
      isDraggingSlider = true;
    });
    slider.addEventListener("pointerup", () => {
      isDraggingSlider = false;
      slider.value = param.value;
    });
    slider.addEventListener("input", () => {
      let value = Number.parseFloat(slider.value);
      param.value = value;
    });
  }
  return { sliderContainer, slider };
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function onoffEffect(ev) {
  effects.find((t) => t.title === ev.target.id).activ = ev.target.checked;
  if (!ev.target.checked) {
    // TODO INITIALISATION
  }
  nodeConnection("auto");
  const divs = document.getElementsByName(ev.target.id + "div");
  divs.forEach((div) => {
    div.style.display = ev.target.checked ? "flex" : "none";
  });
}

function onoffSampler(ev) {
  switch (ev.target.id) {
    case "metro_speed":
      let sampler = effects.find((t) => t.name == "sampler");
      if (!ev.target.checked) {
        sampler.device.parameters.find((param) => param.name == "rand_play").value = 1.0;
        sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 1.0;
        setTimeout(() => {
          sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 0.0;
        }, 100.0);
      } else {
        sampler.device.parameters.find((param) => param.name == "rand_play").value = 0.0;
      }
      break;
    default:
      if (!ev.target.checked) {
        let sampler = effects.find((t) => t.name == "sampler");
        sampler.device.parameters.find((t) => t.name == ev.target.id).value = sampler.userParams.find((t) => t.name == ev.target.id).defaultValue;
      }
      break;
  }
  const divs = document.getElementsByName(ev.target.id + "div");
  divs.forEach((div) => {
    div.style.display = ev.target.checked ? "flex" : "none";
  });
}

// function autoChangeGUI(device, uiElements){
//   device.parameterChangeEvent.subscribe(param => {
//     if (!isDraggingSlider){
//       try{
//           uiElements[param.id].slider.value = param.value;
//       } catch (err){
//         console.log('UIELEMENTS err');
//         console.log(err);
//       }
//     }
//   });
// }

function nodeConnection(mode) {
  // TODO
  filter.gain.disconnect(0); // TODO
  analyser.disconnect(0);
  gain.disconnect(0);
  effects
    .filter((t) => t.activ == false)
    .forEach((effect) => {
      effect.gain.disconnect(0);
    });
  let f_effects = effects.filter((t) => t.activ == true);
  if (f_effects.length == 0) {
    filter.gain.connect(gain);
  } else if (f_effects.length == 1) {
    f_effects[0].gain.connect(gain);
    filter.gain.connect(f_effects[0].device.node);
  } else {
    f_effects[0].gain.connect(gain);
    for (let i = 1; i < f_effects.length; i++) {
      f_effects[i].gain.connect(f_effects[i - 1].device.node);
    }
    filter.gain.connect(f_effects[f_effects.length - 1].device.node);
  }
  gain.connect(analyser);
  analyser.connect(myPeer);
  analyser.connect(context.destination);
}

let recTimeCount = 0;
function recfunction(ev) {
  let sampler = effects.find((t) => t.name == "sampler");
  if (btn_rec.style.backgroundColor == "transparent" && recTimeCount == 0) {
    streamVisualizer4Clients.setColor("red");
    recTimeCount = Date.now();
    btn_rec.style.backgroundColor = "#FF0000";
    effectsPan.style.display = "none";
    gainPan.style.display = "none";
    btn_effects.style.background = "transparent";
    sampler.activ = true;
    sampler.device.parameters.find((param) => param.name == "size").value = sampler.userParams.find((t) => t.name == "size").defaultValue;
    sampler.device.parameters.find((param) => param.name == "clear_buf").value = 1.0;
    sampler.device.parameters.find((param) => param.name == "rec").value = 1.0;
    document.getElementById("sampler_div").style.display = "flex";
    rec.style.display = "none";
    trash.style.display = "none";
    mystop.style.display = "inline";
    filter.gain.disconnect(0);
    analyser.disconnect(0);
    effects.forEach((effect) => {
      effect.gain.disconnect();
    });
    filter.gain.connect(analyser);
    analyser.connect(sampler.device.node);
    sampler.gain.connect(myPeer);

    timer_rec = setTimeout(() => {
      sampler.gain.disconnect();
      streamVisualizer4Clients.setColor("white");
      sampler.device.parameters.find((param) => param.name == "rand_play").value = 1.0;
      sampler.device.parameters.find((param) => param.name == "out_gain").value = 1.0;
      sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 0.0;
      sampler.device.parameters.find((param) => param.name == "rec").value = 0.0;
      btn_rec.style.backgroundColor = "#5c5c5c";
      rec.style.display = "none";
      trash.style.display = "inline";
      mystop.style.display = "none";
      recTimeCount = 0;
      document.getElementById("metro_speed").checked = false;
      const divs = document.getElementsByName("metro_speeddiv");
      divs.forEach((div) => {
        div.style.display = "none";
      });
      nodeConnection("auto");
    }, sampler.device.parameters.find((param) => param.name == "size").value * 1000.0);
  } else if (recTimeCount != 0) {
    sampler.gain.disconnect();
    streamVisualizer4Clients.setColor("white");
    rec.style.display = "none";
    trash.style.display = "inline";
    mystop.style.display = "none";
    clearTimeout(timer_rec);
    sampler.device.parameters.find((param) => param.name == "size").value = Math.floor((Date.now() - recTimeCount) / 1000);
    setTimeout(() => {
      sampler.device.parameters.find((param) => param.name == "rand_play").value = 1.0;
      sampler.device.parameters.find((param) => param.name == "out_gain").value = 1.0;
      sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 0.0;
      sampler.device.parameters.find((param) => param.name == "rec").value = 0.0;
      btn_rec.style.backgroundColor = "#5c5c5c";
      rec.style.display = "none";
      trash.style.display = "inline";
      mystop.style.display = "none";
      recTimeCount = 0;
      document.getElementById("metro_speed").checked = false;
      const divs = document.getElementsByName("metro_speeddiv");
      divs.forEach((div) => {
        div.style.display = "none";
      });
      nodeConnection("auto");
    }, 100.0);
  } else {
    streamVisualizer4Clients.setColor("white");
    sampler.gain.disconnect();
    recTimeCount = 0;
    clearTimeout(timer_rec);
    rec.style.display = "inline";
    trash.style.display = "none";
    mystop.style.display = "none";
    document.getElementById("sampler_div").style.display = "none";
    sampler.activ = false;
    sampler.device.parameters.find((param) => param.name == "rec").value = 0.0;
    sampler.device.parameters.find((param) => param.name == "clear_buf").value = 1.0;
    sampler.device.parameters.find((param) => param.name == "out_gain").value = 0.0;
    //sampler.device.parameters.find(param=>param.name=="rand_play").value = 0.0;
    sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 0.0;
    sampler.device.parameters.find((param) => param.name == "clear_buf").value = 1.0;
    btn_rec.style.background = "transparent";

    document.getElementById("metro_speed").checked = false;
    const divs = document.getElementsByName("metro_speeddiv");
    divs.forEach((div) => {
      div.style.display = "none";
    });
    nodeConnection("auto");
  }
  sampler.device.parameters.find((param) => param.name == "loop_start_point").value = 1.0;
  //nodeConnection("auto");
}

function set_insta(dir) {
  div0 = document.getElementById("sp_insta_el0");
  for (let i = 0; i < 10; i++) {
    let divN;
    if (i == 0) {
      divN = div0;
    } else {
      divN = div0.cloneNode(true);
      divN.setAttribute("id", `sp_insta_el${i}`);
      sp_insta.appendChild(divN);
    }
    let vid = divN.getElementsByTagName("video")[0];
    let like = divN.getElementsByClassName("sp_insta_el_like")[0];
    like.onclick = () => {
      let nolike = divN.getElementsByClassName("fa-heart")[0].style.display != "none";
      if (nolike) {
        if (sendChannel && sendChannel.readyState === "open")
          sendChannel.send(
            JSON.stringify({
              clientId: myID,
              event: "like",
              mess: `User #${myID.substring(0, 5)} like video${i}`,
            })
          );
        divN.getElementsByClassName("fa-heart")[0].style.display = "none";
        divN.getElementsByClassName("fa-heart")[1].style.display = "initial";
      } else {
        if (sendChannel && sendChannel.readyState === "open")
          sendChannel.send(
            JSON.stringify({
              clientId: myID,
              event: "dislike",
              mess: `User #${myID.substring(0, 5)} dislike video${i}`,
            })
          );
        divN.getElementsByClassName("fa-heart")[0].style.display = "initial";
        divN.getElementsByClassName("fa-heart")[1].style.display = "none";
      }
    };
    vid.src = `${dir}/video${Math.round(Math.random() * 59)}.mp4`;
    vid.playsInline = true;
    vid.muted = true;
    vid.autoplay = true;
    vid.loop = true;
    // vid.play().then(() => vid.pause());
    const audioSource = context.createMediaElementSource(vid);
    vid.addEventListener("click", function () {
      Array.from(document.getElementById("sp_insta").getElementsByTagName("video")).forEach((v) => (v.muted = true));
      vid.muted = !vid.muted;
      vid.currentTime = 0;
      if (vid.muted) {
        // vid.pause();
        divN.getElementsByClassName("fa-volume-high")[0].style.display = "none";
        divN.getElementsByClassName("fa-volume-xmark")[0].style.display = "initial";
        audioSource.disconnect();
      } else {
        // vid.play();
        if (sendChannel && sendChannel.readyState === "open")
          sendChannel.send(
            JSON.stringify({
              clientId: myID,
              event: `video${i}`,
              mess: `User #${myID.substring(0, 5)} is watching video${i}`,
            })
          );
        audioSource.connect(myPeer);
        audioSource.connect(context.destination);
        let audioSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "audio");
        audioSender.replaceTrack(myPeer.stream.getTracks()[0]);
        // let videoSender = rtcPeerConnection.getSenders().find((s) => s.track.kind === "video");
        // videoSender.replaceTrack(userCanvasStream.getTracks()[0]);
        divN.getElementsByClassName("fa-volume-high")[0].style.display = "initial";
        divN.getElementsByClassName("fa-volume-xmark")[0].style.display = "none";
      }
    });
  }
}

set_hack();
function set_hack() {
  const txt_hack = `You have 8 outdated formulae installed.
You can upgrade them with brew upgrade
or list them with brew outdated.
romainal@MonAL2 ~ % brew upgrade
==> Upgrading 8 outdated packages:
flyctl 0.3.39 -> 0.3.46
micropython 1.24.0 -> 1.24.1
sqlite 3.47.0 -> 3.47.1
nginx 1.27.2 -> 1.27.3
ca-certificates 2024-09-24 -> 2024-11-26
node 23.2.0_1 -> 23.3.0
python@3.11 3.11.10 -> 3.11.11
git 2.47.0 -> 2.47.1
==> Pouring sqlite--3.47.1.ventura.bottle.tar.gz
  /usr/local/Cellar/sqlite/3.47.1: 12 files, 4.9MB
==> Running 'brew cleanup sqlite'...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see 'man brew').
Removing: /usr/local/Cellar/sqlite/3.47.0... (12 files, 4.9MB)
Removing: /Users/romainal/Library/Caches/Homebrew/sqlite_bottle_manifest--3.47.0... (9.4KB)
Removing: /Users/romainal/Library/Caches/Homebrew/sqlite--3.47.0... (2.3MB)
==> Upgrading micropython
  1.24.0 -> 1.24.1 
==> Pouring micropython--1.24.1.ventura.bottle.tar.gz
  /usr/local/Cellar/micropython/1.24.1: 7 files, 1MB
==> Running 'brew cleanup micropython'...
Removing: /usr/local/Cellar/micropython/1.24.0... (7 files, 1MB)
Removing: /Users/romainal/Library/Caches/Homebrew/micropython_bottle_manifest--1.24.0... (9.5KB)
Removing: /Users/romainal/Library/Caches/Homebrew/micropython--1.24.0... (492.2KB)
==> Upgrading ca-certificates
  2024-09-24 -> 2024-11-26 
==> Pouring ca-certificates--2024-11-26.all.bottle.tar.gz
==> Regenerating CA certificate bundle from keychain, this may take a while...
  /usr/local/Cellar/ca-certificates/2024-11-26: 4 files, 239.4KB
==> Running 'brew cleanup ca-certificates'...
Removing: /usr/local/Cellar/ca-certificates/2024-09-24... (4 files, 237.4KB)
Removing: /Users/romainal/Library/Caches/Homebrew/ca-certificates_bottle_manifest--2024-09-24... (1.9KB)
Removing: /Users/romainal/Library/Caches/Homebrew/ca-certificates--2024-09-24... (132.6KB)
==> Upgrading nginx
  1.27.2 -> 1.27.3 
==> Pouring nginx--1.27.3.ventura.bottle.1.tar.gz
==> Caveats
Docroot is: /usr/local/var/www
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
nginx will load all files in /usr/local/etc/nginx/servers/.
To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon\ off\;
==> Summary
  /usr/local/Cellar/nginx/1.27.3: 27 files, 2.5MB
==> Running 'brew cleanup nginx'...
Removing: /usr/local/Cellar/nginx/1.27.2... (27 files, 2.5MB)
Removing: /Users/romainal/Library/Caches/Homebrew/nginx_bottle_manifest--1.27.2... (10KB)
Removing: /Users/romainal/Library/Caches/Homebrew/nginx--1.27.2... (1.4MB)
==> Upgrading node
  23.2.0_1 -> 23.3.0 
==> Pouring node--23.3.0.ventura.bottle.tar.gz
/usr/local/Cellar/node/23.3.0: 2,676 files, 88.2MB
==> Running 'brew cleanup node'...
Removing: /usr/local/Cellar/node/23.2.0_1... (2,676 files, 88.2MB)
Removing: /Users/romainal/Library/Caches/Homebrew/node_bottle_manifest--23.2.0_1... (16.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/node--23.2.0_1... (21.1MB)
==> Upgrading python@3.11
  3.11.10 -> 3.11.11 
==> Pouring python@3.11--3.11.11.ventura.bottle.tar.gz
==> /usr/local/Cellar/python@3.11/3.11.11/bin/python3.11 -Im ensurepip
==> /usr/local/Cellar/python@3.11/3.11.11/bin/python3.11 -Im pip install -v --no-index --upgrade --isolated --target=/usr/local/lib/python3.11/site-
==> Caveats
Python is installed as
  /usr/local/bin/python3.11
Unversioned and major-versioned symlinks 'python', 'python3', 'python-config', 'python3-config', 'pip', 'pip3', etc. pointing to
'python3.11', 'python3.11-config', 'pip3.11' etc., respectively, are installed into
  /usr/local/opt/python@3.11/libexec/bin
You can install Python packages with
  pip3.11 install <package>
They will install into the site-package directory
  /usr/local/lib/python3.11/site-packages
tkinter is no longer included with this formula, but it is available separately:
  brew install python-tk@3.11
gdbm ('dbm.gnu') is no longer included in this formula, but it is available separately:
  brew install python-gdbm@3.11
'dbm.ndbm' changed database backends in Homebrew Python 3.11.
If you need to read a database from a previous Homebrew Python created via 'dbm.ndbm',
you'll need to read your database using the older version of Homebrew Python and convert to another format.
'dbm' still defaults to 'dbm.gnu' when it is installed.
If you do not need a specific version of Python, and always want Homebrew's 'python3' in your PATH:
  brew install python3
For more information about Homebrew and Python, see: https://docs.brew.sh/Homebrew-and-Python
==> Summary
/usr/local/Cellar/python@3.11/3.11.11: 3,304 files, 61.3MB
==> Running 'brew cleanup python@3.11'...
Removing: /usr/local/Cellar/python@3.11/3.11.10... (3,304 files, 61.3MB)
Removing: /Users/romainal/Library/Caches/Homebrew/python@3.11_bottle_manifest--3.11.10... (28.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/python@3.11--3.11.10... (15MB)
==> Upgrading flyctl
  0.3.39 -> 0.3.46 
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡟⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡟⢁⠿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⢹⡉⢠⠟⢷⡀⢀⣴⣿⣦⣀⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠈⡏⠁⣠⡿⠛⠉⠁⢀⡼⡻⠛⡞⡷⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠚⢯⠟⠂⠀⢹⣞⡟⠁⡠⠔⢒⡾⡼⠁⠀⡇⣇⠀⠙⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠸⠀⠀⢠⡼⠻⡇⢸⢀⣴⣿⣱⠁⠀⢀⠇⡏⠑⢄⠀⠙⢧⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠋⠀⠀⠳⢌⣾⡷⠀⠁⠀⠀⡼⢀⣧⡀⠈⢣⡀⡼⠉⣷⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠉⢳⠤⠴⠟⠁⣰⣿⠛⢶⡄⠀⠀⠀⠀
⠀⠀⠀⢀⣤⠞⠉⠀⠀⢀⣾⡋⣻⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣦⣠⣴⡾⡟⠉⠣⡀⠹⡄⠀⠀⠀
⠀⣠⠞⠋⣽⠀⠀⠀⠀⠘⣿⣿⣿⣾⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⢸⠀⡇⠀⠀⣇⠀⢿⠀⠀⠀
⢰⠏⢿⡆⠸⡄⠀⠀⠀⠀⠈⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡜⢀⡞⣰⢧⡀⠀⢸⠀⠸⣆⣴⡆
⢸⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠿⢴⠿⠚⢇⠀⠳⣄⡀⠳⠤⢤⡾⠃
⠘⢧⡀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣄⠀⠈⠢⣄⡀⠉⠙⢻⠛⣧⠀
⠀⠀⠙⠒⠦⠼⠗⠒⠲⠦⢤⣀⠀⠀⠀⣀⣠⣶⠇⠀⠀⠀⠀⠀⠀⠀⠘⣦⣀⠀⠀⠉⢦⠀⢸⠀⢸⡆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⣠⠇⠈⢳⣄⠀⢸⢀⣾⠀⢸⠃
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⠀⠀⠀⠀⢴⣴⣚⡁⣀⡠⠊⣨⣧⡾⢫⠃⢀⡟⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠉⠓⡾⠓⢲⠋⠉⠁⠀⡎⢀⡾⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⡎⠀⠀⠀⠀⢇⣼⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⢣⠀⠀⠀⠀⠀⠉⣹⠇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⡀⠀⠓⠤⣀⣀⠤⣶⠟⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠓⠒⠒⠒⠒⠒⠒⠚⠋⠙⠲⠦⠤⠤⠶⠛⠁⠀⠀⠀
==> Pouring flyctl--0.3.46.ventura.bottle.tar.gz
==> Caveats
zsh completions have been installed to:
  /usr/local/share/zsh/site-functions
==> Summary
/usr/local/Cellar/flyctl/0.3.46: 13 files, 62.7MB
==> Running 'brew cleanup flyctl'...
Removing: /usr/local/Cellar/flyctl/0.3.39... (13 files, 62.9MB)
Removing: /Users/romainal/Library/Caches/Homebrew/flyctl_bottle_manifest--0.3.39... (7.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/flyctl--0.3.39... (20.9MB)
==> Upgrading git
  2.47.0 -> 2.47.1 
==> Pouring git--2.47.1.ventura.bottle.tar.gz
==> Caveats
The Tcl/Tk GUIs (e.g. gitk, git-gui) are now in the 'git-gui' formula.
Subversion interoperability (git-svn) is now in the 'git-svn' formula.
zsh completions and functions have been installed to:
  /usr/local/share/zsh/site-functions
==> Summary
/usr/local/Cellar/git/2.47.1: 1,685 files, 54.6MB
==> Running 'brew cleanup git'...
Removing: /usr/local/Cellar/git/2.47.0... (1,684 files, 54.6MB)
Removing: /Users/romainal/Library/Caches/Homebrew/git_bottle_manifest--2.47.0... (14.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/git--2.47.0... (19.9MB)
==> Caveats
==> nginx
Docroot is: /usr/local/var/www
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
nginx will load all files in /usr/local/etc/nginx/servers/.
To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon\ off\;
==> python@3.11
Python is installed as
  /usr/local/bin/python3.11
Unversioned and major-versioned symlinks 'python', 'python3', 'python-config', 'python3-config', 'pip', 'pip3', etc. pointing to
'python3.11', 'python3.11-config', 'pip3.11' etc., respectively, are installed into
  /usr/local/opt/python@3.11/libexec/bin
You can install Python packages with
  pip3.11 install <package>
They will install into the site-package directory
  /usr/local/lib/python3.11/site-packages
tkinter is no longer included with this formula, but it is available separately:
  brew install python-tk@3.11
gdbm ('dbm.gnu') is no longer included in this formula, but it is available separately:
  brew install python-gdbm@3.11
'dbm.ndbm' changed database backends in Homebrew Python 3.11.
If you need to read a database from a previous Homebrew Python created via 'dbm.ndbm',
you'll need to read your database using the older version of Homebrew Python and convert to another format.
'dbm' still defaults to 'dbm.gnu' when it is installed.
If you do not need a specific version of Python, and always want Homebrew's 'python3' in your PATH:
  brew install python3
For more information about Homebrew and Python, see: https://docs.brew.sh/Homebrew-and-Python
==> flyctl
zsh completions have been installed to:
  /usr/local/share/zsh/site-functions
==> git
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣷⡀⣀⣠⡤⠤⠤⠤⠤⠤⣄⣀⡀⣴⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⢿⡿⠁⠀⠀⠀⣠⣤⣤⣄⠀⠀⠀⠀⢠⣤⣤⣄⡀⠀⠀⠀⢻⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠃⠀⠀⢀⣾⣿⣿⣿⡟⣀⣀⣀⣀⢸⣿⣿⣿⣷⡄⠀⠀⠀⣧⡀⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⡟⠀⠀⠀⢸⣿⣿⣿⡏⠘⢿⣿⣿⣿⠏⠙⣿⣿⣿⡇⢀⣴⣾⡿⢿⡿⢿⣶⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⣶⣄⠀⠀⠻⣿⠿⠃⠠⣀⣨⣏⣀⡀⠀⠻⠿⡿⠁⢸⣿⣹⡷⠿⠿⢿⣍⣿⡇⠀⠀⠀⠀
⣀⣀⣀⣀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣘⣿⣿⣄⣀⣀⣀⣿⣿⣇⣀⣀⣀⣤
⠀⠀⠀⠀⠘⠿⢿⣿⣿⣿⣿⣿⠿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
The Tcl/Tk GUIs (e.g. gitk, git-gui) are now in the 'git-gui' formula.
Subversion interoperability (git-svn) is now in the 'git-svn' formula.
zsh completions and functions have been installed to:
  /usr/local/share/zsh/site-functions
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/manifests/3.47.1
==> Fetching sqlite
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/blobs/sha256:3ec83a8caed77476623d709d6d980698f09c0fb267907a2bf8323e6fc5b8439b
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/manifests/1.24.1
==> Fetching micropython
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/blobs/sha256:6601736a89957321cdb26111f3d6da67575ee7a5324b1af791cf2370240b259b
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/manifests/2024-11-26
==> Fetching ca-certificates
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/blobs/sha256:7a3b5f75ca44d330e0f37432af09f58e37bfa873f25d340dece3c3e6c7927657
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/manifests/1.27.3-1
==> Fetching nginx
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/blobs/sha256:a522ff78dbf7156230cac0fe298d93fc7fc841650290722caf435513c15476be
==> Downloading https://ghcr.io/v2/homebrew/core/node/manifests/23.3.0
==> Fetching node
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⣿⠀⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⠿⠿⠿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣶⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣾⣿⣶⣶⣤⡀⠀⠀v
⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠘⢿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠈⠻⣿⣿⣿⣿⣆⠀⠀⠀⢀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⣀⣤⣶⣶⣌⠻⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⠁⣰⣿⣿⣿⣿⣿⣦⣙⢿⣿⣿⣿⠄⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⡿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣦⣹⣟⣫⣼⣿⣿⣶⣿⣿⣿⣿⣿⣿⣯⡉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⡆⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡇⠀⢻⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣠⣴⣶⣶⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⡇⠀⠸⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢰⣶⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣧⣄⣐⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠉⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠁⠛⠛⠛⠛⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
==> Downloading https://ghcr.io/v2/homebrew/core/node/blobs/sha256:28a491eda835e37fed1f69d12c5967d86c25d5e8aa43c4c5664c6f042d8f6fa7
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/manifests/3.11.11
==> Fetching python@3.11
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/blobs/sha256:ee9aaacdb633337b49e6294d76317bcbfbab475b6f220f2ee62e67353250c8a6
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/manifests/0.3.46
==> Fetching flyctl
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/blobs/sha256:3b7de3da2e6243d4af5035bce6f93055e4883f2277ae7c8722c149f8c45f4b72
==> Downloading https://ghcr.io/v2/homebrew/core/git/manifests/2.47.1
==> Fetching git
==> Downloading https://ghcr.io/v2/homebrew/core/git/blobs/sha256:aaa8aee7e2147287d742c407139fad74126ef2d97fc13655657f9bd511b1c818
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/manifests/3.47.1
==> Fetching sqlite
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/blobs/sha256:3ec83a8caed77476623d709d6d980698f09c0fb267907a2bf8323e6fc5b8439b
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/manifests/1.24.1
==> Fetching micropython
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/blobs/sha256:6601736a89957321cdb26111f3d6da67575ee7a5324b1af791cf2370240b259b
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/manifests/2024-11-26
==> Fetching ca-certificates
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/blobs/sha256:7a3b5f75ca44d330e0f37432af09f58e37bfa873f25d340dece3c3e6c7927657
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/manifests/1.27.3-1
==> Fetching nginx
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/blobs/sha256:a522ff78dbf7156230cac0fe298d93fc7fc841650290722caf435513c15476be
==> Downloading https://ghcr.io/v2/homebrew/core/node/manifests/23.3.0
==> Fetching node
==> Downloading https://ghcr.io/v2/homebrew/core/node/blobs/sha256:28a491eda835e37fed1f69d12c5967d86c25d5e8aa43c4c5664c6f042d8f6fa7
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/manifests/3.11.11
==> Fetching python@3.11
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/blobs/sha256:ee9aaacdb633337b49e6294d76317bcbfbab475b6f220f2ee62e67353250c8a6
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/manifests/0.3.46
==> Fetching flyctl
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/blobs/sha256:3b7de3da2e6243d4af5035bce6f93055e4883f2277ae7c8722c149f8c45f4b72
==> Downloading https://ghcr.io/v2/homebrew/core/git/manifests/2.47.1
==> Fetching git
==> Downloading https://ghcr.io/v2/homebrew/core/git/blobs/sha256:aaa8aee7e2147287d742c407139fad74126ef2d97fc13655657f9bd511b1c818
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/manifests/3.47.1
==> Fetching sqlite
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/blobs/sha256:3ec83a8caed77476623d709d6d980698f09c0fb267907a2bf8323e6fc5b8439b
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/manifests/1.24.1
==> Fetching micropython
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/blobs/sha256:6601736a89957321cdb26111f3d6da67575ee7a5324b1af791cf2370240b259b
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/manifests/2024-11-26
==> Fetching ca-certificates
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/blobs/sha256:7a3b5f75ca44d330e0f37432af09f58e37bfa873f25d340dece3c3e6c7927657
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/manifests/1.27.3-1
==> Fetching nginx
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/blobs/sha256:a522ff78dbf7156230cac0fe298d93fc7fc841650290722caf435513c15476be
==> Downloading https://ghcr.io/v2/homebrew/core/node/manifests/23.3.0
==> Fetching node
==> Downloading https://ghcr.io/v2/homebrew/core/node/blobs/sha256:28a491eda835e37fed1f69d12c5967d86c25d5e8aa43c4c5664c6f042d8f6fa7
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/manifests/3.11.11
==> Fetching python@3.11
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/blobs/sha256:ee9aaacdb633337b49e6294d76317bcbfbab475b6f220f2ee62e67353250c8a6
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/manifests/0.3.46
==> Fetching flyctl
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/blobs/sha256:3b7de3da2e6243d4af5035bce6f93055e4883f2277ae7c8722c149f8c45f4b72
==> Downloading https://ghcr.io/v2/homebrew/core/git/manifests/2.47.1
==> Fetching git
==> Downloading https://ghcr.io/v2/homebrew/core/git/blobs/sha256:aaa8aee7e2147287d742c407139fad74126ef2d97fc13655657f9bd511b1c818
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/manifests/3.47.1
==> Fetching sqlite
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/blobs/sha256:3ec83a8caed77476623d709d6d980698f09c0fb267907a2bf8323e6fc5b8439b
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/manifests/1.24.1
⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣴⣿⣿⠿⣟⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣏⡏⠀⠀⠀⢣⢻⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣟⠧⠤⠤⠔⠋⠀⢿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⡆⠀⠀⠀⠀⠀⠸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⣿⡀⢀⣶⠤⠒⠀⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢹⣧⠀⠀⠀⠀⠀⠈⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⡆⠀⠀⠀⠀⠀⠈⢿⣆⣠⣤⣤⣤⣤⣴⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣾⢿⢿⠀⠀⠀⢀⣀⣀⠘⣿⠋⠁⠀⠙⢇⠀⠀⠙⢿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣾⢇⡞⠘⣧⠀⢖⡭⠞⢛⡄⠘⣆⠀⠀⠀⠈⢧⠀⠀⠀⠙⢿⣄⠀⠀⠀⠀
⠀⠀⣠⣿⣛⣥⠤⠤⢿⡄⠀⠀⠈⠉⠀⠀⠹⡄⠀⠀⠀⠈⢧⠀⠀⠀⠈⠻⣦⠀⠀⠀
⠀⣼⡟⡱⠛⠙⠀⠀⠘⢷⡀⠀⠀⠀⠀⠀⠀⠹⡀⠀⠀⠀⠈⣧⠀⠀⠀⠀⠹⣧⡀⠀
⢸⡏⢠⠃⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠘⣧⠀⠀⠀⠀⠸⣷⡀
⠸⣧⠘⡇⠀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠀⠀⠀⢣⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⣿⠇
⠀⣿⡄⢳⠀⠀⠀⠀⠀⠀⠀⠈⣷⠀⠀⠀⠀⠀⠀⠈⠆⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠀
⠀⢹⡇⠘⣇⠀⠀⠀⠀⠀⠀⠰⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⣼⡟⠀⠀
⠀⢸⡇⠀⢹⡆⠀⠀⠀⠀⠀⠀⠙⠁⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⢳⣼⠟⠀⠀⠀
⠀⠸⣧⣀⠀⢳⡀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⢃⠀⢀⣴⡿⠁⠀⠀⠀⠀
⠀⠀⠈⠙⢷⣄⢳⡀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠀⠀⣠⡿⠟⠛⠉⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⢿⣷⣦⣄⣀⣀⣠⣤⠾⠷⣦⣤⣤⡶⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
==> Fetching micropython
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/blobs/sha256:6601736a89957321cdb26111f3d6da67575ee7a5324b1af791cf2370240b259b
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/manifests/2024-11-26
==> Fetching ca-certificates
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/blobs/sha256:7a3b5f75ca44d330e0f37432af09f58e37bfa873f25d340dece3c3e6c7927657
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/manifests/1.27.3-1
==> Fetching nginx
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/blobs/sha256:a522ff78dbf7156230cac0fe298d93fc7fc841650290722caf435513c15476be
==> Downloading https://ghcr.io/v2/homebrew/core/node/manifests/23.3.0
==> Fetching node
==> Downloading https://ghcr.io/v2/homebrew/core/node/blobs/sha256:28a491eda835e37fed1f69d12c5967d86c25d5e8aa43c4c5664c6f042d8f6fa7
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/manifests/3.11.11
==> Fetching python@3.11
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/blobs/sha256:ee9aaacdb633337b49e6294d76317bcbfbab475b6f220f2ee62e67353250c8a6
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/manifests/0.3.46
==> Fetching flyctl
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/blobs/sha256:3b7de3da2e6243d4af5035bce6f93055e4883f2277ae7c8722c149f8c45f4b72
==> Downloading https://ghcr.io/v2/homebrew/core/git/manifests/2.47.1
==> Fetching git
==> Downloading https://ghcr.io/v2/homebrew/core/git/blobs/sha256:aaa8aee7e2147287d742c407139fad74126ef2d97fc13655657f9bd511b1c818
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/manifests/3.47.1
==> Fetching sqlite
==> Downloading https://ghcr.io/v2/homebrew/core/sqlite/blobs/sha256:3ec83a8caed77476623d709d6d980698f09c0fb267907a2bf8323e6fc5b8439b
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/manifests/1.24.1
==> Fetching micropython
==> Downloading https://ghcr.io/v2/homebrew/core/micropython/blobs/sha256:6601736a89957321cdb26111f3d6da67575ee7a5324b1af791cf2370240b259b
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/manifests/2024-11-26
==> Fetching ca-certificates
==> Downloading https://ghcr.io/v2/homebrew/core/ca-certificates/blobs/sha256:7a3b5f75ca44d330e0f37432af09f58e37bfa873f25d340dece3c3e6c7927657
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/manifests/1.27.3-1
==> Fetching nginx
==> Downloading https://ghcr.io/v2/homebrew/core/nginx/blobs/sha256:a522ff78dbf7156230cac0fe298d93fc7fc841650290722caf435513c15476be
==> Downloading https://ghcr.io/v2/homebrew/core/node/manifests/23.3.0
==> Fetching node
==> Downloading https://ghcr.io/v2/homebrew/core/node/blobs/sha256:28a491eda835e37fed1f69d12c5967d86c25d5e8aa43c4c5664c6f042d8f6fa7
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/manifests/3.11.11
==> Fetching python@3.11
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.11/blobs/sha256:ee9aaacdb633337b49e6294d76317bcbfbab475b6f220f2ee62e67353250c8a6
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/manifests/0.3.46
==> Fetching flyctl
==> Downloading https://ghcr.io/v2/homebrew/core/flyctl/blobs/sha256:3b7de3da2e6243d4af5035bce6f93055e4883f2277ae7c8722c149f8c45f4b72
==> Downloading https://ghcr.io/v2/homebrew/core/git/manifests/2.47.1
==> Fetching git
==> Downloading https://ghcr.io/v2/homebrew/core/git/blobs/sha256:aaa8aee7e2147287d742c407139fad74126ef2d97fc13655657f9bd511b1c818
==> Upgrading sqlite
  3.47.0 -> 3.47.1 
==> Pouring sqlite--3.47.1.ventura.bottle.tar.gz
  /usr/local/Cellar/sqlite/3.47.1: 12 files, 4.9MB
==> Running 'brew cleanup sqlite'...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see 'man brew').
Removing: /usr/local/Cellar/sqlite/3.47.0... (12 files, 4.9MB)
Removing: /Users/romainal/Library/Caches/Homebrew/sqlite_bottle_manifest--3.47.0... (9.4KB)
Removing: /Users/romainal/Library/Caches/Homebrew/sqlite--3.47.0... (2.3MB)
==> Upgrading micropython
  1.24.0 -> 1.24.1 
==> Pouring micropython--1.24.1.ventura.bottle.tar.gz
  /usr/local/Cellar/micropython/1.24.1: 7 files, 1MB
==> Running 'brew cleanup micropython'...
Removing: /usr/local/Cellar/micropython/1.24.0... (7 files, 1MB)
Removing: /Users/romainal/Library/Caches/Homebrew/micropython_bottle_manifest--1.24.0... (9.5KB)
Removing: /Users/romainal/Library/Caches/Homebrew/micropython--1.24.0... (492.2KB)
==> Upgrading ca-certificates
⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣠⣤⣤⣼⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠘⣿⣿⣿⣿⠟⠁⠀⠀⠀⠹⣿⣿⣿⣿⣿⠟⠁⠀⠀⠹⣿⣿⡿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⡇⠀⠀⠀⢼⣿⠀⢿⣿⣿⣿⣿⠀⣾⣷⠀⠀⢿⣿⣷⠀⠀⠀⠀⠀
⠀⠀⠀⢠⣿⣿⣿⣷⡀⠀⠀⠈⠋⢀⣿⣿⣿⣿⣿⡀⠙⠋⠀⢀⣾⣿⣿⠀⠀⠀⠀⠀
⢀⣀⣀⣀⣿⣿⣿⣿⣿⣶⣶⣶⣶⣿⣿⣿⣿⣾⣿⣷⣦⣤⣴⣿⣿⣿⣿⣤⠤⢤⣤⡄
⠈⠉⠉⢉⣙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣀⣀⣀⡀⠀
⠐⠚⠋⠉⢀⣬⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣥⣀⡀⠈⠀⠈⠛
⠀⠀⠴⠚⠉⠀⠀⠀⠉⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠋⠁⠀⠀⠀⠉⠛⠢⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
  2024-09-24 -> 2024-11-26 
==> Pouring ca-certificates--2024-11-26.all.bottle.tar.gz
==> Regenerating CA certificate bundle from keychain, this may take a while...
  /usr/local/Cellar/ca-certificates/2024-11-26: 4 files, 239.4KB
==> Running 'brew cleanup ca-certificates'...
Removing: /usr/local/Cellar/ca-certificates/2024-09-24... (4 files, 237.4KB)
Removing: /Users/romainal/Library/Caches/Homebrew/ca-certificates_bottle_manifest--2024-09-24... (1.9KB)
Removing: /Users/romainal/Library/Caches/Homebrew/ca-certificates--2024-09-24... (132.6KB)
==> Upgrading nginx
  1.27.2 -> 1.27.3 
==> Pouring nginx--1.27.3.ventura.bottle.1.tar.gz
==> Caveats
Docroot is: /usr/local/var/www
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
nginx will load all files in /usr/local/etc/nginx/servers/.
To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon\ off\;
==> Summary
  /usr/local/Cellar/nginx/1.27.3: 27 files, 2.5MB
==> Running 'brew cleanup nginx'...
Removing: /usr/local/Cellar/nginx/1.27.2... (27 files, 2.5MB)
Removing: /Users/romainal/Library/Caches/Homebrew/nginx_bottle_manifest--1.27.2... (10KB)
Removing: /Users/romainal/Library/Caches/Homebrew/nginx--1.27.2... (1.4MB)
==> Upgrading node
  23.2.0_1 -> 23.3.0 
==> Pouring node--23.3.0.ventura.bottle.tar.gz
/usr/local/Cellar/node/23.3.0: 2,676 files, 88.2MB
==> Running 'brew cleanup node'...
Removing: /usr/local/Cellar/node/23.2.0_1... (2,676 files, 88.2MB)
Removing: /Users/romainal/Library/Caches/Homebrew/node_bottle_manifest--23.2.0_1... (16.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/node--23.2.0_1... (21.1MB)
==> Upgrading python@3.11
  3.11.10 -> 3.11.11 
==> Pouring python@3.11--3.11.11.ventura.bottle.tar.gz
==> /usr/local/Cellar/python@3.11/3.11.11/bin/python3.11 -Im ensurepip
==> /usr/local/Cellar/python@3.11/3.11.11/bin/python3.11 -Im pip install -v --no-index --upgrade --isolated --target=/usr/local/lib/python3.11/site-
==> Caveats
Python is installed as
  /usr/local/bin/python3.11
Unversioned and major-versioned symlinks 'python', 'python3', 'python-config', 'python3-config', 'pip', 'pip3', etc. pointing to
'python3.11', 'python3.11-config', 'pip3.11' etc., respectively, are installed into
  /usr/local/opt/python@3.11/libexec/bin
You can install Python packages with
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡀⠀⠀⠀⠀⠀⣿⣿⠇⠀⠀⠀⣴⣶⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀⠀⠀⠀⣾⣯⠀⠀⠀⠀⣿⣿⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⡀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⣾⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⣹⣿⠀⠀⠀⠀⣿⡟⠀⠀⠀⠀⣠⣦
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣧⠀⠀⠀⠀⢻⣿⠀⠀⠀⢀⣿⠇⠀⠀⠀⠠⣿⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⡄⠀⠀⠀⠀⠁⠀⠀⠀⠿⠟⠀⠀⠀⢀⣼⡟⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡿⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣶⣶⣿⣶⣄⣀⠀⠀⠀⠀⢸⡟⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⡈⠀⠀⠀⠀
⣴⣶⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀
⠹⣿⣿⣿⡆⠀⠀⠀⠀⠀⢀⣤⣿⣿⡿⠀⠉⠉⢁⣾⣿⣽⣿⣿⡟⠀⠀⠀⠀⠀
⠀⠈⠻⣿⣧⡄⠀⠀⠀⠀⣨⣿⣿⢿⣿⠀⠀⠀⢨⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠙⠁⠀⣀⠀⣈⣿⣿⣿⣾⣿⣦⡀⠀⢸⣿⣿⣿⣿⣿⡗⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⠿⠿⠿⠛⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀
  pip3.11 install <package>
They will install into the site-package directory
  /usr/local/lib/python3.11/site-packages
tkinter is no longer included with this formula, but it is available separately:
  brew install python-tk@3.11
gdbm ('dbm.gnu') is no longer included in this formula, but it is available separately:
  brew install python-gdbm@3.11
'dbm.ndbm' changed database backends in Homebrew Python 3.11.
If you need to read a database from a previous Homebrew Python created via 'dbm.ndbm',
you'll need to read your database using the older version of Homebrew Python and convert to another format.
'dbm' still defaults to 'dbm.gnu' when it is installed.
If you do not need a specific version of Python, and always want Homebrew's 'python3' in your PATH:
  brew install python3
For more information about Homebrew and Python, see: https://docs.brew.sh/Homebrew-and-Python
==> Summary
/usr/local/Cellar/python@3.11/3.11.11: 3,304 files, 61.3MB
==> Running 'brew cleanup python@3.11'...
Removing: /usr/local/Cellar/python@3.11/3.11.10... (3,304 files, 61.3MB)
Removing: /Users/romainal/Library/Caches/Homebrew/python@3.11_bottle_manifest--3.11.10... (28.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/python@3.11--3.11.10... (15MB)
==> Upgrading flyctl
  0.3.39 -> 0.3.46 
==> Pouring flyctl--0.3.46.ventura.bottle.tar.gz
==> Caveats
zsh completions have been installed to:
  /usr/local/share/zsh/site-functions
==> Summary
/usr/local/Cellar/flyctl/0.3.46: 13 files, 62.7MB
==> Running 'brew cleanup flyctl'...
Removing: /usr/local/Cellar/flyctl/0.3.39... (13 files, 62.9MB)
Removing: /Users/romainal/Library/Caches/Homebrew/flyctl_bottle_manifest--0.3.39... (7.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/flyctl--0.3.39... (20.9MB)
==> Upgrading git
  2.47.0 -> 2.47.1 
==> Pouring git--2.47.1.ventura.bottle.tar.gz
==> Caveats
The Tcl/Tk GUIs (e.g. gitk, git-gui) are now in the 'git-gui' formula.
Subversion interoperability (git-svn) is now in the 'git-svn' formula.
zsh completions and functions have been installed to:
  /usr/local/share/zsh/site-functions
==> Summary
/usr/local/Cellar/git/2.47.1: 1,685 files, 54.6MB
==> Running 'brew cleanup git'...
Removing: /usr/local/Cellar/git/2.47.0... (1,684 files, 54.6MB)
Removing: /Users/romainal/Library/Caches/Homebrew/git_bottle_manifest--2.47.0... (14.2KB)
Removing: /Users/romainal/Library/Caches/Homebrew/git--2.47.0... (19.9MB)
==> Caveats
==> nginx
Docroot is: /usr/local/var/www
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
nginx will load all files in /usr/local/etc/nginx/servers/.
To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon\ off\;
==> python@3.11
Python is installed as
  /usr/local/bin/python3.11
Unversioned and major-versioned symlinks 'python', 'python3', 'python-config', 'python3-config', 'pip', 'pip3', etc. pointing to
'python3.11', 'python3.11-config', 'pip3.11' etc., respectively, are installed into
  /usr/local/opt/python@3.11/libexec/bin
You can install Python packages with
  pip3.11 install <package>
They will install into the site-package directory
  /usr/local/lib/python3.11/site-packages
tkinter is no longer included with this formula, but it is available separately:
  brew install python-tk@3.11
gdbm ('dbm.gnu') is no longer included in this formula, but it is available separately:
  brew install python-gdbm@3.11
'dbm.ndbm' changed database backends in Homebrew Python 3.11.
If you need to read a database from a previous Homebrew Python created via 'dbm.ndbm',
you'll need to read your database using the older version of Homebrew Python and convert to another format.
'dbm' still defaults to 'dbm.gnu' when it is installed.
If you do not need a specific version of Python, and always want Homebrew's 'python3' in your PATH:
  brew install python3
For more information about Homebrew and Python, see: https://docs.brew.sh/Homebrew-and-Python
==> flyctl
zsh completions have been installed to:
  /usr/local/share/zsh/site-functions
==> git
The Tcl/Tk GUIs (e.g. gitk, git-gui) are now in the 'git-gui' formula.
Subversion interoperability (git-svn) is now in the 'git-svn' formula.
zsh completions and functions have been installed to:
  /usr/local/share/zsh/site-functions

⠀⠀⠀⠀⠀⠀⠀Nicolas CANOT -  DJing
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Romain AL. - VJing
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣤⣤⣄⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⠀⠈⠉⠛⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⡼⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢦⣶⣶⣶⣦⣄⠀
⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣦
⠀⢀⣀⣀⡀⠀⠀⡿⠀⠀⢀⣴⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⡟
⢀⣿⣿⣿⣿⣦⣄⡇⠈⠋⢸⣿⣿⣯⣼⠏⠀⠀⠀⠀⠀⢀⣰⣦⣄⠀⠀⠀⠀⢹⡿⠋⠀
⠈⣿⣿⣿⣿⣿⣿⣿⠀⠀⢀⣙⠛⠛⠁⠀⠀⣦⣤⡀⠀⣾⡟⣿⣿⣷⠀⠀⠀⢸⠂⠀⠀
⠀⠹⣿⣿⣿⣿⣿⣿⣧⡀⠉⠁⠀⠀⠀⠻⣤⣿⣉⣩⠀⠹⣷⣿⣿⡿⠀⠀⠀⣼⠀⠀⠀
⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠈⠉⠁⠀⠀⢨⡉⠉⠀⢸⠀⣼⠃⠀⠀⠀
⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⣀⠀⠀⠀⠀⠀⠀⠑⠆⠀⣠⡾⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠙⡟⠛⠻⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣿⣏⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢰⠃⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⣿⠈⠙⠛⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡗⠒⠶⠤⠤⣶⣶⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⠿⠿⠿⠃⠀⠀⠀⠀⠀⠀⠙⠿⠿⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
'`;
  let separateLines = txt_hack.split(/\r?\n|\r|\n/g);
  p = document.getElementById("sp_hacker");
  let time = 0;
  separateLines.forEach((l) => {
    time += Math.random() * Math.random() * Math.random() * Math.random() * 100;
    setTimeout(() => {
      p.innerText += l + "\n";
    }, time);
  });
}
