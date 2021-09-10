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
          <img src={pub.link} alt="history publication">
        </a>  
      { :else }
        <img src={pub.link} alt="history publication">
      { /if }
  
  
  
    { :else if pub.type == "video"}
  
      <video controls autoplay 
        src={pub.link}
        poster="https://cdn.drawception.com/images/panels/2012/3-30/9MS3sqCOzD-2.png">
        <track kind="captions">
      </video>
    
    { :else if pub.type == "iframe"}
      
      <span>Iframe from</span>
      <span>{pub.link}</span>
  
    { /if }
  
  
  
    </div>
  
  
  <style>

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 12vh;  
      max-width: 36vw;
    }
  
    div * {
        max-width: 27vw;
        max-height: 28vh;  
    }

    div :not(a) :not(span) :not(p) {
        min-width: 28vw;
        min-height: 27vh;
    }

    #plainLink, span {
      overflow: auto;
      word-break:break-all;
      text-align: center;
      min-height: 3vh;
    }
  
    img {
      border-radius: 1%;
    }
  
    video {
      object-fit: cover;
    }
  
    span {
      display: block;
    }

  
  </style>
  
  
  