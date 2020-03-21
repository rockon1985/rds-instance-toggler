const respond = {
  ok: (res, result) => {
    res.write(`<h3>Instance Started</h3>
      <p style="white-space: pre-wrap; background: aliceblue">${JSON.stringify(result, null, ' ')}</p>`);
    res.end();
  },
  error: (res, err) => {
    res.write(`<h3>An error occured</h3>
      <p style="white-space: pre-wrap; background: antiquewhite">${JSON.stringify(err, null, ' ')}</p>`);
    res.end();
  },
  info: res => {
    res.write('<h3>Use /start to start the instance and /stop to stop<h3>');
    res.end();
  }
};

module.exports = respond;
