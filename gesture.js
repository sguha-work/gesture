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
                return imageArray;
            }
            return [];
            
        }),
        compareWithBasicAndFireEvent = (function(screenShot1, screenShot2) {
            if (typeof screenShot1[0] != "undefined") {
                var changeCounter = 0,
                    arrayHeight = screenShot1.length,
                    arrayWidth = screenShot1[0].length,
                    flag = 0;
                for(var index1=0; index1<arrayHeight; index1++) {
                  for(var index2 = index1; index2<arrayWidth; index2++) {
                    if(screenShot1[index1][index2]!=screenShot2[index1][index2]) {
                      changeCounter += 1;
                    }
                    if(changeCounter > (arrayWidth*arrayHeight*0.6)) {
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
        chopMatrix = (function(matrix) {
          var newMatrix = [],
          indexOfNewMatrix = 0;
          for(var index=50; index<=70; index++) {
            if(matrix.length == 0) {
              return [];
            }
            newMatrix[indexOfNewMatrix] = [];
            for(var index2=300; index2<=400; index2++) {
              newMatrix[indexOfNewMatrix].push(matrix[index][index2]);  
            }
            indexOfNewMatrix += 1;
          }
          return newMatrix;
        }),
        startGestureReading = (function() {
            window.setInterval(function() {
                var screenShot1 = chopMatrix(shoot()),
                    screenShot2;
                window.setTimeout(function() {
                    screenShot2 = chopMatrix(shoot());
                    compareWithBasicAndFireEvent(screenShot1, screenShot2);
                }, 500);


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