<template>
  <div class="home">
    <div id="canvas"></div>
  </div>
</template>

<script>
export default {
  name: "home",
  mounted() {
    function setup(sketch) {
      sketch.background("green");
      sketch.text("Hello p5!", 20, 20);

      // Create/Draw the canvas out
      createCanvas(640, 480);

      // Read from the WebCam output videostream
      video = createCapture(VIDEO);
      // Size the video to the same size as the canvas
      video.size(640, 480);
      // Hide the video feed, only the AR overlayed videostream is displayed
      video.hide();

      // Use poseNet from ml5 lib to get user's poses
      // let poseNet = ml5.poseNet(video, modelReady);
      // poseNet.on('pose', getPoses);
      ml5.poseNet(video, modelReady).on("pose", getPoses);

      // Create the 2 buttons using p5.js
      pause_button = createButton("Pause");
      pause_button.mousePressed(pause_game);
      continue_button = createButton("Continue");
      continue_button.mousePressed(continue_game);
    }

    setup();
  }
};
</script>