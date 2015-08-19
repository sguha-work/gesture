var Gesture = (function() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var videoElementId = "video_cameraDisplay",
        eventName = "gest",
        functionToBeFiredOnGest,
        createDomElement = (function() {
            var video = document.createElement("video");
            video.setAttribute("src", "");
            video.setAttribute("style", "display:none;width:400px; height:400px;");
            video.setAttribute("id", videoElementId);
            document.body.appendChild(video);

        }),
        capture = (function(video) {
            var w = video.videoWidth * 0.2,
                h = video.videoHeight * 0.2,
                canvas = document.createElement('canvas'),
                ctx, imageData = {};
            canvas.width = w;
            canvas.height = h;
            ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);
            if (canvas.width) {
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
            return (typeof imageData.data != "undefined") ? imageData.data : {};
        }),
        shoot = (function() {
            var video = document.getElementById(videoElementId);
            var imageData = capture(video),
                imageArray = [],
                imageDataLength;
            if (JSON.stringify(imageData) != "{}" && imageData.length != 0) {
                imageDataLength = imageData.length;
                var x = 0,
                    y = 0;
                for (var index = 0; index < imageDataLength; index++) {
                    if (y < 640) {
                        if (typeof imageArray[x] == "undefined") {
                            imageArray[x] = [];
                        }
                        imageArray[x][y] = imageData[index];
                        y += 1;
                    } else {
                        x += 1;
                        y = 0;
                        if (typeof imageArray[x] == "undefined") {
                            imageArray[x] = [];
                        }
                        imageArray[x][y] = imageData[index];
                    }
                }
            }
            return imageArray;
        }),
        compareWithBasicAndFireEvent = (function(screenShot1, screenShot2) {
            if (typeof screenShot1[0] != "undefined") {
                var changeCounter = 0,
                    arrayLength = screenShot1.length,
                    flag = 0;
                for (var index = 0; index < arrayLength; index++) {
                    if (screenShot1[index][74] != screenShot2[index][74]) {
                        changeCounter += 1;
                        if (changeCounter > ((arrayLength * 0.65))) {
                            flag = 1;
                            break;
                        }
                    }
                }
                if (flag) {
                    functionToBeFiredOnGest("gest");
                }
            }
        }),
        startGestureReading = (function() {
            window.setInterval(function() {
                var screenShot1 = shoot(),
                    screenShot2;
                window.setTimeout(function() {
                    screenShot2 = shoot();
                    compareWithBasicAndFireEvent(screenShot1, screenShot2);
                }, 300);


            }, 1000);
        });
    this.gest = (function(functionToBeFired) {
        var gestObject = {};
        functionToBeFiredOnGest = functionToBeFired;
    });

    this.start = (function() {
        createDomElement();
        var camera = document.getElementById(videoElementId),
            constraints = {
                video: true
            },
            success = (function(stream) {
                camera.src = window.URL.createObjectURL(stream);
                camera.play();
            }),
            failure = (function(error) {
                alert("Error Occcured " + JSON.stringify(error));
            });
        navigator.getUserMedia(constraints, success, failure);
        startGestureReading();
    });




});