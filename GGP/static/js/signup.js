$(document).ready(function() {

if ($("form").hasClass("signup")) {
  newfunction("signup");
  var conta = $("#conta1").children().clone();
  conta.appendTo("#conta2");
  $('#bar1, #bar2').css("display","none");
} else if ($("form").hasClass("login")) {
  newfunction("login");
  $('#bar1, #bar2').css("display","");
  var conta = $("#conta1").children().clone();
  conta.appendTo("#conta2");
  $('#conta1').find('.rightBarSquare').addClass("tempp");
  $('#conta1').find('.rightBarSquare').removeClass("rightBarSquare");
  $('#conta1').find('.bottomBarSquare').addClass("tempp temppp");
  $('#conta1').find('.bottomBarSquare').removeClass("bottomBarSquare");
} else {

}

var lv=3;
// get security lv
$('input[name=option]:radio').click( function() {
        // Will get the newly selected value
        lv = getRadioValue();
});

function getRadioValue () {
    if( $('input[name=option]:radio:checked').length > 0 ) {
        return $('input[name=option]:radio:checked').val();
    }
    else {
        return 0;
    }
}

// fill the hidden forms before submit
$('#myform').submit(function(event) {
    if (portfolio.length != lv || corarray1.length != lv || corarray2.length!=lv) {
       $( "#submission" ).text( "Something is incomplete!" ).show().fadeOut(3000);
       event.preventDefault();
    } else {
      $("#portfolio").val(window['portfolio'].toString().split(',').join(''));
      $("#clickpoints1").val(window['corarray1'].toString().split(',').join(''));
      $("#clickpoints2").val(window['corarray2'].toString().split(',').join(''));
      
    }
});

// POPOVER 
$('[data-toggle="tooltip"]').tooltip({html:true})

  // MODAL OPEN UP
  $('.thumbnail').click(
    function(){
    $('.modal-body').empty();
  	var title = $(this).children('img').attr("title");
  	$('.modal-title').html(title);
  	$($(this).find('img').clone()).appendTo('.modal-body');
    console.log($(this).children('img').html());
  	$('#myModal').modal({show:true});

    // THUMBNAIL HOVER EFFECT
$('.thumbnail').hover(
        function(){
            $(this).find('.caption').fadeOut(500); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').fadeIn(500); //.fadeOut(205)
        }
    ); 
});

      // UPLOAD IMG
    function readURL(input,element) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var element = element;
        reader.onload = function (e) {
          var tar = "#"+element;
            $(tar).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
  }

    $("#img_upload1, #img_upload2").change(function(){
        var element = $(this).attr('tar');
        readURL(this,element);
    });
    
    // check username availability
    $('#username_check').click(function() {
        $(this).text('Checking...');
        var csrf_token = $('#csrf_token').val();
        $('#avamsg').text('');
         $('#avamsg').removeAttr('style');

        $.ajax({
            url: '/checkusername/',
            data: $('#username').serialize(),
            type: 'POST',
            datatype: 'json',
           /*
            beforeSend: function (xhr) {
              xhr.setRequestHeader(xhr.setRequestHeader("X-CSRFToken", csrf_token));
            },
          */
            success: function(response) {
               var d = JSON.parse(response)
               $('#username').attr("aria-describedby","usernamestatus");
               $('#d_username').addClass("has-success has-feedback");
               $('#d_username').append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>\
                <span id='usernamestatus' class='sr-only'>(success)</span>");
               $('#avamsg').addClass("bg-success");
                $('#avamsg').text(d.msg);
                $('#username_check').text('Check Username Avaliability');
                $('#avamsg').fadeOut(3000);
            },
            error: function(error) {
                alert(error);
                $('#avamsg').text('error');
            }
        });

    });

// array to store cords
window['corarray1'] = [];
window['corarray2'] = [];

// clickpoint selection ************************************
$("#start_selection1, #start_selection2").click(function(event) {
  var num = event.target.id.slice(-1);
  if ( $("#start_selection"+num).attr('aria-pressed') == 'false') {
    $("#start_selection"+num).text("End Selection");
    $("#start_selection"+num).attr('aria-pressed','true');

    $("#conta"+num+" > div > div.square").click(function(e) {  
      e.stopImmediatePropagation();
      var relX = this.getAttribute("data-letter");
      var relY = this.getAttribute("data-number");
      //alert($(this).attr("data-letter") + ", " + $(this).attr("data-number"));
      if ( $("#start_selection"+num).attr('aria-pressed') == 'true' && window['corarray'+num].length <= lv) {
        if ($(this).hasClass("selectedcell")) {
            $(this).removeClass("selectedcell");
            var cord = relX+""+relY;
            var index = window['corarray'+num].indexOf(cord);
            window['corarray'+num].splice(index, 1);
            $("#num_indicattor"+num).text(window['corarray'+num].toString());
        } else if (window['corarray'+num].length<3) {
          $(this).addClass("selectedcell");
          window['corarray'+num].push(relX+""+relY);
          $("#num_indicattor"+num).text(window['corarray'+num].toString());
      }
    }
    });
  } else {
    $("#start_selection"+num).text("Start Selection");
    $("#start_selection"+num).attr('aria-pressed','false');
  }});

$("#click_reset1, #click_reset2").click(function(e){ 
  var num = e.target.id.slice(-1);
  window['corarray'+num] = []
  $("#conta"+num).find(".square").removeClass("selectedcell");
  $("#start_selection"+num).attr('aria-pressed','false');
  $("#start_selection"+num).attr('class','btn btn-default');
  $("#num_indicattor"+num).text("");
  $("#start_selection"+num).text("Start Selection");
});

// ***********************************************************
    // arry to store portfolio
window['portfolio'] = [];
window['allowedkey'] = [49,50,51,52,53,54,55,56,57,81,87,69,82,84,89,65,83,68,70,71,72,90,88,67,86,66,78]
// portfolio selection
$("#start_selection3").click(function(event) {
  if ( $("#start_selection3").attr('aria-pressed') == 'false') {
    $("#start_selection3").text("End Selection");
    $("#start_selection3").attr('aria-pressed','true');
    $(".portdiv").keydown(function(event) {
       event.stopImmediatePropagation();
      if ( window['allowedkey'].indexOf(parseInt(event.which)) != -1 && window['portfolio'].length <= lv) {
        var cha = String.fromCharCode(event.which);
        window['portfolio']
        var src = $("img[name='"+cha.toUpperCase()+"']").attr("src");
        var filename = src.substr(-8);
        if (window['portfolio'].indexOf(filename) == -1) {
          if (window['portfolio'].length < lv) {
          window['portfolio'].push(filename+"");
          $("#port_indicattor").text(window['portfolio'].toString());
          }
        } else {
          var index = window['portfolio'].indexOf(filename);
            window['portfolio'].splice(index, 1);
            $("#port_indicattor").text(window['portfolio'].toString());
        }
      }  
    })
  } else {
    $("#start_selection3").text("Start Selection");
    $("#start_selection3").attr('aria-pressed','false');
  }});

$("#click_reset3").click(function(e){ 
  $("#start_selection3").attr('aria-pressed','false');
  $("#start_selection3").attr('class','btn btn-default');
  $("#port_indicattor").text("");
  $("#start_selection3").text("Start Selection");
  window['portfolio'] = [];
});


function newfunction(page){


  var arrayLetters = ["A","B","C","D","E","F","G","H","I","J"];
  var arrayNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var tempLetters = ["A","B","C","D","E","F","G","H","I","J"];
  var tempNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var randomNumber;
  var tempValue;
  var arraySquares = document.getElementsByClassName("square");
  var arrayRightSquares = document.getElementsByClassName("rightBarSquare");
  var arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
  var arrayRow1 = document.getElementsByClassName("squareRow1");
  var arrayRow2 = document.getElementsByClassName("squareRow2");
  var arrayRow3 = document.getElementsByClassName("squareRow3");
  var arrayRow4 = document.getElementsByClassName("squareRow4");
  var arrayRow5 = document.getElementsByClassName("squareRow5");
  var arrayRow6 = document.getElementsByClassName("squareRow6");
  var arrayRow7 = document.getElementsByClassName("squareRow7");
  var arrayRow8 = document.getElementsByClassName("squareRow8");
  var arrayRow9 = document.getElementsByClassName("squareRow9");
  var arrayRow10 = document.getElementsByClassName("squareRow10");
  for(i=0; i<arrayRightSquares.length; i++){
    if (page == "login") {
      randomNumber = Math.floor(Math.random() * arrayLetters.length);
      arrayRightSquares[i].setAttribute("data-letter", arrayLetters[randomNumber]);
      arrayRightSquares[i].childNodes[0].innerText = arrayLetters[randomNumber];
      arrayLetters.splice(randomNumber, 1);
    } else {
       arrayRightSquares[i].setAttribute("data-letter", arrayLetters[i]);
        arrayRightSquares[i].childNodes[0].innerText = arrayLetters[i];
    }   
  }
  for(i=0; i<arrayBottomSquares.length; i++){
    if (page == "login") {
    randomNumber = Math.floor(Math.random() * arrayNumbers.length);
    arrayBottomSquares[i].setAttribute("data-number", arrayNumbers[randomNumber]);
    arrayBottomSquares[i].childNodes[0].innerText = arrayNumbers[randomNumber];
    arrayNumbers.splice(randomNumber, 1);
  } else {
     arrayBottomSquares[i].setAttribute("data-number", arrayNumbers[i]);
    arrayBottomSquares[i].childNodes[0].innerText = arrayNumbers[i];
  }
  }


     setSquaresCords();

  
  function setSquaresCords(){
    var arrayRightSquares = document.getElementsByClassName("rightBarSquare");
    var arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
    for(i=0; i<arrayRow1.length; i++){
      arrayRow1[i].setAttribute("data-letter", arrayRightSquares[0].getAttribute("data-letter"));
      arrayRow1[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow2.length; i++){
      arrayRow2[i].setAttribute("data-letter", arrayRightSquares[1].getAttribute("data-letter"));
      arrayRow2[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow3.length; i++){
      arrayRow3[i].setAttribute("data-letter", arrayRightSquares[2].getAttribute("data-letter"));
      arrayRow3[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow4.length; i++){
      arrayRow4[i].setAttribute("data-letter", arrayRightSquares[3].getAttribute("data-letter"));
      arrayRow4[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow5.length; i++){
      arrayRow5[i].setAttribute("data-letter", arrayRightSquares[4].getAttribute("data-letter"));
      arrayRow5[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow6.length; i++){
      arrayRow6[i].setAttribute("data-letter", arrayRightSquares[5].getAttribute("data-letter"));
      arrayRow6[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow7.length; i++){
      arrayRow7[i].setAttribute("data-letter", arrayRightSquares[6].getAttribute("data-letter"));
      arrayRow7[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow8.length; i++){
      arrayRow8[i].setAttribute("data-letter", arrayRightSquares[7].getAttribute("data-letter"));
      arrayRow8[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow9.length; i++){
      arrayRow9[i].setAttribute("data-letter", arrayRightSquares[8].getAttribute("data-letter"));
      arrayRow9[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
    for(i=0; i<arrayRow10.length; i++){
      arrayRow10[i].setAttribute("data-letter", arrayRightSquares[9].getAttribute("data-letter"));
      arrayRow10[i].setAttribute("data-number", arrayBottomSquares[i].getAttribute("data-number"));
    }
  }

  if (page!="signup") {
    document.onkeydown = function(e){
      var key = e.which || e.keyCode;
      if(key == 37) arrowLeft();
      if(key == 38) arrowUp();
      if(key == 39) arrowRight();
      if(key == 40) arrowDown();
    }
  }
  function arrowLeft(){
    arrayRightSquares = document.getElementsByClassName("rightBarSquare");
    arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
    for(i=0; i<arrayBottomSquares.length; i++){
      arrayNumbers.push(arrayBottomSquares[i].getAttribute("data-number"));
    }
    arrayNumbers = arrayNumbers.concat(arrayNumbers.splice(0,1));
    //arrayNumbers.push.apply(arrayNumbers, arrayNumbers.splice(0,1));
    for(i=0; i<arrayBottomSquares.length; i++){
      arrayBottomSquares[i].setAttribute("data-number", arrayNumbers[i]);
      arrayBottomSquares[i].childNodes[0].innerText = arrayNumbers[i];
    }
    setSquaresCords();
  }
  function arrowDown(){
          arrayRightSquares = document.getElementsByClassName("rightBarSquare");
      arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
    for(i=0; i<arrayRightSquares.length; i++){
      arrayLetters.push(arrayRightSquares[i].getAttribute("data-letter"));
    }
    /*
    tempValue = arrayLetters[9];
    arrayLetters.splice(9, 1);
    arrayLetters.splice(0, 0, tempValue);
    */
    arrayLetters = arrayLetters.concat(arrayLetters.splice(0,9));
    for(i=0; i<arrayRightSquares.length; i++){
      arrayRightSquares[i].setAttribute("data-letter", arrayLetters[i]);
      arrayRightSquares[i].childNodes[0].innerText = arrayLetters[i];
    }
    setSquaresCords();
  }
  function arrowRight(){
    arrayRightSquares = document.getElementsByClassName("rightBarSquare");
    arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
    for(i=0; i<arrayBottomSquares.length; i++){
      arrayNumbers.push(arrayBottomSquares[i].getAttribute("data-number"));
    }
    arrayNumbers = arrayNumbers.concat(arrayNumbers.splice(0,9));
    for(i=0; i<arrayBottomSquares.length; i++){
      arrayBottomSquares[i].setAttribute("data-number", arrayNumbers[i]);
      arrayBottomSquares[i].childNodes[0].innerText = arrayNumbers[i];
    }
    setSquaresCords();
  }
  function arrowUp(){
    arrayRightSquares = document.getElementsByClassName("rightBarSquare");
    arrayBottomSquares = document.getElementsByClassName("bottomBarSquare");
    for(i=0; i<arrayRightSquares.length; i++){
      arrayLetters.push(arrayRightSquares[i].getAttribute("data-letter"));
    }
    /*
    tempValue = arrayLetters[0];
    arrayLetters.push(tempValue);
    arrayLetters.splice(0, 1);
    */
    arrayLetters = arrayLetters.concat(arrayLetters.splice(0,1));
    for(i=0; i<arrayRightSquares.length; i++){
      arrayRightSquares[i].setAttribute("data-letter", arrayLetters[i]);
      arrayRightSquares[i].childNodes[0].innerText = arrayLetters[i];
    }
    setSquaresCords();
  }
}

});