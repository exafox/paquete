/**
 * Opens a provided url in a popup window with minimal window chrome and at the
 * supplied dimensions.
 * @param {String} url - The url to display.
 * @param {String} name - The name of the window.
 * @param {Number} width - Width of the window in pixels.
 * @param {Number} height - Height of the window in pixels.
 */
function createPopupWindow(url, name = 'share', width = 550, height = 420) {
  if (process.server) {
    return;
  }
  const windowProperties = {
    width,
    height,
    left: Math.round(screen.width / 2 - width / 2),
    top:
      screen.height > height ? Math.round(screen.height / 2 - height / 2) : 0,
    toolbar: 0,
    location: 0,
    menubar: 0,
    directories: 0,
    scrollbars: 0,
  };
  window.open(
    url,
    name,
    Object.keys(windowProperties)
      .map((key) => [key, windowProperties[key]].join('='))
      .join(', ')
  );
}

export default createPopupWindow;
