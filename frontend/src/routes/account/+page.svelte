<script lang="ts">
    import DeviceUtils from "$lib/DeviceUtils";
    import NetworkUtils from "$lib/NetworkUtils";
    import { onMount } from "svelte";

    let validated = $state(false);
    let status: HTMLElement|null;
    onMount(async() => {
        status = document.getElementById("status") as HTMLElement;
        validated = await NetworkUtils.validateJwt();
        console.log(5, validated)
    });
    let pass_shown = $state(false);

    function showPass() {
        pass_shown = !pass_shown;
        return null;
    };

    function updateStatus(text: string) {
        if (!status) return;
        status.textContent = text;
    };  

    async function submit() {
        const email = (document.getElementById("email") as any)?.value;
        const user = (document.getElementById("user") as any)?.value;
        const pass = (document.getElementById("pass") as any)?.value;
        if (!email || !user || !pass) return updateStatus("Please enter all required information.")

        const validation = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!validation) return updateStatus("Invalid Email Address.");

        const response = await NetworkUtils.accountUpsert(email, user, pass);
        if (!response[0]) return updateStatus("Invalid Account Credentials.");
        
        validated = true;
    };
</script>

<head>
    <title>Dayta / Account</title>
</head>
<page id="container">
    {#if validated}
        <p>You are logged in.</p>
    {:else}
        <p id="title">Ready for <span>Truely private communications</span>?</p>
        <p id="status">...</p>
        <div>
            <input placeholder="Enter Email." type="email" id="email">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <a id="emailDisclaimer"><i class="fa-solid fa-question"></i></a>
            <p> We ask for your email to prevent spam accounts.</p>
        </div>
        <div>
            <input placeholder="Enter Username." type="text" id="user">
        </div>
        <div>
            <input placeholder="Enter Password." type={(pass_shown) ? "text":"password"} id="pass">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <a onclick={showPass} id="emailDisclaimer"><i class="fa-solid {(pass_shown) ? "fa-eye":"fa-eye-slash"}"></i></a>
            <p> {(pass_shown) ? "Hide password?":"Show password?"} </p>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <a onclick={submit} id="submit">Login / Signup</a>
    {/if}
</page>

<style lang="scss">
    #title {
        font-size: 1.4rem !important;

        span {font-size: 1.4rem !important;
            background-color: transparent;
            color: var(--hlColour);
        }
    }
    #container {
        display: flex;
        flex-direction: column;
        grid-template-rows: 100%;
        width: min(90vw, 700px);
        height: min(80vh, 500px);
        border: 2px solid var(--fgColour);
        border-radius: 15px;
        padding: 2%;
        gap: 2%;
        
        * {
            font-size: 1.1rem;
        }

        #status {
            color: goldenrod;
            font-size: 0.8rem;
        }

        #submit {
            display: flex;
            justify-content: center;
            background-color: var(--fgColour);
            color: var(--hlColour);
            border: 1px solid var(--sdColour);
            border-radius: 10px;
            max-width: 40%;
            padding: 1%;
        }
        #submit:hover {
            transform: translateY(-1px);
        }
        #submit:active {
            transform: translateY(1px);
        }

        div {
            display: flex;
            align-items: center;
            gap: 1%;

            a, p {
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid var(--fgColour);
                border-radius: 10px;
                padding: 1%;
                min-width: 8%;
            }
            a:hover + p {
                opacity: 1;
            }
            p {
                font-size: 0.7rem;
                transition: all 0.2s ease-in-out;
                opacity: 0;
            }
        }
    }
</style>