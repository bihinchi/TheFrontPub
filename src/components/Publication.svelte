<script>
  export let pub;

  $: empty = pub === undefined || Object.keys(pub).length === 0 

  console.log("Publication:", pub);

</script>

<article>
  
  { #if empty }

    <span>No publications ¯\_(ツ)_/¯</span>

  { :else if pub.type == "link" }
    <a id="plainLink" href={pub.link} target="_blank" noopener noreferrer >
      { #if pub.extra && pub.extra.linkText }
        { pub.extra.linkText }
      { :else }
        { pub.link }
      { /if }
    </a>
  
  { :else if pub.type == "image"}

    { #if pub.extra && pub.extra.imageLink }
      <a href={pub.extra.imageLink} target="_blank" noopener noreferrer>
        <img src={pub.link} alt="Current publication">
      </a>  
    { :else }
      <img src={pub.link} alt="Current publication">
    { /if }


  { :else if pub.type == "video"}

    <video controls autoplay 
      src={pub.link}
      poster="https://cdn.drawception.com/images/panels/2012/3-30/9MS3sqCOzD-2.png">
      <track kind="captions">
    </video>
  
  { :else if pub.type == "iframe"}

    <iframe title="Current publication" src={pub.link}
      referrerpolicy="no-referrer"
      allowpaymentrequest
      allowfullscreen
    >
    </iframe>

  { /if }



</article>


<style>

  article {
    height: 70%;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #plainLink, span {
    overflow: auto;
    word-break:break-all;
    font-size: 3.5vw;
    max-width: 90%;
    max-height: 90%;
    margin: 2vw auto;
    min-width: 70vw;
    text-align: center;
  }

  article img {
    border-radius: 1%;
    box-shadow: 0.1vw 0.1vh 1.5vw black;
    max-width: 90vw;
    max-height: 76vh;
    min-width: 40vw;
    min-height: 40vh;
  }

  video {
    object-fit: cover;
    max-height: 100%;
    min-width: 65vw;
    width: auto;
    height: auto;
  }

  iframe {
    min-width: 100%;
    min-height: 100%;
    min-width: 90vw;
    min-height: 70vh;
    border: 0.4px solid #7e7d7d;
  }



</style>


