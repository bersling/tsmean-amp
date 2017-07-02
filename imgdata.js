const totalFrames = 127;

const formatNumber = function(i) {
  if (i < 10) {
    return '00' + i;
  } else if (i < 100) {
    return '0' + i;
  } else {
    return i.toString()
  }
}

const secondsToMs = function(s) {
  return Math.round(s * 1000);
}

for (var i = 0; i <= totalFrames; i++) {
  // console.log(`.pic${formatNumber(i)} {-webkit-animation-delay: ${secondsToMs(i/totalFrames * 5)}ms;}`)
  console.log(`.pic${formatNumber(i)} {animation-delay: ${secondsToMs(i/totalFrames * 5)}ms;}`)
}

for (var i = 0; i <= totalFrames; i++) {
  console.log(`{"numberstr": "${formatNumber(i)}"},`)
}
