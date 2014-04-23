var optmzr = (function () {
    var optmzr = {};

    function createArcVertices(center, initialBearing, finalBearing, radius, direction) {
        var points = 32;
        var extp = new Array();

        if (initialBearing > finalBearing) {
            if (direction == optmzr.IrrigationDirection.CLOCKWISE) {
                finalBearing += 360;
            }
        } else {
            if (direction == optmzr.IrrigationDirection.COUNTER_CLOCKWISE) {
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

        var $clearButton = $("<span style='font-family:Arial,sans-serif;font-size:12px;padding-left:4px;padding-right:4px;'>Clear Irrigation</span>");
        var $saveButton = $("<span style='font-family:Arial,sans-serif;font-size:12px;padding-left:4px;padding-right:4px;'>Save</span>");
        var $buttonContainer = $("<div style='background-color:white;border-style:solid;border-width:2px;cursor:pointer;text-align:center'></div>").append($clearButton, $saveButton);

        var $control = $("<div style='padding:5px'></div>").append($radiusContainer, $directionContainer, $centerContainer, $startBearingContainer, $endBearingContainer, $buttonContainer);

        this.getElement = function () {
            return $control[0];
        }

        var self = this;
        var clickCount = 0;
        var radius;
        var direction = optmzr.IrrigationDirection.CLOCKWISE;
        var centerMarker;
        var startMarker;
        var endEnabled = false;
        var endMarker;
        var shape;
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

            if (endMarker) {
                endMarker.setMap(null);
                endMarker = null;
            }

            draw();

            $endBearingOn.show();
            $endBearingInput.val("").hide();
            $endBearingOff.hide();
        });

        $clearButton.click(function () {
            if (shape) {
                shape.setMap(null);
                shape = null;
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

        $saveButton.click(function () {
           google.maps.event.trigger(self, "save", calculateGeometry());
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

        var calculateGeometry = function () {
            var data = {
                direction: direction
            };

            if (centerMarker) {
                var centerPoint = centerMarker.getPosition();

                data.center = centerPoint;

                if (startMarker) {
                    var startPoint = startMarker.getPosition();

                    data.length = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, startPoint);
                    data.startHeading = google.maps.geometry.spherical.computeHeading(centerPoint, startPoint);

                    if (endMarker) {
                        var endPoint = endMarker.getPosition();

                        data.endHeading = google.maps.geometry.spherical.computeHeading(centerPoint, endPoint);

                        if (radius) {
                            data.radius = radius;
                        } else {
                            var distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, startPoint);
                            var distanceFromEnd = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, endPoint);

                            if (distanceFromStart > distanceFromEnd) {
                                data.radius = distanceFromStart;
                            } else {
                                data.radius = distanceFromEnd;
                            }
                        }
                    } else {
                        data.endHeading = null;

                        if (radius) {
                            data.radius = radius;
                        } else {
                            data.radius = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, startPoint);
                        }
                    }
                } else {
                    data.length = 0;
                    data.startHeading = null;
                    data.endHeading = null;
                }
            } else {
                data.length = 0;
                data.center = null;
                data.startHeading = null;
                data.endHeading = null;
            }

            return data;
        }

        var draw = function () {
            var geometry = calculateGeometry();

            if (geometry.center) {
                $centerLatInput.val(geometry.center.lat());
                $centerLngInput.val(geometry.center.lng());

                if (geometry.startHeading) {
                    $radiusInput.val(geometry.radius * parseFloat($radiusUnitsInput.val()));
                    $startBearingInput.val(geometry.startHeading);

                    if (endMarker) {
                        $endBearingInput.val(geometry.endHeading);

                        var arcPts = createArcVertices(geometry.center, geometry.startHeading, geometry.endHeading, geometry.radius, geometry.direction);

                        if (shape instanceof google.maps.Polygon) {
                            shape.setPath(arcPts);
                        } else {
                            if (shape) {
                                shape.setMap(null);
                            }

                            shape = new google.maps.Polygon($.extend(shapeOptions, {
                                paths: [arcPts],
                                map: map
                            }));
                        }

                    } else {
                        if (shape instanceof google.maps.Circle) {
                            shape.setCenter(geometry.center);
                            shape.setRadius(geometry.radius);
                        } else {
                            if (shape) {
                                shape.setMap(null);
                            }

                            shape = new google.maps.Circle($.extend(shapeOptions, {
                                center: geometry.center,
                                radius: geometry.radius,
                                map: map
                            }));
                        }
                    }
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
    }

    optmzr.IrrigationDirection = {
        CLOCKWISE: 1,
        COUNTER_CLOCKWISE: -1
    };

    return optmzr;
}());