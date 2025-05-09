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

  
</script>

<head>
  <title>NestJS - Home</title>
</head>

<page>

</page>

<style>

</style>