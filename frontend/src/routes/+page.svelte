<script lang="ts">
  /* Local_storage structure
    user: string
    messageLogs = [
      {
        id: number
        recipients: [username,username]
        message: [
          {
            timestamp: number
            sender: username
            content: string
          }
        ]
      }
    ]
  */

  import EncryptionUtils from "$lib/EncryptionUtils";
  import DeviceUtils from "$lib/DeviceUtils";
  import NetworkUtils from "$lib/NetworkUtils";

  //@ts-expect-error
  import * as io from "socket.io-client";
    import { onMount } from "svelte";
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
  DeviceUtils.local_data.set("user", "test")
  DeviceUtils.local_data.set("messageLogs", Array.from({ length: 15 }, (_, index) => ({
            recipient: `user ${index + 1}`,
            messages: [
              { timestamp: Date.now() - 960000, sender: `user ${index + 1}`, content: "Message 1 " + index  },
              { timestamp: Date.now() - 480000, sender: `you`,content: "Message 2 " + index },
              { timestamp: Date.now() - 240000, sender: `user ${index + 1}`, content: "Message 3 " + index },
              { timestamp: Date.now() - 120000, sender: `you`,content: "Message 4 " + index },
              { timestamp: Date.now() - 60000, sender: `user ${index + 1}`, content: "Message 5 " + index },
              { timestamp: Date.now() - 30000, sender: `you`,content: "Message 6 " + index },
              { timestamp: Date.now() - 15000, sender: `user ${index + 1}`, content: "Message 7 " + index },
              { timestamp: Date.now() - 7500, sender: `user ${index + 1}`, content: "Message 8 " + index },
              { timestamp: Date.now(), sender: `you`, content: "Current Message" }
            ]
        })));

  let validated = $state(false);

  const currentlySelected = 0;
  let messageLogs: {[x: string]: any}[] = $state(DeviceUtils.local_data.get("messageLogs")); 

  let messageInput: HTMLInputElement;

  function clickSend(event: any) {
    const content = messageInput.value;
  }

  onMount(async() => {
    await new Promise<void>((res) => setTimeout(() => {res()}, 250));

    messageInput = document.getElementById("messageInput") as HTMLInputElement;
    validated = await NetworkUtils.validateJwt(DeviceUtils.cookies.get("jwt") as string);
  });
</script>

<head>
  <title>NestJS - Home</title>
</head>

<page id="content">
  {#if validated}
    <div class="content" id="messageList">
      {#each messageLogs as log}
        <!-- svelte-ignore a11y_missing_attribute -->
        <a class="messageLog">
          <div class="messageLogRecipient">{log.recipient}</div>
          <p class="messageLogContent"><i class="fa-solid fa-envelope"></i>{log.messages[log.messages.length-1].content}</p>
        </a>
      {/each}
    </div>
    <span></span>
    <div class="content" id="chat">
      <div id="chatHistory">
        {#each messageLogs[currentlySelected]?.messages as message}
          <div class="message {(message.sender == 'you') ? 'right':''}">
            <div>
              <p class="messageSender">{message.sender}</p>
              <span></span>
              <p class="messageTimestamp">{message.timestamp}</p>
            </div>
            <p class="messageContent">{message.content}</p>
          </div>
        {/each}
      </div>
      <div id="chatToolbar">
        <input type="text" id="messageInput">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button onclick={clickSend} id="sendMessage"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  {:else}
    <div id="notlogg">
      <a href="/account">Log in.</a>
    </div>
  {/if}
</page>

<style>
  #notlogg {
    column-span: 2;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    padding: 20px;
  }

  #content {
    display: grid;
    grid-template-columns: 1fr 3px 2.5fr;
    grid-template-rows: 100%;
    width: min(90vw, 700px);
    height: min(80vh, 500px);
    border: 2px solid var(--fgColour);
    border-radius: 15px;
    padding: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
  }

  #messageList {
    height: 100%;
    overflow: scroll;
  }
  .messageLog {
    min-height: 55px;
    background:  var(--bgColour);
    border-bottom: 1px solid var(--fgColour);
    padding: 5px;
  }
  .messageLogRecipient {
    color: var(--hlColour);
    font-size: 1rem;
  }
  .messageLogContent {
    display: flex;  
    align-items: center;
    font-size: 0.8rem;
  }

  span {
    width: 2px;
    background-color: var(--fgColour);
  }




  

  #chatHistory {
    display: flex;
    flex-direction: column;
    gap: 2%;
    width: 100%;
    height: 90%;
    padding: 10px;
    overflow: scroll;
  }
  #chatHistory .right {
    background-color: var(--hlColour);
    color: var(--bgColour);
    margin-right: 0;
    margin-left: auto;
  }
  .message {
    min-height: 60px;
    margin-right: auto;
    width: clamp(10%, min-content, 80%);
    background-color: var(--fgColour);
    border-radius: 10px;
    padding: 2%;
  }

  .message div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    opacity: 0.6;
  }
  .message div * {
    font-size: 0.8rem;
  }




  #chatToolbar {
    height: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to top, var(--fgColour), transparent);
    border-radius: 15px 15px 0 0;
    padding: 1.5%;
  }

  #messageInput {
    width: 90%;
    outline: none;
    background-color: transparent;
    color: var(--txtColour);
    border: 1px solid var(--bgColour);
    border-bottom: 3px solid var(--bgColour);
    border-radius: 10px;
    padding: 1.5%;
    gap: 1%;
  }

  #sendMessage {
    transition: all 0.2s ease-in-out;
    width: 9%;
    background-color: transparent;
    border: 1px solid var(--bgColour);
    border-bottom: 3px solid var(--bgColour);
    border-radius: 10px;
    padding: 1.5%;
    color: var(--hlColour);
  }
  #sendMessage:hover {
    transform: translateY(-1px);
  }
  #sendMessage:active {
    transform: translateY(1px);
  }
</style>