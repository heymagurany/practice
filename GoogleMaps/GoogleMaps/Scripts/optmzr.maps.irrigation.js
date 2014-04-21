var optmzr = (function () {
    var optmzr = {};

    optmzr.IrrigationControl = function (map) {
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

        var $clearButton = $("<div style='background-color:white;border-style:solid;border-width:2px;cursor:pointer;text-align:center'><div style='font-family:Arial,sans-serif;font-size:12px;padding-left:4px;padding-right:4px;'>Clear Irrigation</div></div>");

        var $control = $("<div style='padding:5px'></div>").append($radiusContainer, $centerContainer, $startBearingContainer, $endBearingContainer, $clearButton);

        this.getElement = function () {
            return $control[0];
        }

        var clickCount = 0;
        var startMarker;
        var endMarker;
        var centerMarker;
        var radius;
        var arc;
        var infowindow = new google.maps.InfoWindow({
            size: new google.maps.Size(150, 50)
        });

        $radiusContainer.change(function () {
            radius = parseFloat($radiusInput.val()) / parseFloat($radiusUnitsInput.val());

            drawArc();
        });

        $centerLatInput.change(function () {
            var point = new google.maps.LatLng(parseFloat($centerLatInput.val()), centerMarker.getPosition().lng());
            centerMarker.setPosition(point);
        });

        $centerLngInput.change(function () {
            var point = new google.maps.LatLng(centerMarker.getPosition().lat(), parseFloat($centerLngInput.val()));
            centerMarker.setPosition(point);
        });

        $startBearingInput.change(function () {
            if (startMarker) {
                startMarker.setMap(null);
            }
            var bearing = centerMarker.getPosition().Bearing(startMarker.getPosition());

        });

        $endBearingInput.change(function () {
            if (endMarker) {
                endMarker.setMap(null);
            }
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

        var createArcVertices = function (center, initialBearing, finalBearing, radius, direction) {
            var points = 32;
            var extp = new Array();

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
            if (centerMarker) {
                var center = centerMarker.getPosition();

                $centerLatInput.val(center.lat());
                $centerLngInput.val(center.lng());

                if (startMarker) {
                    var start = startMarker.getPosition();
                    var initialBearing = center.Bearing(start);
                    var useRadius;

                    $startBearingInput.val(initialBearing);

                    if (endMarker) {
                        var end = endMarker.getPosition();
                        var finalBearing = center.Bearing(end);

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

                        $endBearingInput.val(finalBearing);

                        var arcPts = createArcVertices(center, initialBearing, finalBearing, useRadius, optmzr.IrrigationDirection.CLOCKWISE);

                        if (arc) {
                            arc.setMap(null);
                        }

                        arc = new google.maps.Polygon({
                            paths: [arcPts],
                            strokeColor: "#0000FF",
                            strokeOpacity: 0.5,
                            strokeWeight: 2,
                            fillColor: "#0000FF",
                            fillOpacity: 0.35,
                            map: map
                        });
                    } else {
                        if (radius) {
                            useRadius = radius;
                        } else {
                            useRadius = center.distanceFrom(start);
                        }
                    }

                    $radiusInput.val(useRadius * parseFloat($radiusUnitsInput.val()));
                }
            }

            return arc;
        }

        google.maps.event.addListener(map, "click", function (e) {
            if (clickCount == 0) {
                centerMarker = createMarker(e.latLng, "Center");

                google.maps.event.addListener(centerMarker, "position_changed", drawArc);
            } else if (clickCount == 1) {
                startMarker = createMarker(e.latLng, "Start");

                google.maps.event.addListener(startMarker, "position_changed", drawArc);
            } else if (clickCount == 2) {
                endMarker = createMarker(e.latLng, "End");

                google.maps.event.addListener(endMarker, "position_changed", drawArc);

                arc = drawArc();
            } else {
                infowindow.close();
            }

            clickCount++;
        });

        google.maps.event.addDomListener($clearButton[0], "click", function () {
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

            $radiusUnitsInput.val("");
            $centerLatInput.val("");
            $centerLngInput.val("");
            $startBearingInput.val("");
            $endBearingInput.val("");
        });
    }

    optmzr.IrrigationDirection = {
        CLOCKWISE: 1,
        COUNTER_CLOCKWISE: 1
    };

    return optmzr;
}());