function IrrigationControl(map) {
    // Create a div to hold the control.
    var controlDiv = document.createElement('div');

    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map.
    controlDiv.style.padding = '5px';

    var $radiusInput = $("<input type='text' />");
    var $radiusUnitsInput = $("<select><option value='3.2808'>feet</options><option value='1'>meters</options></select>");
    var $radiusContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Arm Length: </div>").append($radiusInput, $radiusUnitsInput);

    controlDiv.appendChild($radiusContainer[0]);

    // Set CSS for the control border.
    var addButton = function (text, onClick) {
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<strong>' + text + '</strong>';

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to Home';
        controlUI.appendChild(controlText);

        controlDiv.appendChild(controlUI);

        google.maps.event.addDomListener(controlUI, "click", onClick);
    }

    this.getElement = function () {
        return controlDiv;
    }

    var clickCount = 0;
    var startPoint;
    var startMarker;
    var endPoint;
    var endMarker;
    var centerPoint;
    var centerMarker;
    var _radius;
    var arc;
    var infowindow = new google.maps.InfoWindow(
    {
        size: new google.maps.Size(150, 50)
    });

    $radiusContainer.change(function (e) {
        _radius = parseFloat($radiusInput.val()) / parseFloat($radiusUnitsInput.val());

        drawArc();
    });

    addButton("Clear Irrigation", function () {
        var objects = [
            arc,
            startMarker,
            endMarker,
            centerMarker
        ];

        for (var i = 0; i < objects.length; i++) {
            if (objects[i]) {
                objects[i].set("map", null);
            }
        }

        clickCount = 0;
    });

    var createMarker = function (latlng, html) {
        var contentString = html;
        var marker = new google.maps.Marker({
            draggable: true,
            position: latlng,
            map: map,
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
        //bounds.extend(latlng);
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
        return marker;
    }

    var createArcVertices = function (center, start, end, direction) {
        var initialBearing = center.Bearing(start);
        var finalBearing = center.Bearing(end);
        var radius;
        var points = 32;
        var extp = new Array();

        if (_radius) {
            radius = _radius;
        } else {
            var distanceFromStart = center.distanceFrom(start);
            var distanceFromEnd = center.distanceFrom(end);

            if (distanceFromStart > distanceFromEnd) {
                radius = distanceFromStart;
            } else {
                radius = distanceFromEnd;
            }
        }

        if (initialBearing > finalBearing) {
            if (direction > 0) {
                finalBearing += 360;
            }
        } else {
            if (direction < 0) {
                finalBearing -= 360;
            }
        }

        var deltaBearing = (finalBearing - initialBearing) / points;
        var maxBearing = 5;

        while ((deltaBearing < -maxBearing) || (deltaBearing > maxBearing)) {
            points *= 2;
            deltaBearing = (finalBearing - initialBearing) / points;
        }

        for (var i = 0; i <= points; i++) {
            var point = center.DestinationPoint(initialBearing + i * deltaBearing, radius);

            extp.push(point);
        }

        extp.push(center);
        extp.push(center.DestinationPoint(initialBearing, radius));

        return extp;
    }

    var drawArc = function () {
        if (startPoint && endPoint && centerPoint) {
            if (arc) {
                arc.setMap(null);
            }

            var arcPts = createArcVertices(centerPoint, startPoint, endPoint, 1);

            arc = new google.maps.Polygon({
                paths: [arcPts],
                strokeColor: "#0000FF",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.35,
                map: map
            });
        }

        return arc;
    }

    google.maps.event.addListener(map, "click", function (e) {
        if (clickCount == 0) {
            centerPoint = e.latLng;
            centerMarker = createMarker(centerPoint, "Center");

            google.maps.event.addListener(centerMarker, "dragend", function (e) {
                centerPoint = e.latLng;

                arc = drawArc();
            });
        } else if (clickCount == 1) {
            startPoint = e.latLng;
            startMarker = createMarker(startPoint, "Start");

            google.maps.event.addListener(startMarker, "dragend", function (e) {
                startPoint = e.latLng;

                arc = drawArc();
            });
        } else if (clickCount == 2) {
            endPoint = e.latLng;
            endMarker = createMarker(endPoint, "End");

            google.maps.event.addListener(endMarker, "dragend", function (e) {
                endPoint = e.latLng;

                arc = drawArc();
            });

            arc = drawArc();
        } else {
            infowindow.close();
        }

        clickCount++;
    });
}