//| this renderer script uses the `document.getElementById` DOM API to replace
//| the displayed text for the HTML element with *info* as its *id* property.

const information = document.getElementById("info");

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

//| NB output of the communicaiton between main process - preload process - renderer process
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // prints out 'pong'
};
func();
