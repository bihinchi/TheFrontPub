<script>
    export let pub;
  </script>
  
  
  <div>
    { #if pub.type == "link" }
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
  
  
  
    </div>
  
  
  <style>

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 15vh;  
      max-width: 36vw;
    }
  
    div * {
        max-width: 35vw;
        max-height: 29vh;  
    }

    div :not(a) {
        min-width: 28vw;
        min-height: 27vh;
    }

    #plainLink {
      overflow: auto;
      word-break:break-all;
      text-align: center;
      min-height: 3vh;
    }
  
    img {
      border-radius: 1%;
      max-height: 76vh;
    }
  
    video {
      object-fit: cover;
      max-height: 100%;
    }
  
    iframe {
      border: 0.1px solid #7e7d7d;
    }
  
    
  
  </style>
  
  
  