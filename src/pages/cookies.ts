export function setCookie(key: string, value: string, path: string = "/") {
  document.cookie = key + "=" + value + ";" + `;path=${path}`;
}


export function getCookie(key: string, source = document.cookie) {
  let name = key + "=";
  let decodedCookie = decodeURIComponent(source);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
