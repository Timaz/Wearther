var picID = 1; //Counts number of clothes thumbnails
var state = 0; //Tracks what gender state it is in

$( document ).ready(function() {
    var zipcode = 97202;

    setInitialConditions(); //Sets initial Condition

    $('#genderSwitch').change(function() {
      if(state === 0){
        state=1;
        getWeather(zipcode);
      }
      else{
        state=0;
        getWeather(zipcode);
      }
    });

    $( "#targetGo" ).click(function() {
      zipcode = $("#targetZipcode").val();
      getWeather(zipcode); //Add Zipcode Error Checking
    });

});

function setInitialConditions(){
  $.ajax({
    type: 'GET',
    url: "http://ip-api.com/json",
    success: function(data){
      if(data.zip !== undefined){
        getWeather(data.zip);
      }
      else{
        getWeather(97202);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     getWeather(97202)
    }
  });
}

function resetContainer(){
  picID = 1;
  $("#clothesContainer").empty();
}

function getWeather(zipcode){
  var theURL = 'http://api.wunderground.com/api/678b5b0bef4d12e3/conditions/q/' + zipcode + '.json';

  $.ajax({
    type: 'GET',
    url: theURL,
    success: function(data){
      setIcon(data.current_observation.icon);
      setCurrCond(data.current_observation.display_location.full,
                  data.current_observation.temp_f,
                  data.current_observation.feelslike_f,
                  data.current_observation.wind_mph,
                  data.current_observation.relative_humidity,
                  data.current_observation.pressure_in,
                  data.current_observation.icon);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     //Handle Error Here
    }
  });
}

function setIcon(id){
  var newClass = "wi wi-wu-" + id + " wi-5x";
  $("#targetIcon").attr("class", newClass);
}

function setCurrCond(loc, temp, feels, wind, humid, pressure, icon){
   $("#targetLoc").text("Viewing Wearther for " + loc);
   $("#targetTemp").text("Temperature: " + temp + " °F");
   $("#targetFeels").text("Feels Like: " + feels + " °F");
   $("#targetWind").text("Wind Speed: " + wind + " mph");
   $("#targetHumid").text("Humidity: " + humid);
   $("#targetPressure").text("Pressure: " + pressure + " in");

   if(state === 1){
     setGMClothes(temp, feels, wind, humid, pressure);
   }
   else{
     setLadyClothes(temp, feels, wind, humid, pressure);
   }
   setCommonClothes(feels, humid, icon);

}

function setLadyClothes (temp, feels, wind, humid, pressure){
  resetContainer();
  if(feels < 30){
      addNewPicture("hat-mittens");
      addNewPicture("scarf");
      addNewPicture("heavy-jacket");
      addNewPicture("women-sweater");
      addNewPicture("women-long-sleeve-shirt");
      addNewPicture("pants");
  }
  else if(feels < 40){
      addNewPicture("scarf");
      addNewPicture("light-jacket");
      addNewPicture("women-sweater");
      addNewPicture("women-long-sleeve-shirt");
      addNewPicture("pants");
  }
  else if(feels < 50){
    addNewPicture("women-sweater");
    addNewPicture("women-tshirt");
    addNewPicture("pants");
  }
  else if(feels < 60){
    addNewPicture("women-blouse");
    addNewPicture("pants");
  }
  else if(feels < 70){
    addNewPicture("dress");
  }
  else if(feels > 70){
    addNewPicture("dress");
  }
}

function setGMClothes (temp, feels, wind, humid, pressure, icon){
  resetContainer();
  if(feels < 30){
      addNewPicture("hat-mittens");
      addNewPicture("scarf");
      addNewPicture("heavy-jacket");
      addNewPicture("men-sweater");
      addNewPicture("men-long-sleeve-shirt");
      addNewPicture("pants");
  }
  else if(feels < 40){
      addNewPicture("scarf");
      addNewPicture("light-jacket");
      addNewPicture("men-sweater");
      addNewPicture("men-long-sleeve-shirt");
      addNewPicture("pants");
  }
  else if(feels < 50){
    addNewPicture("men-sweater");
    addNewPicture("men-tshirt");
    addNewPicture("pants");
  }
  else if(feels < 60){
    addNewPicture("men-tshirt");
    addNewPicture("pants");
  }
  else if(feels < 70){
    addNewPicture("men-shorts");
  }
  else if(feels > 70){
    addNewPicture("men-shorts");
  }
}

function setCommonClothes(feels, humid, icon){
  if(feels < 30 || icon === "chancesleat" || icon === "chancesnow" || icon === "flurries" || icon === "snow" || icon === "sleat"){
    addNewPicture("winter-boots");
  }
  else if(icon === "chancerain" || icon === "chancetstorms" || icon === "rain" || icon === "tstorms"){
    addNewPicture("rain-boots");
    addNewPicture("umbrella");
  }
  else if(icon === "sunny"){
    addNewPicture("sunglasses");
  }
  else if(state === 0 && feels >= 60){
    addNewPicture("women-flats");
  }
  else if(state === 0){
    addNewPicture("women-sneakers");
  }
  else if(state === 1){
    addNewPicture("men-sneakers");
  }
}

function addNewPicture(imgname){
  jQuery('<div/>', {
    id: "picDiv" + picID,
    "class": "col-xs-6 col-sm-3"
  }).appendTo('#clothesContainer');

  jQuery('<div/>', {
    id: "thumbDiv" + picID,
    "class": "thumbnail"
  }).appendTo('#picDiv' + picID);

  var img=$("<img />").attr("src","img/" + imgname + ".png");
  img.appendTo($("#thumbDiv" + picID));

  if(picID % 4 ==0){ //To fix some layout issues every 4th picture had
    jQuery('<div/>', {
      "class": "clearfix"
    }).appendTo('#clothesContainer');
  }

  picID++;
}
