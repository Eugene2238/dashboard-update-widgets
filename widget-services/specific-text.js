const http = require('http');
const https = require('https');

module.exports.specificText = function(widget, callback) {
    const url = new URL(widget.settings.url);
    let client = http;
    if (url.toString().indexOf("https") === 0) client = https;

    const request = client.request(url, function(res) {
        let data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            if (data.includes(widget.settings.text)) callback(widget, { date: new Date(), status: 1 });
            else callback(widget, { date: new Date(), status: 3 });
        });
    });
    request.on('error', function(e) {
        console.log(e.message);
        callback(widget, { date: new Date(), status: 0 });
    });
    request.end();
};

// 'bg-primary': widget.result.status === 0,
// 'bg-success': widget.result.status === 1,
// 'bg-warning': widget.result.status === 2,
// 'bg-danger': widget.result.status === 3
