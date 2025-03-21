function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    let isScanned = false;

    function onScanSuccess(decodeText, decodeResult) {
        const resultElement = document.getElementById("result");

        if (decodeText.startsWith("http://") || decodeText.startsWith("https://")) {
            resultElement.innerHTML = `
                <a href='${decodeText}' target='_blank' id='qrLink'>${decodeText}</a>
                <button id="copy-link-btn">Copy Link</button>
                <button id="share-link-btn">Share Link</button>
            `;

            document.getElementById('qrLink').onclick = function(event) {
                event.preventDefault();
                window.location.href = decodeText;
            };

            document.getElementById('copy-link-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(decodeText);
                alert('Link copied to clipboard!');
            });

            document.getElementById('share-link-btn').addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'QR Code Link',
                        text: decodeText,
                        url: decodeText,
                    });
                } else {
                    alert('Sharing not supported on this device.');
                }
            });

            isScanned = true;
        } else {
            resultElement.innerHTML = `Scanned Data: ${decodeText}`;
        }
    }

    function onScanError(errorMessage) {
        console.log(errorMessage);
    }

    // Request available cameras and use the back camera if available
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            let backCamera = devices.find(device => device.label.toLowerCase().includes('back'));
            let cameraId = backCamera ? backCamera.id : devices[0].id;

            let scanner = new Html5Qrcode("my-qr-reader");
            scanner.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: 250
                },
                onScanSuccess,
                onScanError
            );
        } else {
            console.log("No camera found");
        }
    }).catch(err => console.log(err));
});
