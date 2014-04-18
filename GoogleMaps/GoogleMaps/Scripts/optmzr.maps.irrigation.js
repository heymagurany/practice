function IrrigationControl(map) {
    // Create a div to hold the control.
    var $radiusInput = $("<input type='text' />");
    var $radiusUnitsInput = $("<select><option value='3.2808'>feet</options><option value='1'>meters</options></select>");
    var $radiusContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Arm Length: </div>").append($radiusInput, $radiusUnitsInput);

    var $centerLatInput = $("<input type='text' />");
    var $centerLngInput = $("<input type='text' />");
    var $centerContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Center: </div>").append($centerLatInput, $centerLngInput);

    var $startBearingInput = $("<input type='text' />");
    var $startBearingContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Start Bearing: </div>").append($startBearingInput);

    var $endBearingInput = $("<input type='text' />");
    var $endBearingContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>End Bearing: </div>").append($endBearingInput);

    var $control = $("<div style='padding:5px'></div>").append($radiusContainer, $centerContainer, $startBearingContainer, $endBearingContainer);

    // Set CSS for the control border.
    var addButton = function (text, onClick) {
        var $text = $("<div style='font-family:Arial,sans-serif;font-size:12px;padding-left:4px;padding-right:4px;'></div>").html(text);
        var $button = $("<div style='background-color:white;border-style:solid;border-width:2px;cursor:pointer;text-align:center'></div>").append($text);

        $control.append($button);

        google.maps.event.addDomListener($button[0], "click", onClick);
    }

    this.getElement = function () {
        return $control[0];
    }

    var clickCount = 0;
    var startPoint;
    var startMarker;
    var endPoint;
    var endMarker;
    var centerPoint;
    var centerMarker;
    var radius;
    var arc;
    var infowindow = new google.maps.InfoWindow(
    {
        size: new google.maps.Size(150, 50)
    });

    $radiusContainer.change(function () {
        radius = parseFloat($radiusInput.val()) / parseFloat($radiusUnitsInput.val());

        drawArc();
    });

    $centerLatInput.change(function () {
        if(centerMarker) {
            centerMarker.setMap(null);
        }

        centerPoint = new google.maps.LatLng(parseFloat($centerLatInput.val()), centerPoint.lng());
        centerMarker = createMarker(centerPoint, "Center");
        arc = drawArc();
    });

    $centerLngInput.change(function () {
        if(centerMarker) {
            centerMarker.setMap(null);
        }

        centerPoint = new google.maps.LatLng(centerPoint.lat(), parseFloat($centerLngInput.val()));
        centerMarker = createMarker(centerPoint, "Center");
        arc = drawArc();
    });

    $startBearingInput.change(function () {
        if(startMarker) {
            startMarker.setMap(null);
        }


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

        $centerLatInput.val("");
        $centerLngInput.val("");
        $startBearingInput.val("");
        $endBearingInput.val("");
    });

    var createMarker = function (latlng, html) {
        var contentString = html;
        var marker = new google.maps.Marker({
            draggable: true,
            position: latlng,
            map: map,
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
        return marker;
    }

    var createArcVertices = function (center, start, end, direction) {
        var initialBearing = center.Bearing(start);
        var finalBearing = center.Bearing(end);
        var useRadius;
        var points = 32;
        var extp = new Array();

        if (radius) {
            useRadius = radius;
        } else {
            var distanceFromStart = center.distanceFrom(start);
            var distanceFromEnd = center.distanceFrom(end);

            if (distanceFromStart > distanceFromEnd) {
                useRadius = distanceFromStart;
            } else {
                useRadius = distanceFromEnd;
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
            var point = center.DestinationPoint(initialBearing + i * deltaBearing, useRadius);

            extp.push(point);
        }

        extp.push(center);
        extp.push(center.DestinationPoint(initialBearing, useRadius));

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
            $centerLatInput.val(centerPoint.lat());
            $centerLngInput.val(centerPoint.lng());

            google.maps.event.addListener(centerMarker, "dragend", function (e) {
                centerPoint = e.latLng;
                $centerLatInput.val(centerPoint.lat());
                $centerLngInput.val(centerPoint.lng());
                arc = drawArc();
            });
        } else if (clickCount == 1) {
            startPoint = e.latLng;
            startMarker = createMarker(startPoint, "Start");
            $startBearingInput.val(centerPoint.Bearing(startPoint));

            google.maps.event.addListener(startMarker, "dragend", function (e) {
                startPoint = e.latLng;
                $startBearingInput.val(centerPoint.Bearing(startPoint));
                arc = drawArc();
            });
        } else if (clickCount == 2) {
            endPoint = e.latLng;
            endMarker = createMarker(endPoint, "End");
            $endBearingInput.val(centerPoint.Bearing(endPoint));

            google.maps.event.addListener(endMarker, "dragend", function (e) {
                endPoint = e.latLng;
                $endBearingInput.val(centerPoint.Bearing(endPoint));
                arc = drawArc();
            });

            arc = drawArc();
        } else {
            infowindow.close();
        }

        clickCount++;
    });
}