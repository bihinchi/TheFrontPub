<script>
  export let pub;
</script>


<article>

  { #if pub.type == "link" }
    <a href={pub.link} target="_blank" noopener noreferrer >
      { #if pub.text }
        { pub.text }
      { :else }
        { pub.link }
      { /if }
      
    </a>
  
  { :else if pub.type == "image"}

    <img src={pub.link} alt="Current publication">

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
    height: 75%;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    overflow: auto;
    word-break:break-all;
    font-size: 3.5vw;
    max-width: 90%;
    max-height: 90%;
    margin: 2vw auto;
    min-width: 70vw;
    text-align: center;
  }

  img {
    border-radius: 1%;
    box-shadow: 0.1vw 0.1vh 1.5vw black;
    max-width: 100%;
    max-height: 100%;
    min-width: 75vw;
    height: auto;
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
    width: auto;
    height: auto;
    border: 0.4px solid #7e7d7d;
  }


</style>


