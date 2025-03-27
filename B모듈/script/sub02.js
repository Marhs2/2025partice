const video = $(".video > video").get(0);
const ctrlo = $(".control").get(0);
function videoCtrl() {
  // $("#play") = $("#play").is(":checked") ? "test2" : "test1";
  $(".video-ctrl").change(() => {
    $("#play").is(":checked") === true ? video.pause() :  video.play();
    $("#loop").is(":checked") === true ? video.loop = true  : video.loop = false;
    $("#autoplay").is(":checked") === true ? video.autoplay = true  : video.autoplay = false;
  });
  $("#hide").change(()=>{
    ctrlo.style.display= $("#hide").is(":checked") == true ?  "none" : "block"})    
  $(".back").on('click',()=>{video.currentTime -= 10;})
  $(".forward").on('click',()=>{video.currentTime += 10;})
  $(".10plus").on('click',()=>{video.playbackRate  -= 0.1;})
  $(".10minus").on('click',()=>{video.playbackRate  += 0.1;})
  $(".speed-Back").on('click',()=>{video.playbackRate  = 1})
}

function modal (){
  $(".buy").on('click',()=>{
    $(".modal").css("display", "block");
    $("body").css("overflow","hidden")
  })

  $(".modal-close").on('click',()=>{
    $(".modal").css("display", "none");
    $("body").css("overflow","visible")
  })
}


modal()
videoCtrl();
