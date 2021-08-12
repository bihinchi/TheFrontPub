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

    <div id="iframe-wrapper">
      <iframe title="Current publication" src={pub.link}></iframe>
    </div>

  { /if }


  <!-- <div id="content">
    <a id="advLink" target="_blank" rel="noopener noreferrer" href="">Advertisement link</a>
    <span id="advDescription"></span>
  </div> -->


</article>


<style>

  article {
    height: 80%;
    width: auto;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
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
    max-height: 80%;
    min-width: 60%;
    height: auto;
  }



  #iframe-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
  }

/* Then style the iframe to fit in the container div with full height and width */
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }


</style>


