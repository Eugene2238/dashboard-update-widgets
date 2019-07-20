const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
require('./services/mongoose');

require('./models/Widget');
const Widget = mongoose.model('Widget');
const { specificText } = require('./widget-services/specific-text');
const { sslCertificate } = require('./widget-services/ssl-certificate');

app = express();

// schedule tasks to be run on the server
cron.schedule('* * * * * *', function() {
  // console.log('running a task every second');
  Widget.find({ update: { $lt: new Date() } }, function(err, widgets) {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0, len = widgets.length; i < len; i++) {
        if (widgets[i].template.sysName === 'specific-text') specificText(widgets[i], saveWidget);
        else if (widgets[i].template.sysName === 'ssl-certificate') sslCertificate(widgets[i], saveWidget);
      }
    }
  });
});

function saveWidget(widget, result) {
  let newDate = new Date();
  if (widget.settings.frequency === 1) newDate.setTime(newDate.getTime() + 60000 * 10);
  else if (widget.settings.frequency === 2) newDate.setTime(newDate.getTime() + 60000 * 60);
  else newDate.setTime(newDate.getTime() + 60000 * 60 * 24);

  // 1 minute for testing
  // newDate = new Date();
  // newDate.setTime(newDate.getTime() + 60000);

  widget.update = newDate;
  widget.result = result;
  widget.save(function(err) {
    if (err) console.log(err);
  });
}

app.listen(3128);
