import fetch from "node-fetch";

const myHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  "Cookie":"Cookie_1=value; PHPSESSID=452bd286332cc6ec88045bdcc7259b81"
}

const urlencoded = new URLSearchParams();
urlencoded.append("rooms_min", "3");
urlencoded.append("q", "wf-save-srch");
urlencoded.append("miete_max", "1700");
urlencoded.append("wbs", "0");


const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow",
};

const fetchData = async () => {
  return await fetch(
    "https://inberlinwohnen.de/wp-content/themes/ibw/skript/wohnungsfinder.php",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export default fetchData;
