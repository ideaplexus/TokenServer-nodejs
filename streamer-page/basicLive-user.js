var client; // Agora client
var localTracks = {
  videoTrack: null,
  audioTrack: null
};
var remoteUsers = {};
// Agora client options
var options = { 
  appid: "88b765a2930f40cf8d0a5790701f043b",
  channel: "datas",
  uid: "23213112",
  token: null,
  role: "audience" // host or audience
};

// the demo can auto join channel with params in url
$(() => {
  var urlParams = new URL(location.href).searchParams;
  options.appid = "88b765a2930f40cf8d0a5790701f043b"
  options.channel = "datas"
  options.token = "";

  options.role = "audience"
  token_url='/access_token?'+"channel=datas"+"&uid="+"23213112"
  $.get(token_url,  // url
  function (data, textStatus, jqXHR) {  // success callback
      // alert('status: ' + textStatus + ', data:' + data);
      console.log(window.location.pathname)
      console.log(token_url,data.token)
      options.token = data.token;     
    });
  
  
})

$("#host-join").click(function (e) {
  options.role = "host"
})

$("#audience-join").click(function (e) {
  options.role = "audience"
})

$("#join-form").submit(async function (e) {
  e.preventDefault();
  $("#host-join").attr("disabled", true);
  $("#audience-join").attr("disabled", true);
  try {
    // options.appid = $("#appid").val();
    // options.token = $("#token").val();
    // options.channel = $("#channel").val();
    await join();
  } catch (error) {
    console.error(error);
  } finally {
    if (options.role === "host") {
      $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
      $("#success-alert").css("display", "block");
    }
    $("#leave").attr("disabled", false);
  }
})

$("#leave").click(function (e) {
  leave();
})

async function join() {
  // create Agora client
  client = AgoraRTC.createClient({ mode: "live", codec: "h264", role: options.role });

  if (options.role === "audience") {
    // add event listener to play remote tracks when remote user publishs.
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
  }

  // join the channel
   await client.join(options.appid, options.channel, options.token ,options.uid );

  if (options.role === "host") {
    // create local audio and video tracks
    localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    // play local video track
    localTracks.videoTrack.play("local-player");
    $("#local-player-name").text(`localTrack(${options.uid})`);
    // publish local tracks to channel
    await client.publish(Object.values(localTracks));
    console.log("publish success");
  }
}

async function leave() {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if(track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }

  // remove remote users and player views
  remoteUsers = {};
  $("#remote-playerlist").html("");

  // leave the channel
  await client.leave();

  $("#local-player-name").text("");
  $("#host-join").attr("disabled", false);
  $("#audience-join").attr("disabled", false);
  $("#leave").attr("disabled", true);
  console.log("client leaves channel success");
}

async function subscribe(user) {
  const uid = user.uid;
  // subscribe to a remote user
  await client.subscribe(user, "all");
  console.log("subscribe success");
  const player = $(`
    <div id="player-wrapper-${uid}">
      <p class="player-name">remoteUser(${uid})</p>
      <div id="player-${uid}" class="player"></div>
    </div>
  `);
  $("#remote-playerlist").append(player);
  user.videoTrack.play(`player-${uid}`);
  user.audioTrack.play();
}

function handleUserPublished(user) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  $(`#player-wrapper-${id}`).remove();
}