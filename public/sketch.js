var textfield;
var output;
var output2;
var finalText;
var socket;
var textFinal;
let speechRec;

var rCho, rJung, rJong;
var sentence = []; //문장
var sepWord = [];
var t = 0;
var starting;

var counter = 0; // 유니티에서 수신된 문자의 순서 숫자
var dataText = []; //유니티에서 수신된 문자를 다시한번 저장할 부분
var clickCounter = 0; //유니티에서 몇번째 수어를 했는지 
let continuous = true;
let interimResults = false;

function setup() {
  // frameRate(60);
  rCho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  rJung = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  rJong = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];


  data = "";
  createCanvas(750, 1335);
  textfield = select("#haninput");
  textfield.input(newTyping);
  output = select('#output');
  output2 = select('#output2');

  speechRec = new p5.SpeechRec('ko-KR', gotSpeech);
  // let continuous = true;
  // let interimResults = false;
  speechRec.start(continuous, interimResults);
  function gotSpeech() {
    // console.log(speechRec);
    if (speechRec.resultValue) {
      let said = speechRec.resultString;
      // output.html(said);
      // console.log(said);
      // sendText(said);
      output2.html(said);
      speak(said);
      console.log("Finish", dataText.length);
      clickCounter = 0;
      starting = 1;
      // dataText = [];
    }
    // speak();
  }


  socket = io.connect('http://localhost:3000');
  //   socket = io.connect('http://165.194.69.166:3000');//Office Mac
  // socket = io.connect('http://192.168.0.112:3000');//Macbook Air
  //   socket = io.connect('http://192.168.0.101:3000');//Home Mac
  // socket = io.connect('http://124.49.164.19:3000');//Office Windows
  socket.on('message', function (data) {

    output2.html(data);
  }
  );
}


function newTyping() {
  output.html(textfield.value());
  finalText = textfield.value();
  // sendText(finalText);
}

function speak(textString) {
  counter = 0;
  var cho, jung, jong;
  sentence = textString;
  console.log(sentence);
  
 // write(data,sentence);
 // fputs(data,sentence);

  for (var i = 0; i < sentence.length; i++) {
    if (sentence[i] === " ") {

    } else {
      var nTmp = sentence[i].charCodeAt(0) - 0xac00;

      jong = nTmp % 28; // 종성
      jung = ((nTmp - jong) / 28) % 21; // 중성
      cho = ((nTmp - jong) / 28 - jung) / 21; // 초성

      if (cho >= 0 && cho <= 18) {
        sendText(rCho[cho]);
      }
      if (jung >= 0 && jung <= 20) {
        sendText(rJung[jung]);
      }
      if (jong > 0 && jong <= 27) {
        sendText(rJong[jong]);
      }

    }
  }
}

// function sendText(textString) {
//     var data = textString;
//     socket.emit('message', data);
//     // socket.emit('message', sentence);
// }
function sendText(textFinal) {
  dataText[counter] = textFinal; //유니티에서 수신된 문자를 array로 넣기 이때 counter = 0;
  console.log(dataText[counter], counter);
  // socket.emit('message', dataText[counter]);
  counter++; //다음 array로 숫자 올림
  // console.log(dataText[counter]);
}

// function mouseClicked(){ //유니티에서 수어 동작이라고 생각하고 코딩(내가 클릭하는 행위가 수어 마침이라고 생각)
//   speechRec.start(continuous, interimResults);
//   console.log(dataText[clickCounter]);//동작[몇번째 동작] //다음동작으로 숫자올림
//   clickCounter++;
// }

function draw() {
  if (starting === 1) {
    console.log(dataText[clickCounter], clickCounter);
    socket.emit('message', dataText[clickCounter]);
    //socket.emit('message', sentence);
    t++;
    clickCounter = t / 30;
    if (clickCounter > dataText.length) {
      t = 0;
      starting = 0;
      dataText = [];
    }
  }
}