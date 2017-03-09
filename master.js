$(function() {
    var i = 0;
    var options = {
        url: "./city-list.json",
        getValue: "name",
        ajaxSettings: {
            async: true,
            cache: true
        },
        requestDelay: 500,
        list: {
            showAnimation: {
                type: "fade",
                //normal|slide|fade
                time: 400,
                callback: function() {}
            },
            hideAnimation: {
                type: "slide",
                //normal|slide|fade
                time: 400,
                callback: function() {}
            },
            maxNumberOfElements: 5,
            match: {
                enabled: true
            }
        },
        theme: "plate-dark"
    };
    $("#locationName").easyAutocomplete(options);
    $("#search").click(function(event) {
        /* Act on the event */
        i = 0;
        locationName = $("#locationName").val();
        getWeather(locationName);
        console.log("search click");
    });
    $("#convert").click(function(event) {
        i++;
        if (i % 2 !== 0) {
            temp = $("#temp").text();
            $("#temp").html(convertTemp(temp, "farenheit"));
            console.log(convertTemp(temp));
        } else {
            temp = $("#temp").text();
            $("#temp").html(convertTemp(temp, "celsius"));
        }
    });

    var settings = {
        dataType: "json",
        url: "https://freegeoip.net/json?callback=?",
    }
    $.ajax(settings).done(function(response) {
        coordinates = {
            lat: response.latitude,
            lon: response.longitude
        }

        callApi(coordinates, "ip")
        console.log(response);
    });


});

function getWeather(name) {
    $.ajax({
        url: "./city-list.json",
        async: true,
        cache: true
    }).done(function(data) {
        json = JSON.parse(data);
        // this loop is slowing it down ....
        for (var i = 0; i < json.length; i++) {
            if (json[i].name.toLowerCase() === name.toLowerCase()) {
                console.log(json[i]["_id"]);
                callApi(json[i]["_id"], "id");
                break;
            } else if (i === json.length - 1 && json[i].name.toLowerCase() !== name.toLowerCase()) {
                console.log("name not found");
            }
        }
    }).fail(function() {}).always(function() {});
}

function callApi(identifier, check) {
    if (check === "id") {


        settings = {
            url: "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?id=" + identifier + "&APPID=dbf0eb41d5b7b7996c2105fd1396b8cf&units=imperial",
            method: "GET",
            headers : {origin : ""}
            ,
        };
        $.ajax(settings).done(function(response) {
            console.log(response);
            apllyInfo(response.name, response.main.temp, response.weather[0].description, response.weather[0].icon);
        });
    } else if (check === "ip") {
        settings = {
            "url": "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?units=imperial&APPID=dbf0eb41d5b7b7996c2105fd1396b8cf&lat=" + identifier.lat + "&lon=" + identifier.lon,
            "method": "GET",
            headers: {
                origin : ""
            }
        }

        $.ajax(settings).done(function(response) {
            apllyInfo(response.name, response.main.temp, response.weather[0].description, response.weather[0].icon);
            console.log(response);
        });

    }
}

function apllyInfo(name, temp, descr, icon) {
    $("#name").html(name);
    $("#temp").html(Math.round(temp));
    $("#condition").html(descr);
    $("#icon, #icon2").attr({
        src: "https://openweathermap.org/img/w/" + icon + ".png"
    });
  
}

function convertTemp(temp, mode) {
    if (mode === "farenheit") {
        celsius = Math.round((temp - 32) * 5 / 9);
        return celsius;
    } else {
        farenheit = Math.round(temp * 9 / 5 + 32);
        return farenheit;
    }
}