<script lang="ts">
  import EncryptionUtils from "$lib/EncryptionUtils";
  import DeviceUtils from "$lib/DeviceUtils";
  import NetworkUtils from "$lib/NetworkUtils";

  //@ts-expect-error
  import * as io from "socket.io-client";
  let socket = io.connect(NetworkUtils.getWebSocketURL(), {
    transports: ['websocket'],
    timeout: 3000
  });

  socket.on('connect_error', (error: any) => {
    console.error('Connection error:', error);
  });
  socket.on('connect', async() => {
    console.log("Client connected to webserver.");

    
  });

  const messageLogs = [
    {
      recipient: "user 1",
      messages: [
        { timestamp: Date.now()-1000000, content: "Message 1"},
        { timestamp: Date.now()-10000, content: "Message 2"},
        { timestamp: Date.now(), content: "Current Message"}
      ]
    },
        {
      recipient: "user 2",
      messages: [
        { timestamp: Date.now()-1000000, content: "Message 1"},
        { timestamp: Date.now()-10000, content: "Message 2"},
        { timestamp: Date.now(), content: "Current Message"}
      ]
    }
  ];
</script>

<head>
  <title>NestJS - Home</title>
</head>

<page id="content">
  <div id="messageList">
    {#each messageLogs as log}
      <a class="messageLog">
        <div class="messageLogRecipient">{log.recipient}</div>
        <p class="messageLogContent"><i class="fa-solid fa-envelope"></i>{log.messages[log.messages.length-1].content}</p>
      </a>
    {/each}
  </div>
  <span></span>
  <div id="chat">
    <div id="chatHistory">
      <div id="messa">
        test
      </div>
    </div>
    <div id="chatToolbar">
      test
    </div>
  </div>
</page>

<style>
  #content {
    display: grid;
    grid-template-columns: 1fr 21px 2.5fr;
    grid-template-rows: 100%;
    width: min(90vw, 700px);
    height: min(80vh, 500px);
    border: 2px solid var(--fgColour);
    border-radius: 15px;
  }
  #content div {
    display: flex;
    flex-direction: column;
  }

  #messageList {
    height: 100%;
    gap: 1%;
  }
  .messageLog {
    background-color: var(--fgColour);
    border-radius: 10px;
    padding: 5px;
  }
  .messageLogRecipient {
    font-size: 1rem;
  }
  .messageLogContent {
    display: flex;  
    align-items: center;
    margin: 0;
    font-size: 0.8rem;
  }

  span {
    width: 1px;
    margin: 0 10px 0 10px;
    background-color: var(--fgColour);
  }

  #chatHistory {
    height: 90%;
  }
  #chatToolbar {
    height: 10%;
    background-color: var(--fgColour);
    border-radius: 15px;

  }
</style>