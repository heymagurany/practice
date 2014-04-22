var optmzr = (function () {
    var optmzr = {};

    function createArcVertices(center, initialBearing, finalBearing, radius, direction) {
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
            var point = google.maps.geometry.spherical.computeOffset(center, radius, initialBearing + i * deltaBearing);

            extp.push(point);
        }

        extp.push(center);
        extp.push(google.maps.geometry.spherical.computeOffset(center, radius, initialBearing));

        return extp;
    }

    function updateMarkerHeading(centerMarker, targetMarker, heading) {
        var centerPoint = centerMarker.getPosition();
        var startPoint = targetMarker.getPosition();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, startPoint);
        var destinationPoint = google.maps.geometry.spherical.computeOffset(centerPoint, distance, heading);

        targetMarker.setPosition(destinationPoint);
    }

    optmzr.IrrigationControl = function (map) {
        var $radiusInput = $("<input type='text' />");
        var $radiusUnitsInput = $("<select><option value='3.2808'>feet</options><option value='1'>meters</options></select>");
        var $radiusContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Arm Length: </div>").append($radiusInput, $radiusUnitsInput);

        var $directionClockwiseOption = $("<option>clockwise</option>").val(optmzr.IrrigationDirection.CLOCKWISE);
        var $directionCounterClockwiseOption = $("<option>counter-clockwise</option>").val(optmzr.IrrigationDirection.COUNTER_CLOCKWISE);
        var $directionInput = $("<select></select>").append($directionClockwiseOption, $directionCounterClockwiseOption);
        var $directionContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Direction: </div>").append($directionInput);

        var $centerLatInput = $("<input type='text' />");
        var $centerLngInput = $("<input type='text' />");
        var $centerContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Center: </div>").append($centerLatInput, $centerLngInput);

        var $startBearingInput = $("<input type='text' />");
        var $startBearingContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>Start Bearing: </div>").append($startBearingInput);

        var $endBearingOn = $("<a href='#'>Specify End Bearing</a>");
        var $endBearingInput = $("<input type='text' />").hide();
        var $endBearingOff = $("<a href='#'>Nevermind</a>").hide();
        var $endBearingContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;padding-left:4px;padding-right:4px'>End Bearing: </div>").append($endBearingOn, $endBearingInput, $endBearingOff);

        var $clearButton = $("<div style='background-color:white;border-style:solid;border-width:2px;cursor:pointer;text-align:center'><div style='font-family:Arial,sans-serif;font-size:12px;padding-left:4px;padding-right:4px;'>Clear Irrigation</div></div>");

        var $control = $("<div style='padding:5px'></div>").append($radiusContainer, $directionContainer, $centerContainer, $startBearingContainer, $endBearingContainer, $clearButton);

        this.getElement = function () {
            return $control[0];
        }

        var clickCount = 0;
        var radius;
        var direction = optmzr.IrrigationDirection.CLOCKWISE;
        var centerMarker;
        var startMarker;
        var endEnabled = false;
        var endMarker;
        var arc;
        var shapeOptions = {
            strokeColor: "#0000FF",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#0000FF",
            fillOpacity: 0.35
        };
        var infowindow = new google.maps.InfoWindow({
            size: new google.maps.Size(150, 50)
        });

        $radiusContainer.change(function () {
            radius = parseFloat($radiusInput.val()) / parseFloat($radiusUnitsInput.val());

            draw();
        });

        $directionInput.change(function () {
            direction = parseInt($directionInput.val());

            draw();
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
            var heading = parseFloat($startBearingInput.val());

            updateMarkerHeading(centerMarker, startMarker, heading);
        });

        $endBearingOn.click(function () {
            endEnabled = true;
            $endBearingOn.hide();
            $endBearingInput.show();
            $endBearingOff.show();
        });

        $endBearingInput.change(function () {
            var heading = parseFloat($endBearingInput.val());

            updateMarkerHeading(centerMarker, endMarker, heading);
        });

        $endBearingOff.click(function () {
            endEnabled = false;
            clickCount--;

            if(endMarker) {
                endMarker.setMap(null);
                endMarker = null;
            }

            draw();

            $endBearingOn.show();
            $endBearingInput.val("").hide();
            $endBearingOff.hide();
        });

        var createMarker = function (latlng, html) {
            var marker = new google.maps.Marker({
                draggable: true,
                position: latlng,
                map: map,
                zIndex: Math.round(latlng.lat() * -100000) << 5
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(html);
                infowindow.open(map, marker);
            });

            google.maps.event.addListener(marker, "position_changed", draw);

            return marker;
        }

        var draw = function () {
            if (centerMarker) {
                var center = centerMarker.getPosition();

                $centerLatInput.val(center.lat());
                $centerLngInput.val(center.lng());

                if (startMarker) {
                    var start = startMarker.getPosition();
                    var initialBearing = google.maps.geometry.spherical.computeHeading(center, start);
                    var useRadius;

                    $startBearingInput.val(initialBearing);

                    if (endMarker) {
                        var end = endMarker.getPosition();
                        var finalBearing = google.maps.geometry.spherical.computeHeading(center, end);

                        if (radius) {
                            useRadius = radius;
                        } else {
                            var distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(center, start);
                            var distanceFromEnd = google.maps.geometry.spherical.computeDistanceBetween(center, end);

                            if (distanceFromStart > distanceFromEnd) {
                                useRadius = distanceFromStart;
                            } else {
                                useRadius = distanceFromEnd;
                            }
                        }

                        $endBearingInput.val(finalBearing);

                        var arcPts = createArcVertices(center, initialBearing, finalBearing, useRadius, direction);

                        if (arc instanceof google.maps.Polygon) {
                            arc.setPath(arcPts);
                        } else {
                            if (arc) {
                                arc.setMap(null);
                            }

                            arc = new google.maps.Polygon($.extend(shapeOptions, {
                                paths: [arcPts],
                                map: map
                            }));
                        }

                    } else {
                        if (radius) {
                            useRadius = radius;
                        } else {
                            useRadius = google.maps.geometry.spherical.computeDistanceBetween(center, start);
                        }

                        if (arc instanceof google.maps.Circle) {
                            arc.setCenter(center);
                            arc.setRadius(useRadius);
                        } else {
                            if (arc) {
                                arc.setMap(null);
                            }

                            arc = new google.maps.Circle($.extend(shapeOptions, {
                                center: center,
                                radius: useRadius,
                                map: map
                            }));
                        }
                    }

                    $radiusInput.val(useRadius * parseFloat($radiusUnitsInput.val()));
                }
            }
        }

        google.maps.event.addListener(map, "click", function (e) {
            if (clickCount == 0) {
                clickCount++;
                centerMarker = createMarker(e.latLng, "Center");
            } else if (clickCount == 1) {
                clickCount++;
                startMarker = createMarker(e.latLng, "Start");
                draw();
            } else {
                if (endEnabled && (clickCount == 2)) {
                    clickCount++;
                    endMarker = createMarker(e.latLng, "End");
                    draw();
                }
            }

            infowindow.close();
        });

        google.maps.event.addDomListener($clearButton[0], "click", function () {
            if(arc) {
                arc.setMap(null);
                arc = null;
            }

            if (startMarker) {
                startMarker.setMap(null);
                startMarker = null;
            }

            if (endMarker) {
                endMarker.setMap(null);
                endMarker = null;
            }

            if (centerMarker) {
                centerMarker.setMap(null);
                centerMarker = null;
            }

            clickCount = 0;

            $radiusInput.val("");
            $centerLatInput.val("");
            $centerLngInput.val("");
            $startBearingInput.val("");
            $endBearingInput.val("");
        });
    }

    optmzr.IrrigationDirection = {
        CLOCKWISE: 1,
        COUNTER_CLOCKWISE: -1
    };

    return optmzr;
}());