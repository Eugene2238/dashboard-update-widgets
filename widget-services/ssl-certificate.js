const sslCertificate = require('get-ssl-certificate');
const URL = require('url').URL;

module.exports.sslCertificate = function(widget, callback) {
  const url = new URL(widget.settings.url);

  sslCertificate
    .get(url.hostname, 5000, 443, 'https:')
    .then(function(certificate) {
      // console.log(certificate);
      // console.log(certificate.valid_to);     // 'Nov 20 23:59:59 2019 GMT'

      // warning
      if (new Date(certificate.valid_to) <= new Date().getTime() + 30 * 24 * 60 * 60 * 1000) {
        callback(widget, { date: new Date(), status: 2, expirationDate: certificate.valid_to });
      }

      // danger
      else if (new Date(certificate.valid_to) <= new Date()) {
        callback(widget, { date: new Date(), status: 3, expirationDate: certificate.valid_to });
      }

      // success
      else {
        callback(widget, { date: new Date(), status: 1, expirationDate: certificate.valid_to });
      }
    })
    .catch(function(err) {
      callback(widget, { date: new Date(), status: 3 });
    });
};

// 'bg-primary': widget.result.status === 0,
// 'bg-success': widget.result.status === 1,
// 'bg-warning': widget.result.status === 2,
// 'bg-danger': widget.result.status === 3
