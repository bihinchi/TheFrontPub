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

    <div id="iframe-wrapper">
    </div>

  { /if }



</article>


<style>

  article {
    height: 83%;
    width: auto;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1em;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto; 
    display: block;
    margin: auto;
  }

  video {
    object-fit: cover;
    max-height: 100%;
    width: auto;
    height: auto;
  }

  iframe {
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    border: 0.4px solid #7e7d7d;
  }


</style>


