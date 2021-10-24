const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "5000",
});

const socket = io("/");

const VideoGrid = document.getElementById("video-grid");
console.log(VideoGrid);
let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log("myVideoStream");
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  console.log(id);
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  console.log(userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  VideoGrid.append(video);
};

const muteUnmute = () => {
  console.log(myVideoStream);
  //   const enabled = myVideoStream.getAudioTracks()[0].enabled;
  //   if (enabled) {
  //     myVideoStream.getAudioTracks()[0].enabled = false;
  //   } else {
  //     myVideoStream.getAudioTracks()[0].enabled = true;
  //   }
};
