<script>
  
  import EtherButton from "./EtherButton.svelte";
  import { getModal } from './Modal.svelte';
  
  export let publish;
  
  let link, stake = 0.001, selectedType = "link", 
        extra = { linkText : "", imageLink : "" };



  const onSubmit = () => {
    document.getElementById("form").reportValidity()
    publish(link, selectedType, JSON.stringify(extra), stake.toString());
		()=>getModal().close()
  }

  const publicationTypes = [
    { type: "link", text: "Link"},
    { type: "image", text: "Image / Animation" },
    { type: "video", text: "Video"},
    { type: "iframe", text: "Iframe"},
  ]

</script>


<form id="form" action="#" on:submit|preventDefault>
  <ul>

    <li id="typeLi">
      <label for="pubType">Type:</label>
      <select id="pubType" bind:value={selectedType}>
        {#each publicationTypes as pubType}
        <option value={pubType.type}>
          {pubType.text}
        </option>
        {/each}
      </select>
    </li>
    
    <li>
      <input bind:value={link} placeholder="URL of the publication" type="url" required/>
    </li>

    
    { #if selectedType == "link" }

      <li>
        <input bind:value={extra.linkText} placeholder="Text for the link (optional)" type="text"/>
      </li>

    { :else if selectedType == "image"}
      
      <li>
          <input bind:value={extra.imageLink} placeholder="Image link (Optional)" type="url">
      </li>
      
    { /if }

    
  </ul>

  <ul>
    <li>
      <input bind:value={stake} type="number" placeholder="Bet value" min="0.001" step="0.0001" required/>
    </li>
  </ul>

  <EtherButton text="Connect" onClick={onSubmit}/>

</form>

<style>


  #typeLi {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2.8vh;
  }

  #typeLi > label {
    flex-grow: 1;
    margin-left: 1.5vw
  }


  label {
    font-size: 2.3vw;
    font-family: sans-serif;
  }


  select {
    /* margin-left: 2vw;
    margin-bottom: 2vh; */
    padding: 0.7vh 1.8vw;
    border-radius: 4vw;
    border: 0.2vw solid #0a131b;
    background-color: white;
    font-size: 2.1vw;
    flex-grow: 3;
    text-align: center;
  }


  select:focus {
    outline: none;
  }

  input {
    padding: 1.5vh 2vw;
    border-radius: 3vw;
    border: 0.3vw solid #0a131b;
    margin: 2vh auto;
    max-width: 75vw;
    font-size: 2.5vw;
  }

  input:focus {
    padding: 1.7vh 2.2vw;
    border-radius: 3vw;
    border: 0.3vw solid #0a131b;
    margin: 2vh auto;
    box-shadow: 0.0vw 0.0vh 0.9vw rgb(19, 16, 54);
    outline: none;
  }

  input:not(:placeholder-shown):invalid {
    box-shadow: inset 0 0 0.45vw #f00;
  }


  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 2.1vw
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    list-style-type: none;
    padding-left: 0;
    margin: 1vh auto;
  }

  ul:last-of-type {
    margin-bottom: 1.4vh;
  }


</style>
