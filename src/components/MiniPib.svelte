<script>
    export let pub;
  </script>
  
  
  <div class="center">
    { #if pub.type == "link" }
      <a class="plainLink" href={pub.link} target="_blank" rel="noopener noreferrer nofollow" >
        { #if pub.extra && pub.extra.linkText }
          { pub.extra.linkText }
        { :else }
          { pub.link }
        { /if }
      </a>
    
    { :else if pub.type == "image"}
  
      { #if pub.extra && pub.extra.imageLink }
        <a href={pub.extra.imageLink} target="_blank" rel="noopener noreferrer nofollow">
          <img src={pub.link} alt="history publication">
        </a>  
      { :else }
        <img src={pub.link} alt="history publication">
      { /if }
  
  
    { :else if pub.type == "video"}

      <span>Video of</span>
      <span>{pub.link}</span>
    
    { :else if pub.type == "iframe"}
      
      <span>Iframe of</span>
      <span>{pub.link}</span>
  
    { /if }
  
  
  
    </div>
  
  
  <style>

    div {
      flex-direction: column;
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

    .plainLink, span {
      overflow: auto;
      word-break:break-all;
      text-align: center;
      min-height: 3vh;
    }
  
    img {
      border-radius: 1%;
      max-width: 27vw;
      max-height: 28vh;
    }
  
    span {
      display: block;
    }

  
  </style>
  
  
  