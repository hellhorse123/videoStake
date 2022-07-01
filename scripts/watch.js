const WebTorrent = require("webtorrent");

let client = new WebTorrent();

const init = () => {

    torrentId = XHR.response;

    downloadTorrent(torrentId);

    function downloadTorrent(torrentId) {

        console.log(location.host)
        console.log('Downloading torrent from ' + torrentId)
        client.add(torrentId, {
            announce: [
                'ws://localhost:8000'
            ]
        }, onTorrent)
    }

    function onTorrent(torrent) {
        torrent.addWebSeed('http://' + location.host + '/webseed/'+videoID)
        console.log('localhost:8080/webseed/'+videoID);

        torrent.on('warning', console.log)
        torrent.on('error', console.log)

        console.log('Got torrent metadata!')



        console.log(torrent.announce)

        // Find largest file
        var largestFile = torrent.files[0]
        for (var i = 1; i < torrent.files.length; i++) {
            if (torrent.files[i].length > largestFile.length)
                largestFile = torrent.files[i]
        }
        largestFile.appendTo('#video-container')

    }

}


let XHR = new XMLHttpRequest();
XHR.open('GET', 'torrent/' + videoID, true);
XHR.responseType = 'blob';
XHR.send();

XHR.onload = init;

