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
                Redirecting to: <a href='${decodeText}' target='_blank' id='qrLink'>${decodeText}</a>
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
            resultElement.innerHTML = `Your QR code is: <a href='http://${decodeText}' target='_blank'>${decodeText}</a>`;
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

            let htmlscanner = new Html5QrcodeScanner(
                "my-qr-reader",
                { fps: 10, qrbox: 250 },
                false
            );

            htmlscanner.render(onScanSuccess, onScanError, cameraId);
        }
    }).catch(err => console.log(err));
});
